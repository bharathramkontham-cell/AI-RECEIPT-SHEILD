'use client';

import { AppShell } from '@/components/app-shell';
import { StatusBadge } from '@/components/status-badge';
import { formatINR, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Printer, ExternalLink } from 'lucide-react';

interface AuditClaim {
  id: string;
  merchantRaw: string;
  amount: number;
  date: string;
  status: string;
  employee: { name: string; empCode: string };
  _count: { evidenceItems: number; findings: number; decisions: number };
}

export default function AuditorPage() {
  const [claims, setClaims] = useState<AuditClaim[]>([]);

  useEffect(() => {
    fetch('/api/claims').then((r) => r.json()).then(setClaims);
  }, []);

  const stats = [
    { label: 'Total', value: claims.length, cls: 'text-[var(--color-text-primary)]' },
    { label: 'Verified', value: claims.filter((c) => c.status === 'VERIFIED' || c.status === 'RECONSTRUCTED_VERIFIED').length, cls: 'text-emerald-400' },
    { label: 'Conflicting', value: claims.filter((c) => c.status === 'CONFLICTING').length, cls: 'text-red-400' },
    { label: 'Unverified', value: claims.filter((c) => c.status === 'UNVERIFIED').length, cls: 'text-amber-400' },
    { label: 'Exceptions', value: claims.filter((c) => c.status === 'POLICY_EXCEPTION').length, cls: 'text-orange-400' },
  ];

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" /> Audit Log
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Read-only view · All evidence, findings, and decisions
          </p>
        </div>
        <button onClick={() => window.print()} className="btn btn-ghost text-sm flex-shrink-0">
          <Printer className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <div className={`kpi-value tabular-nums ${s.cls}`}>{s.value}</div>
            <div className="section-label mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Claims Register */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-border-default)]">
          <h2 className="section-label">Complete Claim Register</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="table-header text-left">ID</th>
                <th className="table-header text-left">Employee</th>
                <th className="table-header text-left">Merchant</th>
                <th className="table-header text-right">Amount</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-center">Evidence</th>
                <th className="table-header text-center">Findings</th>
                <th className="table-header text-center">Decisions</th>
                <th className="table-header text-left"><span className="sr-only">Link</span></th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-b border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] transition-colors">
                  <td className="table-cell text-xs font-mono text-indigo-400">{c.id.toUpperCase()}</td>
                  <td className="table-cell text-xs">{c.employee.name}</td>
                  <td className="table-cell text-xs text-[var(--color-text-secondary)]">{c.merchantRaw}</td>
                  <td className="table-cell text-xs text-right font-mono">{formatINR(c.amount)}</td>
                  <td className="table-cell text-xs text-[var(--color-text-muted)]">{formatDate(c.date)}</td>
                  <td className="table-cell"><StatusBadge status={c.status} size="sm" /></td>
                  <td className="table-cell text-xs text-center text-[var(--color-text-muted)]">{c._count.evidenceItems}</td>
                  <td className="table-cell text-xs text-center text-[var(--color-text-muted)]">{c._count.findings}</td>
                  <td className="table-cell text-xs text-center text-[var(--color-text-muted)]">{c._count.decisions}</td>
                  <td className="table-cell">
                    <Link href={`/case-file/${c.id}`} className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Case File
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
