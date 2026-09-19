'use client';

import { AppShell } from '@/components/app-shell';
import { StatusBadge } from '@/components/status-badge';
import { formatINR, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, ArrowRight, FileText } from 'lucide-react';

interface Claim {
  id: string;
  merchantRaw: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  employee: { name: string; empCode: string; dept: string };
  _count: { evidenceItems: number; findings: number; decisions: number };
}

const STATUS_FILTERS = ['', 'CONFLICTING', 'UNVERIFIED', 'POLICY_EXCEPTION', 'VERIFIED'] as const;

function ClaimsListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card p-3.5 flex items-center gap-3">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton skeleton-text w-48" />
            <div className="skeleton skeleton-text-sm w-32" />
          </div>
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/claims?${params}`)
      .then((r) => r.json())
      .then((data) => { setClaims(data); setLoading(false); });
  }, [statusFilter]);

  const filtered = claims.filter((c) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      c.merchantRaw.toLowerCase().includes(q) ||
      c.employee.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Claims</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Review evidence and take action on expense claims
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search by merchant, employee, or ID…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Search claims"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] text-[0.8125rem] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={`text-[0.6875rem] px-2.5 py-1 rounded-md font-medium transition-all border ${
                statusFilter === s
                  ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)] border-indigo-500/20'
                  : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              {s ? s.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      {loading ? (
        <ClaimsListSkeleton />
      ) : (
        <div className="space-y-1.5">
          {filtered.map((claim) => (
            <Link
              key={claim.id}
              href={`/claims/${claim.id}`}
              className="card card-interactive p-3.5 flex items-center gap-3 group"
            >
              <div className="flex-shrink-0">
                <StatusBadge status={claim.status} size="sm" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[0.6875rem] font-mono text-indigo-400">{claim.id.toUpperCase()}</span>
                  <span className="text-[0.8125rem] font-medium text-[var(--color-text-primary)] truncate">{claim.merchantRaw}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[0.6875rem] text-[var(--color-text-muted)] flex-wrap">
                  <span>{claim.employee.name}</span>
                  <span className="text-[var(--color-border-hover)]">·</span>
                  <span className="capitalize">{claim.category}</span>
                  <span className="text-[var(--color-border-hover)]">·</span>
                  <span>{formatDate(claim.date)}</span>
                  {claim._count.findings > 0 && (
                    <>
                      <span className="text-[var(--color-border-hover)]">·</span>
                      <span>{claim._count.findings} finding{claim._count.findings !== 1 ? 's' : ''}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-[0.8125rem] font-mono font-medium text-[var(--color-text-primary)] tabular-nums">{formatINR(claim.amount)}</div>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0" />
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="empty-state py-12">
              <FileText className="w-6 h-6 opacity-25 mb-2" />
              <p className="text-xs mb-0.5">No claims match your search.</p>
              <p className="text-[0.625rem]">Try broadening your filters.</p>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
