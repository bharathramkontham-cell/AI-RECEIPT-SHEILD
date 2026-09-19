'use client';

import { SOURCE_LABELS } from '@/lib/constants';
import { Link2 } from 'lucide-react';

interface SourceChipProps {
  source: string;
}

export function SourceChip({ source }: SourceChipProps) {
  const label = SOURCE_LABELS[source] || source;

  return (
    <span className="source-chip" title={`Source: ${label}`}>
      <Link2 className="w-3 h-3 opacity-60" />
      {label}
    </span>
  );
}
