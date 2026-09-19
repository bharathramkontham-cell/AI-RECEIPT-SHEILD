'use client';

import { AppShell } from '@/components/app-shell';
import { formatINR } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Settings, Shield, Database, Cpu, AlertTriangle } from 'lucide-react';

interface PolicyRule {
  id: string;
  category: string;
  field: string;
  op: string;
  value: string;
  severity: string;
  name: string;
  docRef: string;
}

export default function AdminPage() {
  const [rules, setRules] = useState<PolicyRule[]>([]);

  useEffect(() => {
    fetch('/api/policy-rules').then((r) => r.json()).then(setRules);
  }, []);

  const evidenceSources = [
    { name: 'Corporate Card Ledger', key: 'CARD_LEDGER', enabled: true, desc: 'Match claims against card transaction records' },
    { name: 'Merchant Registry', key: 'MERCHANT_REGISTRY', enabled: true, desc: 'Verify merchant identity via alias table and GST lookup' },
    { name: 'GST Registry (Mock)', key: 'GST_REGISTRY', enabled: true, desc: 'Validate GST/VAT numbers against registry' },
    { name: 'Travel Bookings', key: 'TRAVEL_BOOKINGS', enabled: true, desc: 'Cross-reference with travel booking records' },
    { name: 'Prior Claims', key: 'PRIOR_CLAIMS', enabled: true, desc: 'Detect duplicate receipt IDs or merchant+amount+date' },
    { name: 'Invoice / PO Match', key: 'INVOICE_PO', enabled: true, desc: 'Match procurement claims against purchase orders' },
    { name: 'Amount Drift Anomaly', key: 'AMOUNT_DRIFT', enabled: true, desc: 'Signal if claim >3σ from employee category mean' },
  ];

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" /> Settings
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Policy rules, evidence sources, and system configuration
        </p>
      </div>

      {/* Policy Rules */}
      <div className="card overflow-hidden mb-5">
        <div className="px-4 py-3 border-b border-[var(--color-border-default)]">
          <h2 className="section-label">Policy Rules</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="table-header text-left">Rule</th>
                <th className="table-header text-left">Category</th>
                <th className="table-header text-left">Limit</th>
                <th className="table-header text-left">Severity</th>
                <th className="table-header text-left">Policy Ref</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] transition-colors">
                  <td className="table-cell text-sm font-medium text-[var(--color-text-primary)]">{rule.name}</td>
                  <td className="table-cell text-xs text-[var(--color-text-muted)] capitalize">{rule.category}</td>
                  <td className="table-cell text-sm font-mono">{rule.op} {formatINR(Number(rule.value))}</td>
                  <td className="table-cell">
                    <span className={`badge text-[0.625rem] ${
                      rule.severity === 'WARNING' ? 'badge-unverified' : 'badge-neutral'
                    }`}>{rule.severity}</span>
                  </td>
                  <td className="table-cell text-xs font-mono text-indigo-400">{rule.docRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Sources */}
      <div className="card p-4 mb-5">
        <h2 className="section-label mb-3">Evidence Sources</h2>
        <div className="space-y-2">
          {evidenceSources.map((source) => (
            <div key={source.key} className="flex items-center justify-between py-2 border-b border-[var(--color-border-default)] last:border-0">
              <div className="min-w-0">
                <div className="text-sm text-[var(--color-text-primary)] font-medium">{source.name}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{source.desc}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="source-chip">{source.key}</span>
                <div
                  className={`w-8 h-4 rounded-full flex items-center transition-colors ${
                    source.enabled ? 'bg-emerald-500/30 justify-end' : 'bg-[var(--color-bg-hover)] justify-start'
                  }`}
                  role="switch"
                  aria-checked={source.enabled}
                  aria-label={`${source.name} enabled`}
                >
                  <div className={`w-3 h-3 rounded-full mx-0.5 ${source.enabled ? 'bg-emerald-400' : 'bg-[var(--color-text-muted)]'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="card p-4">
        <h2 className="section-label mb-3">System Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <Database className="w-3.5 h-3.5" />, label: 'Database', value: 'SQLite (prisma/dev.db)' },
            { icon: <Cpu className="w-3.5 h-3.5" />, label: 'AI Layer', value: 'Build-time only (no runtime API keys)' },
            { icon: <Shield className="w-3.5 h-3.5" />, label: 'Engine', value: 'Deterministic rule-based (8 checks)' },
            { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />, label: 'Data', value: 'Synthetic demo data only', valueCls: 'text-amber-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--color-bg-hover)]">
              <span className="text-[var(--color-text-muted)] mt-0.5">{item.icon}</span>
              <div>
                <div className="text-[0.625rem] text-[var(--color-text-muted)] uppercase tracking-wider">{item.label}</div>
                <div className={`text-sm font-medium ${item.valueCls || 'text-[var(--color-text-primary)]'}`}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
