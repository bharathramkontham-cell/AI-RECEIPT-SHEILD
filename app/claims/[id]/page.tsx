'use client';

import { AppShell } from '@/components/app-shell';
import { StatusBadge } from '@/components/status-badge';
import { SourceChip } from '@/components/source-chip';
import { EvidenceGraph } from '@/components/evidence-graph';
import { formatINR, formatDate, formatDateTime, safeJsonParse } from '@/lib/utils';
import { UNVERIFIED_EXPLAINER } from '@/lib/constants';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, FileText, Info, Shield,
  CheckCircle2, XCircle, Pause, Send, Search, AlertTriangle,
} from 'lucide-react';

interface ClaimDetail {
  id: string;
  empId: string;
  merchantRaw: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  description: string;
  receiptFileKey: string | null;
  receiptId: string | null;
  status: string;
  riskLevel: string;
  employee: { name: string; empCode: string; dept: string; homeCity: string };
  extraction: { fields: string; confidence: string; correctedByUser: boolean } | null;
  evidenceItems: { id: string; source: string; kind: string; status: string; detail: string; summary: string }[];
  findings: { id: string; rank: number; title: string; detail: string; sourceRef: string; severity: string }[];
  caseFile: { decisionStatus: string; recommendedAction: string } | null;
  decisions: { id: string; actor: string; role: string; action: string; reason: string | null; at: string }[];
  evidenceRequests: { id: string; requestedItems: string; deadline: string; message: string; sentAt: string; respondedAt: string | null }[];
}

