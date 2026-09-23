// -------------------------------------------------
// Deterministic status synthesis (§5)
// -------------------------------------------------

import type { EvidenceCheckResult, FindingResult } from './types';

export interface SynthesisResult {
  claimStatus: string;
  riskLevel: string;
  recommendedAction: string;
}

/**
 * Deterministic synthesis: given evidence check results, compute final claim status.
 *
 * Rules (§5, applied in order):
 * 1. Any CONFLICTING → claim CONFLICTING, risk HIGH
 * 2. Else ≥2 UNVERIFIED/NOT_FOUND → UNVERIFIED, risk MEDIUM
 * 3. Else any POLICY_EXCEPTION → POLICY_EXCEPTION, risk MEDIUM
 * 4. Else → VERIFIED, risk LOW
 */
export function synthesizeStatus(
  evidenceItems: EvidenceCheckResult[],
  findings: FindingResult[]
): SynthesisResult {
  const hasConflicting = evidenceItems.some(
    (e) => e.status === 'CONFLICTING' || e.status === 'MISMATCH'
  );

  const unverifiedCount = evidenceItems.filter(
    (e) => e.status === 'UNVERIFIED' || e.status === 'NOT_FOUND'
  ).length;

  const hasPolicyException = evidenceItems.some(
    (e) => e.status === 'POLICY_EXCEPTION'
  );

  const hasCriticalFinding = findings.some((f) => f.severity === 'CRITICAL');

  // Rule 0: Zero-Tolerance Forgery & AI Generation Policy
  const forgeryFinding = findings.find(f => f.sourceRef === 'VISUAL_FORENSICS' && f.severity === 'CRITICAL');
  if (forgeryFinding) {
    return {
      claimStatus: 'CONFLICTING',
      riskLevel: 'CRITICAL',
      recommendedAction: `REJECT & INVESTIGATE — Document failed visual forensics. Reason: ${forgeryFinding.detail}. This is a critical violation of corporate policy.`,
    };
  }

  // Rule 1: Any conflicting evidence
  if (hasConflicting || hasCriticalFinding) {
    return {
      claimStatus: 'CONFLICTING',
      riskLevel: 'HIGH',
      recommendedAction: buildRecommendation('CONFLICTING', findings),
    };
  }

  // Rule 2: Multiple unverified/not-found
  if (unverifiedCount >= 2) {
    return {
      claimStatus: 'UNVERIFIED',
      riskLevel: 'MEDIUM',
      recommendedAction: buildRecommendation('UNVERIFIED', findings),
    };
  }

  // Also unverified if transaction specifically not found
  const txnNotFound = evidenceItems.some(
    (e) => e.source === 'CARD_LEDGER' && e.status === 'NOT_FOUND'
  );
  if (txnNotFound && unverifiedCount >= 1) {
    return {
      claimStatus: 'UNVERIFIED',
      riskLevel: 'MEDIUM',
      recommendedAction: buildRecommendation('UNVERIFIED', findings),
    };
  }

  // Rule 3: Policy exception
  if (hasPolicyException) {
    return {
      claimStatus: 'POLICY_EXCEPTION',
      riskLevel: 'MEDIUM',
      recommendedAction: buildRecommendation('POLICY_EXCEPTION', findings),
    };
  }

  // Rule 4: Everything verified
  return {
    claimStatus: 'VERIFIED',
    riskLevel: 'LOW',
    recommendedAction: buildRecommendation('VERIFIED', findings),
  };
}

function buildRecommendation(status: string, findings: FindingResult[]): string {
  switch (status) {
    case 'CONFLICTING': {
      const criticals = findings.filter((f) => f.severity === 'CRITICAL');
      const issues = criticals.map((f) => f.title).join('; ');
      return `Request Evidence — conflicting evidence identified: ${issues || 'see findings for details'}. Ask the employee to provide clarification before proceeding.`;
    }
    case 'UNVERIFIED':
      return 'Hold — Insufficient Evidence. Request additional documentation such as a personal card statement, ride confirmation, or travel booking to verify this claim.';
    case 'POLICY_EXCEPTION': {
      const policyFindings = findings.filter((f) => f.sourceRef.includes('POLICY'));
      const details = policyFindings.map((f) => f.title).join('; ');
      return `Escalate for approval — ${details || 'policy limit exceeded'}. This is not an indication of wrongdoing — may be legitimate with management approval.`;
    }
    case 'VERIFIED':
      return 'Approve — all evidence sources corroborate this claim.';
    default:
      return 'Review the evidence and take appropriate action.';
  }
}
