// -------------------------------------------------
// Evidence Engine type definitions
// -------------------------------------------------

export interface ClaimData {
  id: string;
  empId: string;
  merchantRaw: string;
  amount: number;
  currency: string;
  date: Date;
  category: string;
  description: string;
  receiptId: string | null;
  receiptFileKey: string | null;
}

export interface ExtractionData {
  merchant: string;
  amount: number;
  date: string;
  taxNo: string;
  receiptId: string;
}

export interface ConfidenceData {
  merchant: number;
  amount: number;
  date: number;
  taxNo: number;
  receiptId: number;
}

export type EvidenceCheckStatus =
  | 'VERIFIED'
  | 'CONFLICTING'
  | 'UNVERIFIED'
  | 'NOT_FOUND'
  | 'POLICY_EXCEPTION'
  | 'MATCH'
  | 'MISMATCH';

export interface EvidenceCheckResult {
  source: string;
  kind: string;
  status: EvidenceCheckStatus;
  detail: Record<string, unknown>;
  summary: string;
}

export interface FindingResult {
  rank: number;
  title: string;
  detail: string;
  sourceRef: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface EngineOutput {
  claimStatus: string;
  riskLevel: string;
  evidenceItems: EvidenceCheckResult[];
  findings: FindingResult[];
  recommendedAction: string;
}
