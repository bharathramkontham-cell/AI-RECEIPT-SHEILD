import Link from 'next/link';
import { Shield, FileCheck2, Search, BarChart3, FileText, ChevronRight, CheckCircle2, AlertOctagon, HelpCircle, AlertTriangle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Nav — sticky */}
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)]/90 backdrop-blur-md" aria-label="Site navigation">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Receipt Shield home">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-[0.875rem] text-[var(--color-text-primary)]">Receipt Shield</span>
          </Link>
          <Link href="/dashboard" className="btn btn-primary text-[0.8125rem]">
            Open Demo <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-muted)] border border-indigo-500/15 text-indigo-300 text-[0.6875rem] font-medium mb-6 tracking-wide">
          Evidence-based expense verification
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[var(--color-text-primary)] leading-[1.15] mb-4 tracking-tight">
          Approve expenses in under a minute.{' '}
          <span className="gradient-text">Every time.</span>
        </h1>

        <p className="text-[0.9375rem] sm:text-base text-[var(--color-text-secondary)] max-w-xl mx-auto mb-3 leading-relaxed">
          Receipt Shield cross-references each claim against independent sources — card&nbsp;ledgers,
          merchant&nbsp;registries, travel&nbsp;bookings — and delivers a decision-ready case&nbsp;file.
        </p>

        <p className="text-[0.8125rem] text-[var(--color-text-muted)] max-w-md mx-auto mb-8">
          No image forensics. No accusations. Just evidence the claimant doesn&apos;t control.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
          <Link href="/claims/clm-002" className="btn btn-primary text-[0.8125rem] px-5 py-2">
            <Search className="w-4 h-4" />
            See a live claim review
          </Link>
          <Link href="/dashboard" className="btn btn-ghost text-[0.8125rem] px-5 py-2">
            <BarChart3 className="w-4 h-4" />
            View dashboard
          </Link>
        </div>
      </section>

      {/* Product preview — numbered steps */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-16">
        <div className="card p-5">
          <div className="section-label mb-3">How it works</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {[
              { icon: <FileText className="w-4 h-4 text-indigo-400" />, label: 'Claim submitted', detail: 'AI extracts key fields' },
              { icon: <Search className="w-4 h-4 text-indigo-400" />, label: 'Evidence checks', detail: '6 independent sources' },
              { icon: <BarChart3 className="w-4 h-4 text-indigo-400" />, label: 'Conflicts surfaced', detail: 'Both values shown' },
              { icon: <FileCheck2 className="w-4 h-4 text-indigo-400" />, label: 'Case file ready', detail: 'Approver acts in < 1 min' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--color-bg-hover)]">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[0.5625rem] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-[0.8125rem] font-medium text-[var(--color-text-primary)] leading-snug">{s.label}</div>
                  <div className="text-[0.6875rem] text-[var(--color-text-muted)]">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Evidence States */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] text-center mb-1.5">Four evidence states. No guesswork.</h2>
        <p className="text-[0.8125rem] text-[var(--color-text-muted)] text-center mb-6 max-w-md mx-auto">
          Every claim resolves to one of four states based on what the evidence shows — not a binary &quot;real&quot; or &quot;not real.&quot;
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Verified', desc: 'Independent evidence corroborates the claim.', cls: 'badge-verified' },
            { icon: <AlertOctagon className="w-3.5 h-3.5" />, label: 'Conflicting', desc: 'Two sources disagree. Both values are shown for the approver.', cls: 'badge-conflicting' },
            { icon: <HelpCircle className="w-3.5 h-3.5" />, label: 'Unverified', desc: 'Not enough evidence yet. Always states what would resolve it.', cls: 'badge-unverified' },
            { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'Policy Exception', desc: 'A policy limit is exceeded. Not an accusation — may be legitimate.', cls: 'badge-exception' },
          ].map((s) => (
            <div key={s.label} className="card p-3.5 flex items-start gap-2.5">
              <span className={`badge ${s.cls} flex-shrink-0`}>{s.icon} {s.label}</span>
              <p className="text-[0.6875rem] text-[var(--color-text-secondary)] leading-relaxed pt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Boundaries */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)] mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> What Receipt Shield does
            </h3>
            <ul className="space-y-1.5">
              {[
                'Cross-references claims against card ledgers, merchant registries, and travel bookings',
                'Surfaces conflicts with both values and their sources shown transparently',
                'Generates a decision-ready case file with numbered findings',
                'Records every decision in an immutable audit trail',
                'Helps employees reconstruct legitimately lost receipts',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[0.6875rem] text-[var(--color-text-secondary)] leading-relaxed">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400/50 mt-0.5 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)] mb-2.5 flex items-center gap-2">
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" /> What we don&apos;t do
            </h3>
            <ul className="space-y-1.5">
              {[
                'No image forensics or "real vs. AI-generated" classification',
                'No auto-rejection or auto-accusation — humans decide',
                'No accusatory language in any surface of the product',
                'Not a replacement for enterprise platforms (AppZen, SAP Concur)',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[0.6875rem] text-[var(--color-text-secondary)] leading-relaxed">
                  <AlertOctagon className="w-3 h-3 text-red-400/50 mt-0.5 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: '< 60s', label: 'average time to decision with a case file', source: 'Demo metric' },
            { value: '87%', label: 'of finance teams skip acting on suspected issues', source: 'Medius Financial Census 2026' },
            { value: '4→1', label: 'evidence states replace "approve or reject"', source: null },
          ].map((stat) => (
            <div key={stat.value} className="card p-4 text-center">
              <div className="kpi-value gradient-text mb-1">{stat.value}</div>
              <p className="text-[0.6875rem] text-[var(--color-text-secondary)] mb-0.5">{stat.label}</p>
              {stat.source && <p className="text-[0.5625rem] text-[var(--color-text-muted)]">{stat.source}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-default)] mt-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[0.8125rem] font-medium text-[var(--color-text-secondary)]">Receipt Shield</span>
            </div>
            <nav className="flex items-center gap-4 text-[0.6875rem] text-[var(--color-text-muted)]" aria-label="Footer navigation">
              <Link href="/dashboard" className="hover:text-[var(--color-text-primary)] transition-colors">Dashboard</Link>
              <Link href="/claims" className="hover:text-[var(--color-text-primary)] transition-colors">Claims</Link>
              <Link href="/auditor" className="hover:text-[var(--color-text-primary)] transition-colors">Audit Log</Link>
            </nav>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--color-border-default)] text-center">
            <p className="text-[0.5625rem] text-[var(--color-text-muted)] leading-relaxed tracking-wide">
              Hackathon prototype · All data is synthetic · Not for production use · No real personal or financial data is stored
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
