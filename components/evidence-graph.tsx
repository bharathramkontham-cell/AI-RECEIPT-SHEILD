'use client';

import { useState } from 'react';
import {
  FileText, Search, CreditCard, MapPin, Building2,
  CheckCircle2, XCircle, HelpCircle, AlertTriangle, X,
} from 'lucide-react';

interface EvidenceNode {
  id: string;
  label: string;
  source: string;
  status: 'VERIFIED' | 'CONFLICTING' | 'UNVERIFIED' | 'POLICY_EXCEPTION' | 'MATCH' | 'MISMATCH' | 'NOT_FOUND' | 'PENDING';
  summary: string;
  detail?: string;
  icon: React.ReactNode;
}

interface EvidenceGraphProps {
  claimId: string;
  merchantRaw: string;
  amount: number;
  status: string;
  evidenceItems: {
    id: string;
    source: string;
    kind: string;
    status: string;
    summary: string;
    detail: string;
  }[];
}

const SOURCE_ICON: Record<string, React.ReactNode> = {
  CARD_LEDGER: <CreditCard className="w-4 h-4" />,
  MERCHANT_REGISTRY: <Building2 className="w-4 h-4" />,
  GST_REGISTRY: <Building2 className="w-4 h-4" />,
  TRAVEL_BOOKINGS: <MapPin className="w-4 h-4" />,
  POLICY: <AlertTriangle className="w-4 h-4" />,
  PRIOR_CLAIMS: <Search className="w-4 h-4" />,
  INVOICE_PO: <FileText className="w-4 h-4" />,
  LOCATION: <MapPin className="w-4 h-4" />,
};

const SOURCE_LABEL: Record<string, string> = {
  CARD_LEDGER: 'Transaction',
  MERCHANT_REGISTRY: 'Merchant',
  GST_REGISTRY: 'GST Registry',
  TRAVEL_BOOKINGS: 'Travel',
  POLICY: 'Policy',
  PRIOR_CLAIMS: 'Duplicates',
  INVOICE_PO: 'Invoice / PO',
  LOCATION: 'Location',
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'VERIFIED': case 'MATCH': return 'text-emerald-400';
    case 'CONFLICTING': case 'MISMATCH': return 'text-red-400';
    case 'UNVERIFIED': case 'NOT_FOUND': return 'text-amber-400';
    case 'POLICY_EXCEPTION': return 'text-orange-400';
    default: return 'text-[var(--color-text-muted)]';
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case 'VERIFIED': case 'MATCH': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'CONFLICTING': case 'MISMATCH': return 'bg-red-500/10 border-red-500/20';
    case 'UNVERIFIED': case 'NOT_FOUND': return 'bg-amber-500/10 border-amber-500/20';
    case 'POLICY_EXCEPTION': return 'bg-orange-500/10 border-orange-500/20';
    default: return 'bg-[var(--color-bg-hover)] border-[var(--color-border-default)]';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'VERIFIED': case 'MATCH': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    case 'CONFLICTING': case 'MISMATCH': return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    case 'UNVERIFIED': case 'NOT_FOUND': return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
    case 'POLICY_EXCEPTION': return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
    default: return <HelpCircle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'VERIFIED': case 'MATCH': return 'Verified';
    case 'CONFLICTING': case 'MISMATCH': return 'Conflicting';
    case 'UNVERIFIED': case 'NOT_FOUND': return 'Unverified';
    case 'POLICY_EXCEPTION': return 'Policy Exception';
    default: return 'Pending';
  }
}

export function EvidenceGraph({ claimId, merchantRaw, amount, status, evidenceItems }: EvidenceGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Build nodes from evidence items
  const nodes: EvidenceNode[] = evidenceItems.map((ei) => ({
    id: ei.id,
    label: SOURCE_LABEL[ei.source] || ei.source,
    source: ei.source,
    status: ei.status as EvidenceNode['status'],
    summary: ei.summary,
    detail: ei.detail,
    icon: SOURCE_ICON[ei.source] || <Search className="w-4 h-4" />,
  }));

  const selected = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="card overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)] flex items-center justify-between">
        <h3 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Evidence Graph</h3>
        <span className="text-[0.625rem] text-[var(--color-text-muted)]">{nodes.length} sources checked</span>
      </div>

      <div className="p-4">
        {/* Graph visualization */}
        <div className="flex flex-col items-center gap-0">
          {/* Receipt node */}
          <div className="flex flex-col items-center">
            <div className={`px-4 py-2 rounded-lg border ${getStatusBg(status)} flex items-center gap-2`}>
              <FileText className={`w-4 h-4 ${getStatusColor(status)}`} />
              <div>
                <div className="text-[0.8125rem] font-medium text-[var(--color-text-primary)]">{merchantRaw}</div>
                <div className="text-[0.625rem] text-[var(--color-text-muted)]">₹{amount.toLocaleString('en-IN')}</div>
              </div>
            </div>
            {/* Connector line */}
            <div className="w-px h-6 bg-[var(--color-border-default)]" />
          </div>

          {/* Claim node */}
          <div className="flex flex-col items-center">
            <div className="px-3 py-1.5 rounded-md bg-[var(--color-bg-hover)] border border-[var(--color-border-default)]">
              <div className="text-[0.6875rem] font-medium text-[var(--color-text-secondary)] text-center">{claimId.toUpperCase()}</div>
            </div>
            {/* Connector line */}
            <div className="w-px h-6 bg-[var(--color-border-default)]" />
            {/* Branch connector */}
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-[var(--color-border-default)]" />
            </div>
          </div>

          {/* Evidence nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-lg mt-1">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all text-center ${
                  selectedNode === node.id
                    ? `${getStatusBg(node.status)} ring-1 ring-[var(--color-border-focus)]`
                    : `border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-elevated)]`
                }`}
                aria-pressed={selectedNode === node.id}
              >
                {/* Connector dot */}
                <div className={`w-1.5 h-1.5 rounded-full -mt-1 ${getStatusColor(node.status).replace('text-', 'bg-')}`} />
                <div className={getStatusColor(node.status)}>{node.icon}</div>
                <div className="text-[0.625rem] font-medium text-[var(--color-text-primary)] leading-tight">{node.label}</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(node.status)}
                  <span className={`text-[0.5625rem] font-medium ${getStatusColor(node.status)}`}>
                    {getStatusLabel(node.status)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Connector to result */}
          <div className="flex flex-col items-center mt-2">
            <div className="w-px h-6 bg-[var(--color-border-default)]" />
            <div className={`px-4 py-2 rounded-lg border ${getStatusBg(status)} flex items-center gap-2`}>
              {getStatusIcon(status)}
              <span className={`text-[0.8125rem] font-semibold ${getStatusColor(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="border-t border-[var(--color-border-default)] p-3.5 animate-in">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={getStatusColor(selected.status)}>{selected.icon}</div>
              <div>
                <div className="text-[0.8125rem] font-medium text-[var(--color-text-primary)]">{selected.label}</div>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(selected.status)}
                  <span className={`text-[0.6875rem] font-medium ${getStatusColor(selected.status)}`}>
                    {getStatusLabel(selected.status)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Close detail"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-relaxed">{selected.summary}</p>
        </div>
      )}
    </div>
  );
}
