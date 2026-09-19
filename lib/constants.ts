// -------------------------------------------------
// Status, source, and severity enums + color maps
// -------------------------------------------------

export const CLAIM_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  CONFLICTING: 'CONFLICTING',
  UNVERIFIED: 'UNVERIFIED',
  POLICY_EXCEPTION: 'POLICY_EXCEPTION',
  RECONSTRUCTED_VERIFIED: 'RECONSTRUCTED_VERIFIED',
} as const;

export type ClaimStatus = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

export const EVIDENCE_SOURCE = {
  CARD_LEDGER: 'CARD_LEDGER',
  MERCHANT_REGISTRY: 'MERCHANT_REGISTRY',
  GST_REGISTRY: 'GST_REGISTRY',
  TRAVEL_BOOKINGS: 'TRAVEL_BOOKINGS',
  POLICY: 'POLICY',
  PRIOR_CLAIMS: 'PRIOR_CLAIMS',
  INVOICE_PO: 'INVOICE_PO',
  CALENDAR: 'CALENDAR',
  LOCATION: 'LOCATION',
} as const;

export type EvidenceSource = (typeof EVIDENCE_SOURCE)[keyof typeof EVIDENCE_SOURCE];

export const CHECK_STATUS = {
  VERIFIED: 'VERIFIED',
  CONFLICTING: 'CONFLICTING',
  UNVERIFIED: 'UNVERIFIED',
  NOT_FOUND: 'NOT_FOUND',
  POLICY_EXCEPTION: 'POLICY_EXCEPTION',
  MATCH: 'MATCH',
  MISMATCH: 'MISMATCH',
} as const;

export type CheckStatus = (typeof CHECK_STATUS)[keyof typeof CHECK_STATUS];

export const SEVERITY = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
} as const;

export type Severity = (typeof SEVERITY)[keyof typeof SEVERITY];

export const DECISION_ACTION = {
  APPROVE: 'APPROVE',
  HOLD: 'HOLD',
  REJECT: 'REJECT',
  REQUEST_EVIDENCE: 'REQUEST_EVIDENCE',
  INVESTIGATE: 'INVESTIGATE',
} as const;

export type DecisionAction = (typeof DECISION_ACTION)[keyof typeof DECISION_ACTION];

// -------------------------------------------------
// Status → UI color mapping (the four §2.2 states)
// -------------------------------------------------

export const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string; icon: string }> = {
  VERIFIED: {
    label: 'Verified',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/30',
    icon: '🟢',
  },
  CONFLICTING: {
    label: 'Conflicting Evidence',
    color: 'text-red-400',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/30',
    icon: '🔴',
  },
  UNVERIFIED: {
    label: 'Unverified',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/30',
    icon: '🟡',
  },
  POLICY_EXCEPTION: {
    label: 'Policy Exception',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-orange-500/30',
    icon: '🟠',
  },
  RECONSTRUCTED_VERIFIED: {
    label: 'Reconstructed — Verified',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/30',
    icon: '🟢',
  },
  PENDING: {
    label: 'Pending Review',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/15',
    borderColor: 'border-slate-500/30',
    icon: '⏳',
  },
};

// -------------------------------------------------
// Evidence source → display labels
// -------------------------------------------------

export const SOURCE_LABELS: Record<string, string> = {
  CARD_LEDGER: 'Corporate Card Ledger',
  MERCHANT_REGISTRY: 'Merchant Registry',
  GST_REGISTRY: 'GST Registry (mock)',
  TRAVEL_BOOKINGS: 'Travel Bookings',
  POLICY: 'Policy',
  PRIOR_CLAIMS: 'Prior Claims',
  INVOICE_PO: 'Invoice / PO',
  CALENDAR: 'Calendar',
  LOCATION: 'Location',
};

// -------------------------------------------------
// §1.5 Forbidden words (for grep tests)
// -------------------------------------------------

export const FORBIDDEN_WORDS = [
  'fraud',
  'fraudster',
  'fake',
  'forged',
] as const;

// -------------------------------------------------
// UNVERIFIED explainer (§2.2 — rendered under every UNVERIFIED badge)
// -------------------------------------------------

export const UNVERIFIED_EXPLAINER =
  'Missing evidence is not an indication of wrongdoing. This claim requires additional documentation to complete verification.';

export const RECONSTRUCTED_EXPLAINER =
  'This receipt was reconstructed from a lost original. The expense has been independently verified through registry and transaction records.';

// -------------------------------------------------
// Amount and date tolerances (§5 check 3)
// -------------------------------------------------

export const AMOUNT_TOLERANCE_PERCENT = 1; // ±1%
export const AMOUNT_TOLERANCE_ABSOLUTE = 10; // ±₹10
export const DATE_TOLERANCE_DAYS = 2; // ±2 days

// -------------------------------------------------
// Fuzzy match threshold
// -------------------------------------------------

export const FUZZY_MATCH_THRESHOLD = 0.75; // Levenshtein similarity ≥ 75%
