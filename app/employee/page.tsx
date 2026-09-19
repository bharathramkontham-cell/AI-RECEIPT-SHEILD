'use client';

import { AppShell } from '@/components/app-shell';
import { StatusBadge } from '@/components/status-badge';
import { formatINR, formatDate, safeJsonParse } from '@/lib/utils';
import { UNVERIFIED_EXPLAINER, RECONSTRUCTED_EXPLAINER } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { User, AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';

interface EmployeeClaim {
  id: string;
  merchantRaw: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  description: string;
  caseFile: { recommendedAction: string } | null;
  evidenceRequests: {
    id: string;
    requestedItems: string;
    deadline: string;
    message: string;
    respondedAt: string | null;
  }[];
  findings: { title: string; detail: string; severity: string }[];
}

export default function EmployeePage() {
  const [claims, setClaims] = useState<EmployeeClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/claims?empId=emp-101').then((r) => r.json()),
      fetch('/api/claims?empId=emp-102').then((r) => r.json()),
    ]).then(([a, b]) => {
      const merged = [...a, ...b];
      Promise.all(
        merged.map((c: { id: string }) =>
          fetch(`/api/claims/${c.id}`).then((r) => r.json())
        )
      ).then(setClaims);
    });
  }, []);

  const getStatusMessage = (claim: EmployeeClaim) => {
    switch (claim.status) {
      case 'VERIFIED':
      case 'RECONSTRUCTED_VERIFIED':
        return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: 'This claim has been verified. No action needed from you.', cls: 'border-emerald-500/20' };
      case 'CONFLICTING':
        return { icon: <AlertTriangle className="w-4 h-4 text-red-400" />, text: 'There are evidence conflicts on this claim. Your finance team may reach out for clarification.', cls: 'border-red-500/20' };
      case 'UNVERIFIED':
        return { icon: <Info className="w-4 h-4 text-amber-400" />, text: UNVERIFIED_EXPLAINER, cls: 'border-amber-500/20' };
      case 'POLICY_EXCEPTION':
        return { icon: <AlertTriangle className="w-4 h-4 text-orange-400" />, text: 'This claim exceeds a policy limit and may need management approval. This is not an accusation.', cls: 'border-orange-500/20' };
      default:
        return { icon: <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />, text: 'This claim is being processed.', cls: '' };
    }
  };

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" /> My Claims
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Viewing claims for Riya Sharma &amp; Arjun Mehta (demo)
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-3.5 flex items-center gap-3">
              <div className="skeleton h-5 w-20 rounded" />
              <div className="flex-1 space-y-1.5"><div className="skeleton skeleton-text w-40" /><div className="skeleton skeleton-text-sm w-24" /></div>
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => {
            const msg = getStatusMessage(claim);
            const isSelected = selectedClaim === claim.id;
            const pendingRequests = claim.evidenceRequests.filter((r) => !r.respondedAt);

            return (
              <div key={claim.id} className={`card ${msg.cls}`}>
                <button
                  onClick={() => setSelectedClaim(isSelected ? null : claim.id)}
                  className="w-full p-4 text-left"
                  aria-expanded={isSelected}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <StatusBadge status={claim.status} size="sm" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">{claim.merchantRaw}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{formatDate(claim.date)} · {claim.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[0.8125rem] font-mono font-medium text-[var(--color-text-primary)] tabular-nums">{formatINR(claim.amount)}</span>
                      {pendingRequests.length > 0 && (
                        <span className="badge badge-unverified text-[0.625rem]">Action needed</span>
                      )}
                    </div>
                  </div>
                </button>

                {isSelected && (
                  <div className="px-4 pb-4 pt-0 border-t border-[var(--color-border-default)] mt-0 animate-in">
                    <div className="flex items-start gap-2 mt-3 mb-3">
                      {msg.icon}
                      <p className="text-sm text-[var(--color-text-secondary)]">{msg.text}</p>
                    </div>

                    {claim.status === 'RECONSTRUCTED_VERIFIED' && (
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 mb-3">
                        <p className="text-xs text-emerald-300">{RECONSTRUCTED_EXPLAINER}</p>
                      </div>
                    )}

                    <p className="text-xs text-[var(--color-text-muted)] mb-3">{claim.description}</p>

                    {pendingRequests.map((req) => {
                      const items = safeJsonParse<string[]>(req.requestedItems, []);
                      return (
                        <div key={req.id} className="card p-3 mb-3 border-amber-500/20">
                          <div className="section-label mb-2 text-amber-400">Information Requested</div>
                          <p className="text-xs text-[var(--color-text-secondary)] mb-2">{req.message}</p>
                          <ul className="space-y-1 mb-2">
                            {items.map((item, i) => (
                              <li key={i} className="text-xs text-[var(--color-text-muted)] flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span> {item}
                              </li>
                            ))}
                          </ul>
                          <div className="text-[0.625rem] text-[var(--color-text-muted)]">
                            Deadline: {formatDate(req.deadline)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
