'use client';

import { AppShell } from '@/components/app-shell';
import { StatusBadge } from '@/components/status-badge';
import { formatINR, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CheckCircle2, AlertOctagon, AlertTriangle,
  TrendingUp, DollarSign, FileText, ArrowRight,
} from 'lucide-react';

interface DashboardData {
  totalClaims: number;
  verifiedCount: number;
  conflictingCount: number;
  unverifiedCount: number;
  policyExceptionCount: number;
  moneyAtRisk: number;
  totalAmount: number;
  verifiedRate: number;
  avgVerificationTime: string;
  hoursSaved: number;
  evidenceGaps: number;
  statusFunnel: { status: string; count: number; color: string }[];
}

interface ClaimRow {
  id: string;
  merchantRaw: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  employee: { name: string; empCode: string; dept: string };
  _count: { evidenceItems: number; findings: number; decisions: number };
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-5">
        <div className="skeleton h-6 w-32 mb-1.5" />
        <div className="skeleton skeleton-text-sm w-48" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="skeleton skeleton-text-sm mb-3 w-20" />
            <div className="skeleton skeleton-kpi mb-1" />
            <div className="skeleton skeleton-text-sm w-16 mt-1" />
          </div>
        ))}
      </div>
      <div className="card p-4 mb-5">
        <div className="skeleton skeleton-text-sm w-40 mb-3" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1"><div className="skeleton h-2 rounded-full" /></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 card p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-4 w-4 rounded" />
              <div className="flex-1"><div className="skeleton skeleton-text" /></div>
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 card p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="skeleton skeleton-text w-24" />
              <div className="skeleton h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then((r) => r.json()),
      fetch('/api/claims').then((r) => r.json()),
    ]).then(([d, c]) => {
      setData(d);
      setClaims(c);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <AppShell><DashboardSkeleton /></AppShell>;
  }

  const needsAttention = claims.filter((c) =>
    ['CONFLICTING', 'UNVERIFIED', 'POLICY_EXCEPTION'].includes(c.status)
  ).sort((a, b) => {
    const order: Record<string, number> = { CONFLICTING: 0, UNVERIFIED: 1, POLICY_EXCEPTION: 2 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });

  const recentVerified = claims
    .filter((c) => c.status === 'VERIFIED' || c.status === 'RECONSTRUCTED_VERIFIED')
    .slice(0, 5);

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Evidence verification overview · <span className="text-[var(--color-text-secondary)] tabular-nums">{data.totalClaims} claims</span>
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Verified', value: `${data.verifiedRate}%`, sub: `${data.verifiedCount} of ${data.totalClaims}`, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, cls: 'text-emerald-400' },
          { label: 'Needs Review', value: String(needsAttention.length), sub: `${data.conflictingCount} conflicting`, icon: <AlertOctagon className="w-3.5 h-3.5 text-red-400" />, cls: 'text-red-400' },
          { label: 'Amount at Risk', value: formatINR(data.moneyAtRisk), sub: 'across flagged claims', icon: <DollarSign className="w-3.5 h-3.5 text-amber-400" />, cls: 'text-amber-400' },
          { label: 'Avg Decision Time', value: data.avgVerificationTime, sub: 'with case file', icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />, cls: 'text-indigo-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="section-label">{kpi.label}</span>
              {kpi.icon}
            </div>
            <div className={`kpi-value ${kpi.cls}`}>{kpi.value}</div>
            <div className="text-[0.625rem] text-[var(--color-text-muted)] mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="card p-3.5 mb-5">
        <div className="section-label mb-2.5">Evidence Status Breakdown</div>
        <div className="flex gap-3 items-end">
          {data.statusFunnel.map((item) => {
            const total = data.totalClaims || 1;
            const pct = Math.round((item.count / total) * 100);
            return (
              <div key={item.status} className="flex-1 min-w-0">
                <div className="h-1.5 rounded-full mb-1.5" style={{ background: `${item.color}18` }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(pct, 6)}%`, background: item.color }}
                  />
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[0.5625rem] text-[var(--color-text-muted)] truncate">{item.status}</span>
                  <span className="text-[0.5625rem] font-mono font-semibold tabular-nums" style={{ color: item.color }}>{item.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Priority Queue */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Needs Your Attention</h2>
              </div>
              <span className="text-[0.625rem] text-[var(--color-text-muted)] tabular-nums">{needsAttention.length} claims</span>
            </div>
            {needsAttention.length === 0 ? (
              <div className="empty-state py-10">
                <CheckCircle2 className="w-6 h-6 text-emerald-400/30 mb-2" />
                <p className="text-xs">All clear — no claims need review.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border-default)]">
                {needsAttention.map((claim) => (
                  <Link
                    key={claim.id}
                    href={`/claims/${claim.id}`}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-[var(--color-bg-hover)] active:bg-[var(--color-bg-active)] transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[0.8125rem] font-medium text-[var(--color-text-primary)] truncate">{claim.merchantRaw}</span>
                        <StatusBadge status={claim.status} size="sm" />
                      </div>
                      <div className="text-[0.6875rem] text-[var(--color-text-muted)]">
                        {claim.employee.name} · {formatDate(claim.date)} · {claim._count.findings} finding{claim._count.findings !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[0.8125rem] font-mono font-medium text-[var(--color-text-primary)] tabular-nums">{formatINR(claim.amount)}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Verified */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Recently Verified</h2>
              </div>
              <Link href="/claims" className="text-[0.6875rem] text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
            </div>
            <div className="divide-y divide-[var(--color-border-default)]">
              {recentVerified.map((claim) => (
                <Link
                  key={claim.id}
                  href={`/claims/${claim.id}`}
                  className="flex items-center justify-between px-3.5 py-2 hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[0.8125rem] text-[var(--color-text-primary)] truncate">{claim.merchantRaw}</div>
                    <div className="text-[0.5625rem] text-[var(--color-text-muted)]">{claim.employee.name}</div>
                  </div>
                  <span className="text-[0.6875rem] font-mono text-[var(--color-text-secondary)] tabular-nums">{formatINR(claim.amount)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Claims Table */}
      <div className="card overflow-hidden mt-3">
        <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">All Claims</h2>
          </div>
          <span className="text-[0.625rem] text-[var(--color-text-muted)] tabular-nums">{claims.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="table-header text-left">Claim</th>
                <th className="table-header text-left">Employee</th>
                <th className="table-header text-left">Merchant</th>
                <th className="table-header text-right">Amount</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id} className="border-b border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] transition-colors">
                  <td className="table-cell">
                    <span className="text-[0.6875rem] font-mono text-indigo-400">{claim.id.toUpperCase()}</span>
                  </td>
                  <td className="table-cell">
                    <div className="text-[0.8125rem] text-[var(--color-text-primary)]">{claim.employee.name}</div>
                    <div className="text-[0.5625rem] text-[var(--color-text-muted)]">{claim.employee.dept}</div>
                  </td>
                  <td className="table-cell text-[0.8125rem] text-[var(--color-text-secondary)]">{claim.merchantRaw}</td>
                  <td className="table-cell text-[0.8125rem] text-right font-mono tabular-nums">{formatINR(claim.amount)}</td>
                  <td className="table-cell text-[0.8125rem] text-[var(--color-text-muted)]">{formatDate(claim.date)}</td>
                  <td className="table-cell"><StatusBadge status={claim.status} size="sm" /></td>
                  <td className="table-cell">
                    <Link href={`/claims/${claim.id}`} className="text-[0.6875rem] text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                      Review →
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