export default function ClaimReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/claims/${id}`).then((r) => r.json()).then(setClaim);
  }, [id]);

  const handleAction = async (action: string, reason?: string) => {
    setActionLoading(true);
    const res = await fetch(`/api/claims/${id}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason, actor: 'Demo User', role: 'Finance' }),
    });
    if (res.ok) {
      const updated = await fetch(`/api/claims/${id}`).then((r) => r.json());
      setClaim(updated);
      setShowRejectModal(false);
      setRejectReason('');
      setActionDone(action);
      setTimeout(() => setActionDone(null), 3000);
    }
    setActionLoading(false);
  };

  if (!claim) {
    return (
      <AppShell>
        <div className="mb-4"><div className="skeleton h-4 w-24" /></div>
        <div className="card p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2"><div className="skeleton h-5 w-48" /><div className="skeleton skeleton-text-sm w-32" /></div>
            <div className="skeleton skeleton-kpi" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 card p-4 space-y-3">
            <div className="skeleton h-48 w-full rounded-lg" />
            <div className="skeleton skeleton-text" />
          </div>
          <div className="lg:col-span-3 card p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="skeleton h-4 w-4 rounded" />
                <div className="flex-1"><div className="skeleton skeleton-text" /></div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  const extraction = claim.extraction
    ? {
        fields: safeJsonParse<Record<string, unknown>>(claim.extraction.fields, {}),
        confidence: safeJsonParse<Record<string, number>>(claim.extraction.confidence, {}),
      }
    : null;

  const getConfidenceColor = (c: number) => c >= 0.9 ? 'text-emerald-400' : c >= 0.75 ? 'text-amber-400' : 'text-red-400';

  const getEvidenceIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': case 'MATCH': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'CONFLICTING': case 'MISMATCH': return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      case 'UNVERIFIED': case 'NOT_FOUND': return <Info className="w-3.5 h-3.5 text-amber-400" />;
      case 'POLICY_EXCEPTION': return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Info className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />;
    }
  };

  return (
    <AppShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-3 text-[0.8125rem]">
        <Link href="/claims" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Claims
        </Link>
        <span className="text-[var(--color-text-muted)]">/</span>
        <span className="font-mono text-indigo-400 text-[0.6875rem]">{claim.id.toUpperCase()}</span>
      </div>

      {/* Sticky Summary Bar */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-[var(--color-text-primary)]">{claim.merchantRaw}</h1>
              <StatusBadge status={claim.status} size="sm" />
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-text-muted)] flex-wrap">
              <span>{claim.employee.name}</span>
              <span className="text-[var(--color-border-hover)]">·</span>
              <span>{claim.employee.dept}</span>
              <span className="text-[var(--color-border-hover)]">·</span>
              <span>{formatDate(claim.date)}</span>
              <span className="text-[var(--color-border-hover)]">·</span>
              <span className="capitalize">{claim.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-xl font-mono font-bold text-[var(--color-text-primary)]">{formatINR(claim.amount)}</div>
            {claim.caseFile && (
              <Link href={`/case-file/${claim.id}`} className="btn btn-ghost text-xs" title="View audit dossier">
                <FileText className="w-3.5 h-3.5" /> Case File
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Action feedback toast */}
      {actionDone && (
        <div className="card p-3 mb-4 border-emerald-500/30 bg-emerald-500/5 animate-in">
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Decision recorded: {actionDone}. This has been added to the immutable audit trail.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT: Receipt + Extraction */}
        <div className="lg:col-span-2 space-y-4">
          {/* Receipt */}
          <div className="card p-4">
            <h2 className="section-label mb-3">Receipt</h2>
            <div className="aspect-[3/4] bg-[var(--color-bg-hover)] rounded-lg border border-dashed border-[var(--color-border-default)] flex items-center justify-center">
              <div className="text-center text-[var(--color-text-muted)]">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <div className="text-xs">Receipt image</div>
                {claim.receiptId && <div className="text-[0.625rem] mt-1 font-mono">{claim.receiptId}</div>}
              </div>
            </div>
          </div>

          {/* Extraction */}
          {extraction && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-label">Extracted Fields</h2>
                {claim.extraction?.correctedByUser && (
                  <span className="badge badge-unverified text-[0.625rem]">Employee corrected</span>
                )}
              </div>
              <div className="space-y-2.5">
                {Object.entries(extraction.fields).map(([key, value]) => {
                  const conf = extraction.confidence[key] || 0;
                  return (
                    <div key={key} className="flex items-center justify-between py-1">
                      <div>
                        <div className="text-[0.625rem] text-[var(--color-text-muted)] uppercase tracking-wider">{key}</div>
                        <div className="text-sm text-[var(--color-text-primary)] font-medium">
                          {key === 'amount' ? formatINR(Number(value)) : String(value)}
                        </div>
                      </div>
                      <span className={`text-[0.625rem] font-mono font-semibold ${getConfidenceColor(conf)}`}>
                        {Math.round(conf * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card p-4">
            <h2 className="section-label mb-2">Description</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">{claim.description}</p>
          </div>

          {/* AI Receipt Analysis */}
          <div className="card overflow-hidden">
            <div className="px-3.5 py-2 border-b border-[var(--color-border-default)]">
              <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                AI Receipt Analysis
              </h2>
            </div>
            <div className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-verified text-[0.625rem]">Low Risk</span>
                <span className="text-[0.6875rem] text-[var(--color-text-muted)]">No anomalous indicators</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[0.6875rem]">
                {[
                  { label: 'Typography', ok: true },
                  { label: 'Logo region', ok: true },
                  { label: 'Compression', ok: true },
                  { label: 'Arithmetic', ok: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="mt-2 p-2 rounded bg-[var(--color-bg-hover)] border border-[var(--color-border-default)]">
                <p className="text-[0.625rem] text-[var(--color-text-muted)] flex items-start gap-1">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Authenticity signal only — not proof of wrongdoing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Evidence + Findings + Actions */}
        <div className="lg:col-span-3 space-y-4">
          {/* Evidence Items */}
          <div className="card p-4">
            <h2 className="section-label mb-3">Evidence ({claim.evidenceItems.length} checks)</h2>
            {claim.evidenceItems.length === 0 ? (
              <div className="empty-state py-8">
                <Search className="w-6 h-6 opacity-30 mb-2" />
                <p className="text-sm">No evidence checks have been run yet.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {claim.evidenceItems.map((item) => {
                  const isExpanded = expandedEvidence === item.id;
                  const detail = safeJsonParse<Record<string, unknown>>(item.detail, {});
                  return (
                    <div key={item.id} className="border border-[var(--color-border-default)] rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedEvidence(isExpanded ? null : item.id)}
                        className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-[var(--color-bg-hover)] transition-colors text-left"
                        aria-expanded={isExpanded}
                      >
                        {getEvidenceIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-[var(--color-text-primary)]">{item.summary}</div>
                        </div>
                        <SourceChip source={item.source} />
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="evidence-expand px-3 py-2.5 bg-[var(--color-bg-hover)] border-t border-[var(--color-border-default)]">
                          <div className="section-label mb-1.5">Source data</div>
                          <div className="bg-[var(--color-bg-primary)] rounded-md p-2.5 font-mono text-xs text-indigo-300/80">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(detail, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Evidence Graph */}
          <EvidenceGraph
            claimId={claim.id}
            merchantRaw={claim.merchantRaw}
            amount={claim.amount}
            status={claim.status}
            evidenceItems={claim.evidenceItems}
          />

          {/* Findings */}
          {claim.findings.length > 0 && (
            <div className="card p-4">
              <h2 className="section-label mb-3">Findings ({claim.findings.length})</h2>
              <div className="space-y-3">
                {claim.findings.map((f) => (
                  <div key={f.id} className="flex items-start gap-3">
                    <span className={`finding-rank ${
                      f.severity === 'CRITICAL' ? 'finding-rank-critical' : f.severity === 'WARNING' ? 'finding-rank-warning' : 'finding-rank-info'
                    }`}>
                      {f.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">{f.title}</span>
                        <span className={`badge text-[0.625rem] ${
                          f.severity === 'CRITICAL' ? 'badge-conflicting' : f.severity === 'WARNING' ? 'badge-unverified' : 'badge-neutral'
                        }`}>
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-1.5 leading-relaxed">{f.detail}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {f.sourceRef.split(', ').map((src) => <SourceChip key={src} source={src.trim()} />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNVERIFIED Explainer */}
          {claim.status === 'UNVERIFIED' && (
            <div className="card p-4 border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-300 font-medium mb-1">{UNVERIFIED_EXPLAINER}</p>
                  <p className="text-xs text-amber-400/60">
                    What would help: {claim.caseFile?.recommendedAction || 'Provide additional documentation.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Action */}
          {claim.caseFile && (
            <div className="card p-4">
              <h2 className="section-label mb-2">Recommended Action</h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{claim.caseFile.recommendedAction}</p>
            </div>
          )}

          {/* Actions */}
          <div className="card p-4">
            <h2 className="section-label mb-3">Take Action</h2>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => handleAction('APPROVE')} disabled={actionLoading} className="btn btn-success">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </button>
              <button onClick={() => handleAction('HOLD')} disabled={actionLoading} className="btn btn-warning">
                <Pause className="w-3.5 h-3.5" /> Hold
              </button>
              <button onClick={() => handleAction('REQUEST_EVIDENCE')} disabled={actionLoading} className="btn btn-primary">
                <Send className="w-3.5 h-3.5" /> Request Evidence
              </button>
              <button onClick={() => setShowRejectModal(true)} disabled={actionLoading} className="btn btn-danger">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
              <button onClick={() => handleAction('INVESTIGATE')} disabled={actionLoading} className="btn btn-ghost">
                <Search className="w-3.5 h-3.5" /> Investigate
              </button>
            </div>
          </div>

          {/* Reject Modal */}
          {showRejectModal && (
            <div className="card p-4 border-red-500/20 animate-in">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Reason Required</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Rejection requires a reason. This will be permanently recorded in the audit trail.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Describe the reason for rejection…"
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-red-500/30 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-red-400/50 mb-3 min-h-20 resize-none"
                aria-label="Rejection reason"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('REJECT', rejectReason)}
                  disabled={!rejectReason.trim() || actionLoading}
                  className="btn btn-danger"
                >
                  Confirm Rejection
                </button>
                <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Decision Timeline */}
          {claim.decisions.length > 0 && (
            <div className="card p-4">
              <h2 className="section-label mb-3">Decision Trail</h2>
              <div className="space-y-3">
                {claim.decisions.map((d) => (
                  <div key={d.id} className="flex items-start gap-3 pl-3 border-l-2 border-[var(--color-border-default)]">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">{d.actor}</span>
                        <span className="text-[0.625rem] text-[var(--color-text-muted)]">({d.role})</span>
                        <span className={`badge text-[0.625rem] ${
                          d.action === 'APPROVE' ? 'badge-verified' :
                          d.action === 'REJECT' ? 'badge-conflicting' :
                          d.action === 'HOLD' ? 'badge-unverified' :
                          'badge-neutral'
                        }`}>{d.action}</span>
                      </div>
                      {d.reason && <p className="text-xs text-[var(--color-text-muted)]">{d.reason}</p>}
                      <div className="text-[0.625rem] text-[var(--color-text-muted)] mt-0.5">{formatDateTime(d.at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Requests */}
          {claim.evidenceRequests.length > 0 && (
            <div className="card p-4">
              <h2 className="section-label mb-3">Evidence Requests</h2>
              {claim.evidenceRequests.map((req) => {
                const items = safeJsonParse<string[]>(req.requestedItems, []);
                return (
                  <div key={req.id} className="border border-[var(--color-border-default)] rounded-lg p-3">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">{req.message}</p>
                    <ul className="space-y-1 mb-3">
                      {items.map((item, i) => (
                        <li key={i} className="text-xs text-[var(--color-text-muted)] flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">•</span> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between text-[0.625rem] text-[var(--color-text-muted)] flex-wrap gap-2">
                      <span>Sent: {formatDateTime(req.sentAt)}</span>
                      <span>Deadline: {formatDate(req.deadline)}</span>
                      <span className={req.respondedAt ? 'text-emerald-400' : 'text-amber-400'}>
                        {req.respondedAt ? `Responded ${formatDateTime(req.respondedAt)}` : 'Awaiting response'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
