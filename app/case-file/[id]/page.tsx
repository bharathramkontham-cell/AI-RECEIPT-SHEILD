'use client';

import { AppShell } from '@/components/app-shell';
import { StatusBadge } from '@/components/status-badge';
import { SourceChip } from '@/components/source-chip';
import { formatINR, formatDate, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { ArrowLeft, Printer, FileText, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

interface CaseFileData {
  id: string;
  merchantRaw: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  description: string;
  employee: { name: string; empCode: string; dept: string };
  caseFile: { decisionStatus: string; recommendedAction: string; generatedAt: string } | null;
  evidenceItems: { id: string; source: string; kind: string; status: string; detail: string; summary: string }[];
  findings: { id: string; rank: number; title: string; detail: string; sourceRef: string; severity: string }[];
  decisions: { id: string; actor: string; role: string; action: string; reason: string | null; at: string }[];
}

export default function CaseFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<CaseFileData | null>(null);

  useEffect(() => {
    fetch(`/api/claims/${id}`).then((r) => r.json()).then(setData);
  }, [id]);

  if (!data) {
    return (
      <AppShell>
        <div className="mb-4"><div className="skeleton h-4 w-24" /></div>
        <div className="card p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2"><div className="skeleton h-5 w-56" /><div className="skeleton skeleton-text-sm w-32" /></div>
            <div className="skeleton skeleton-kpi" />
          </div>
        </div>
        <div className="card p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="skeleton h-3.5 w-3.5 rounded" />
              <div className="flex-1"><div className="skeleton skeleton-text" /></div>
            </div>
          ))}
        </div>
      </AppShell>
    );
  }

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <Link href={`/claims/${id}`} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to review
          </Link>
          <h1 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Case File
            <span className="font-mono text-indigo-400 text-sm">{data.id.toUpperCase()}</span>
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Audit-ready evidence dossier · Generated {data.caseFile ? formatDateTime(data.caseFile.generatedAt) : 'N/A'}
          </p>
        </div>
        <button onClick={() => window.print()} className="btn btn-ghost text-sm flex-shrink-0">
          <Printer className="w-3.5 h-3.5" /> Print
        </button>
      </div>

      {/* Summary */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <StatusBadge status={data.status} size="lg" showExplainer />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            ['Employee', `${data.employee.name} (${data.employee.empCode})`],
            ['Department', data.employee.dept],
            ['Merchant', data.merchantRaw],
            ['Category', data.category],
            ['Amount', formatINR(data.amount)],
            ['Date', formatDate(data.date)],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-[0.625rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">{label}</div>
              <div className="text-[var(--color-text-primary)] font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="card overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[var(--color-border-default)]">
          <h2 className="section-label">Evidence ({data.evidenceItems.length} checks)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="table-header text-left">Source</th>
                <th className="table-header text-left">Check</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.evidenceItems.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-border-default)]">
                  <td className="table-cell"><SourceChip source={item.source} /></td>
                  <td className="table-cell text-xs capitalize">{item.kind.replace(/_/g, ' ')}</td>
                  <td className="table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      {getEvidenceIcon(item.status)}
                      <span className="text-xs">{item.status.replace(/_/g, ' ')}</span>
                    </span>
                  </td>
                  <td className="table-cell text-xs text-[var(--color-text-secondary)]">{item.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Findings */}
      {data.findings.length > 0 && (
        <div className="card p-4 mb-4">
          <h2 className="section-label mb-3">Findings ({data.findings.length})</h2>
          <div className="space-y-3">
            {data.findings.map((f) => (
              <div key={f.id} className="flex items-start gap-3">
                <span className={`finding-rank ${
                  f.severity === 'CRITICAL' ? 'finding-rank-critical' : f.severity === 'WARNING' ? 'finding-rank-warning' : 'finding-rank-info'
                }`}>{f.rank}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{f.title}</span>
                    <span className={`badge text-[0.625rem] ${
                      f.severity === 'CRITICAL' ? 'badge-conflicting' : f.severity === 'WARNING' ? 'badge-unverified' : 'badge-neutral'
                    }`}>{f.severity}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-1">{f.detail}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {f.sourceRef.split(', ').map((src) => <SourceChip key={src} source={src.trim()} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      {data.caseFile && (
        <div className="card p-4 mb-4 border-indigo-500/20">
          <h2 className="section-label mb-2">Recommended Action</h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{data.caseFile.recommendedAction}</p>
        </div>
      )}

      {/* Decision Log */}
      {data.decisions.length > 0 && (
        <div className="card p-4">
          <h2 className="section-label mb-3">Decision Log</h2>
          <div className="space-y-3">
            {data.decisions.map((d) => (
              <div key={d.id} className="flex items-start gap-3 pl-3 border-l-2 border-[var(--color-border-default)]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{d.actor}</span>
                    <span className="text-[0.625rem] text-[var(--color-text-muted)]">({d.role})</span>
                    <span className={`badge text-[0.625rem] ${
                      d.action === 'APPROVE' ? 'badge-verified' :
                      d.action === 'REJECT' ? 'badge-conflicting' :
                      d.action === 'HOLD' ? 'badge-unverified' : 'badge-neutral'
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
    </AppShell>
  );
}
