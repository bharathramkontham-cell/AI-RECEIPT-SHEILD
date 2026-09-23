'use client';

import { AppShell } from '@/components/app-shell';
import { StatusBadge } from '@/components/status-badge';
import { formatINR, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CheckCircle2, AlertOctagon, AlertTriangle,
  TrendingUp, DollarSign, FileText, ArrowRight, Upload, Map, AlertCircle, ShieldAlert
} from 'lucide-react';
import { AICopilot } from '@/components/ai-copilot';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

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
  categoryBreakdown: { name: string; value: number }[];
  vendorAnomalies: { vendor: string; riskScore: number; drift: string }[];
  departmentSpending: { dept: string; spend: number }[];
  riskHeatmap: { day: string; high: number; med: number; low: number }[];
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
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/dashboard').then(async (r) => {
        if (!r.ok) throw new Error(`Dashboard API responded with ${r.status}`);
        return r.json();
      }),
      fetch('/api/claims').then(async (r) => {
        if (!r.ok) throw new Error(`Claims API responded with ${r.status}`);
        return r.json();
      }),
    ])
      .then(([d, c]) => {
        if (d && !d.error) {
          setData(d);
        } else {
          throw new Error(d?.error || 'Invalid dashboard payload');
        }
        setClaims(Array.isArray(c) ? c : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[Dashboard] Data load error:', err);
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <AppShell><DashboardSkeleton /></AppShell>;
  }

  if (error || !data) {
    return (
      <AppShell>
        <div className="card p-8 text-center max-w-lg mx-auto my-12">
          <AlertOctagon className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">Unable to load dashboard</h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">{error || 'Unknown error occurred while fetching metrics.'}</p>
          <button
            onClick={loadData}
            className="btn btn-primary text-xs px-4 py-2 inline-flex items-center gap-2 mx-auto"
          >
            Retry Loading
          </button>
        </div>
      </AppShell>
    );
  }

  const safeClaims = Array.isArray(claims) ? claims : [];

  const needsAttention = safeClaims
    .filter((c) => ['CONFLICTING', 'UNVERIFIED', 'POLICY_EXCEPTION'].includes(c.status))
    .sort((a, b) => {
      const order: Record<string, number> = { CONFLICTING: 0, UNVERIFIED: 1, POLICY_EXCEPTION: 2 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    });

  const recentVerified = safeClaims
    .filter((c) => c.status === 'VERIFIED' || c.status === 'RECONSTRUCTED_VERIFIED')
    .slice(0, 5);

  const statusFunnel = data.statusFunnel || [];
  const categoryBreakdown = data.categoryBreakdown || [];

  return (
    <>
    <AppShell>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Evidence verification overview · <span className="text-[var(--color-text-secondary)] tabular-nums">{data.totalClaims ?? 0} claims</span>
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Verified', value: `${data.verifiedRate ?? 0}%`, sub: `${data.verifiedCount ?? 0} of ${data.totalClaims ?? 0}`, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, cls: 'text-emerald-400' },
          { label: 'Needs Review', value: String(needsAttention.length), sub: `${data.conflictingCount ?? 0} conflicting`, icon: <AlertOctagon className="w-3.5 h-3.5 text-red-400" />, cls: 'text-red-400' },
          { label: 'Amount at Risk', value: formatINR(data.moneyAtRisk ?? 0), sub: 'across flagged claims', icon: <DollarSign className="w-3.5 h-3.5 text-amber-400" />, cls: 'text-amber-400' },
          { label: 'Avg Decision Time', value: data.avgVerificationTime || '< 60s', sub: 'with case file', icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />, cls: 'text-indigo-400' },
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
          {statusFunnel.map((item) => {
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
      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        
        {/* Department Spending Velocity */}
        <div className="card overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)]">
            <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Department Spend</h2>
          </div>
          <div className="h-48 p-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentSpending || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="dept" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#3f3f46', fontSize: '12px' }} />
                <Bar dataKey="spend" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Risk Anomalies */}
        <div className="card overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)]">
            <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Vendor Risk Anomalies</h2>
          </div>
          <div className="p-3.5 space-y-3">
            {(data.vendorAnomalies || []).map((anomaly) => (
              <div key={anomaly.vendor} className="flex justify-between items-center bg-[var(--color-bg-hover)] p-2 rounded-lg border border-[var(--color-border-default)]">
                <div>
                  <div className="text-[0.75rem] text-[var(--color-text-primary)] font-medium">{anomaly.vendor}</div>
                  <div className="text-[0.625rem] text-[var(--color-text-muted)] flex items-center gap-1">
                    Drift: <span className={anomaly.drift.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}>{anomaly.drift}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[0.875rem] font-mono font-bold" style={{ color: anomaly.riskScore > 50 ? '#ef4444' : anomaly.riskScore > 25 ? '#f59e0b' : '#10b981' }}>
                    {anomaly.riskScore}
                  </div>
                  <div className="text-[0.5rem] uppercase text-[var(--color-text-muted)] tracking-wider">Risk Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Heatmap */}
        <div className="card overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)]">
            <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Risk Heatmap (7D)</h2>
          </div>
          <div className="h-48 p-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.riskHeatmap || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#3f3f46', fontSize: '12px' }} />
                <Bar dataKey="high" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="med" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="low" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        {/* Status Donut */}
        <div className="card overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)]">
            <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Verification Status</h2>
          </div>
          <div className="p-3.5 flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="11"
                  fill="none"
                />
                {(() => {
                  const circumference = 2 * Math.PI * 36;
                  const total = statusFunnel.reduce((acc, curr) => acc + curr.count, 0) || 1;
                  let offset = 0;
                  return statusFunnel.map((item) => {
                    const strokeLen = (item.count / total) * circumference;
                    const dashoffset = -offset;
                    offset += strokeLen;
                    if (item.count === 0) return null;
                    return (
                      <circle
                        key={item.status}
                        cx="50"
                        cy="50"
                        r="36"
                        stroke={item.color}
                        strokeWidth="11"
                        strokeDasharray={`${strokeLen} ${circumference}`}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-700"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
                  {data.verifiedRate ?? 0}%
                </span>
                <span className="text-[0.5625rem] text-[var(--color-text-muted)] uppercase tracking-wider font-mono">
                  Verified
                </span>
              </div>
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              {statusFunnel.map((s) => (
                <div key={s.status} className="flex items-center justify-between text-[0.75rem]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-[var(--color-text-secondary)] truncate">{s.status}</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-[var(--color-text-primary)]">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="card overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-[var(--color-border-default)] flex items-center justify-between">
            <h2 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Expense Categories</h2>
            <span className="text-[0.625rem] text-[var(--color-text-muted)] font-mono">{categoryBreakdown.length} types</span>
          </div>
          <div className="p-3.5">
            <div className="space-y-2">
              {categoryBreakdown.map((cat) => {
                const maxVal = Math.max(...categoryBreakdown.map((c) => c.value), 1);
                const pct = Math.round((cat.value / maxVal) * 100);
                return (
                  <div key={cat.name} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[0.6875rem]">
                      <span className="text-[var(--color-text-secondary)] font-medium truncate">{cat.name}</span>
                      <span className="font-mono text-indigo-400 font-semibold tabular-nums">{cat.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--color-bg-hover)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Verify CTA */}
      <Link href="/verify" className="card card-interactive p-3.5 mb-5 flex items-center gap-3 group">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Upload className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex-1">
          <div className="text-[0.8125rem] font-medium text-[var(--color-text-primary)]">Verify a New Expense</div>
          <div className="text-[0.6875rem] text-[var(--color-text-muted)]">Upload a receipt to start evidence-based verification</div>
        </div>
        <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-indigo-400 transition-colors" />
      </Link>

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
                        {claim.employee?.name ?? 'Unknown'} · {formatDate(claim.date)} · {claim._count?.findings ?? 0} finding{(claim._count?.findings ?? 0) !== 1 ? 's' : ''}
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
                    <div className="text-[0.5625rem] text-[var(--color-text-muted)]">{claim.employee?.name ?? 'Unknown'}</div>
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
          <span className="text-[0.625rem] text-[var(--color-text-muted)] tabular-nums">{safeClaims.length} total</span>
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
              {safeClaims.map((claim) => (
                <tr key={claim.id} className="border-b border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] transition-colors">
                  <td className="table-cell">
                    <span className="text-[0.6875rem] font-mono text-indigo-400">{claim.id.toUpperCase()}</span>
                  </td>
                  <td className="table-cell">
                    <div className="text-[0.8125rem] text-[var(--color-text-primary)]">{claim.employee?.name ?? 'Unknown'}</div>
                    <div className="text-[0.5625rem] text-[var(--color-text-muted)]">{claim.employee?.dept ?? 'Unassigned'}</div>
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
    <AICopilot />
    </>
  );
}
