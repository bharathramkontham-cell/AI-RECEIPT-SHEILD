'use client';

import { STATUS_CONFIG, UNVERIFIED_EXPLAINER, RECONSTRUCTED_EXPLAINER } from '@/lib/constants';
import { CheckCircle2, AlertTriangle, HelpCircle, AlertOctagon, Clock, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showExplainer?: boolean;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  VERIFIED: <CheckCircle2 className="w-3.5 h-3.5" />,
  RECONSTRUCTED_VERIFIED: <RefreshCw className="w-3.5 h-3.5" />,
  CONFLICTING: <AlertOctagon className="w-3.5 h-3.5" />,
  UNVERIFIED: <HelpCircle className="w-3.5 h-3.5" />,
  POLICY_EXCEPTION: <AlertTriangle className="w-3.5 h-3.5" />,
  PENDING: <Clock className="w-3.5 h-3.5" />,
};

export function StatusBadge({ status, size = 'md', showExplainer = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  const sizeClasses = {
    sm: 'text-[0.6875rem] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const badgeClass =
    status === 'VERIFIED' || status === 'RECONSTRUCTED_VERIFIED'
      ? 'badge-verified'
      : status === 'CONFLICTING'
        ? 'badge-conflicting'
        : status === 'UNVERIFIED'
          ? 'badge-unverified'
          : status === 'POLICY_EXCEPTION'
            ? 'badge-exception'
            : 'badge-neutral';

  return (
    <div className="inline-flex flex-col gap-1">
      <span className={`badge ${sizeClasses[size]} ${badgeClass}`}>
        {STATUS_ICONS[status] || STATUS_ICONS.PENDING}
        {config.label}
      </span>
      {showExplainer && status === 'UNVERIFIED' && (
        <span className="text-xs text-amber-300/70 italic max-w-md leading-snug">
          {UNVERIFIED_EXPLAINER}
        </span>
      )}
      {showExplainer && status === 'RECONSTRUCTED_VERIFIED' && (
        <span className="text-xs text-emerald-300/70 italic max-w-md leading-snug">
          {RECONSTRUCTED_EXPLAINER}
        </span>
      )}
    </div>
  );
}
