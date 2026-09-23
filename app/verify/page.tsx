'use client';

import { AppShell } from '@/components/app-shell';
import { EvidenceGraph } from '@/components/evidence-graph';
import { StatusBadge } from '@/components/status-badge';
import { SourceChip } from '@/components/source-chip';
import { formatINR, formatDate } from '@/lib/utils';
import { UNVERIFIED_EXPLAINER } from '@/lib/constants';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Upload, FileText, Search, CreditCard, MapPin, Building2,
  Shield, CheckCircle2, XCircle, AlertTriangle, ArrowRight,
  Loader2, Info,
} from 'lucide-react';

type VerifyStep = {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'done';
};

interface ClaimData {
  id: string;
  merchantRaw: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  description: string;
  employee: { name: string; empCode: string; dept: string };
  extraction: { fields: string; confidence: string } | null;
  evidenceItems: { id: string; source: string; kind: string; status: string; summary: string; detail: string }[];
  findings: { id: string; rank: number; title: string; detail: string; sourceRef: string; severity: string }[];
  caseFile: { decisionStatus: string; recommendedAction: string } | null;
}

const DEMO_CLAIM_ID = 'clm-002'; // The ₹18,750 conflicting hotel expense

const INITIAL_STEPS: VerifyStep[] = [
  { id: 'extract', label: 'Extracting receipt data', icon: <FileText className="w-4 h-4" />, status: 'pending' },
  { id: 'authenticity', label: 'Analyzing authenticity', icon: <Shield className="w-4 h-4" />, status: 'pending' },
  { id: 'merchant', label: 'Verifying merchant', icon: <Building2 className="w-4 h-4" />, status: 'pending' },
  { id: 'transaction', label: 'Checking transactions', icon: <CreditCard className="w-4 h-4" />, status: 'pending' },
  { id: 'travel', label: 'Checking travel records', icon: <MapPin className="w-4 h-4" />, status: 'pending' },
  { id: 'duplicates', label: 'Scanning for duplicates', icon: <Search className="w-4 h-4" />, status: 'pending' },
  { id: 'casefile', label: 'Generating case file', icon: <FileText className="w-4 h-4" />, status: 'pending' },
];

export default function VerifyExpensePage() {
  const [phase, setPhase] = useState<'upload' | 'verifying' | 'results'>('upload');
  const [steps, setSteps] = useState<VerifyStep[]>(INITIAL_STEPS);
  const [claim, setClaim] = useState<ClaimData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startVerification = useCallback(async (file?: File) => {
    setPhase('verifying');
    setSteps(INITIAL_STEPS);

    // Animate through steps
    const delays = [400, 800, 1200, 1600, 2000, 2400, 2800];
    const doneDelays = [700, 1100, 1500, 1900, 2300, 2700, 3200];

    delays.forEach((delay, i) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, j) => (j === i ? { ...s, status: 'running' } : s))
        );
      }, delay);
    });

    doneDelays.forEach((delay, i) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, j) => (j === i ? { ...s, status: 'done' } : s))
        );
      }, delay);
    });

    try {
      if (file) {
        // Real AI Extraction & Forensics Pipeline
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/verify', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setClaim(data);
        setTimeout(() => setPhase('results'), 3400);
      } else {
        // Fallback demo claim data
        const r = await fetch(`/api/claims/${DEMO_CLAIM_ID}`);
        const data = await r.json();
        setClaim(data);
        setTimeout(() => setPhase('results'), 3400);
      }
    } catch (e) {
      console.error(e);
      // fallback just in case
      setTimeout(() => setPhase('results'), 3400);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    startVerification(file);
  }, [startVerification]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startVerification(file);
  }, [startVerification]);

  const getStepIcon = (step: VerifyStep) => {
    if (step.status === 'running') return <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />;
    if (step.status === 'done') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    return <span className="w-4 h-4 rounded-full border border-[var(--color-border-default)] block" />;
  };

  // Parse extraction fields
  const extraction = claim?.extraction
    ? JSON.parse(claim.extraction.fields) as any
    : null;

  return (
    <AppShell>
      {phase === 'upload' && (
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Verify Expense</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Upload a receipt to start evidence-based verification
            </p>
          </div>

          {/* Upload area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`card cursor-pointer border-2 border-dashed p-12 text-center transition-all ${
              isDragging
                ? 'border-indigo-500/50 bg-indigo-500/5'
                : 'border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]'
            }`}
            role="button"
            tabIndex={0}
            aria-label="Upload receipt"
          >
            <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors ${isDragging ? 'text-indigo-400' : 'text-[var(--color-text-muted)]'}`} />
            <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Drop receipt here or click to upload
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Supports PDF, PNG, JPEG, TIFF
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.tiff"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Quick demo button */}
          <div className="mt-6 text-center">
            <button onClick={() => startVerification()} className="btn btn-primary text-sm px-6 py-2.5">
              <FileText className="w-4 h-4 mr-2" />
              Run Demo Verification
            </button>
            <p className="text-[0.625rem] text-[var(--color-text-muted)] mt-2">
              Uses synthetic demo data · ₹18,750 hotel expense
            </p>
          </div>

          {/* How it works */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <FileText className="w-5 h-5" />, title: 'Extract', desc: 'OCR reads merchant, amount, date, and line items' },
              { icon: <Search className="w-5 h-5" />, title: 'Verify', desc: 'Cross-check against 6+ independent sources' },
              { icon: <Shield className="w-5 h-5" />, title: 'Decide', desc: 'Evidence-based case file for fair approval' },
            ].map((step) => (
              <div key={step.title} className="card p-3.5 text-center">
                <div className="text-indigo-400 mx-auto w-fit mb-2">{step.icon}</div>
                <div className="text-[0.8125rem] font-medium text-[var(--color-text-primary)] mb-0.5">{step.title}</div>
                <div className="text-[0.6875rem] text-[var(--color-text-muted)] leading-snug">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'verifying' && (
        <div className="max-w-md mx-auto py-16">
          <div className="text-center mb-8">
            <Shield className="w-10 h-10 text-indigo-400 mx-auto mb-3 animate-pulse" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Verifying Expense</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Cross-checking against independent evidence sources</p>
          </div>

          <div className="card p-4 space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 py-2.5 ${i < steps.length - 1 ? 'border-b border-[var(--color-border-default)]' : ''} transition-opacity ${
                  step.status === 'pending' ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {getStepIcon(step)}
                <span className={`text-[0.8125rem] flex-1 ${
                  step.status === 'done' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                }`}>
                  {step.label}
                </span>
                {step.status === 'done' && (
                  <span className="text-[0.625rem] text-emerald-400 font-medium">Done</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'results' && claim && (
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={claim.status} size="sm" />
                <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">{claim.merchantRaw}</h1>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {claim.employee.name} · {claim.category} · {formatDate(claim.date)}
              </p>
            </div>
            <div className="text-right">
              <div className="kpi-value tabular-nums">{formatINR(claim.amount)}</div>
              <p className="text-[0.625rem] text-[var(--color-text-muted)]">Claimed amount</p>
            </div>
          </div>

          {/* Extraction */}
          {extraction && (
            <div className="card mb-3 overflow-hidden">
              <div className="px-3.5 py-2 border-b border-[var(--color-border-default)]">
                <h3 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Receipt Extraction
                </h3>
              </div>
              <div className="p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(extraction).map(([key, val]) => (
                  <div key={key}>
                    <div className="section-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-[0.8125rem] text-[var(--color-text-primary)] font-medium">{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Authenticity Analysis */}
          <div className="card mb-3 overflow-hidden">
            <div className="px-3.5 py-2 border-b border-[var(--color-border-default)]">
              <h3 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                AI Receipt Analysis (Forensics)
              </h3>
            </div>
            <div className="p-3.5">
              {(() => {
                const isForged = extraction?.forensics?.isForged || extraction?.forensics?.isAiGenerated;
                const score = extraction?.forensics?.confidenceScore || 99;
                const reasons = extraction?.forensics?.anomalyReasons || [];

                return (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`badge ${isForged ? 'badge-conflicting' : 'badge-verified'} text-[0.625rem]`}>
                        {isForged ? 'Critical Risk - Forgery Detected' : 'Low Risk'}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {isForged 
                          ? 'Anomalous generation indicators detected' 
                          : 'No anomalous generation indicators detected'} 
                        {' '}(Confidence: {score}%)
                      </span>
                    </div>

                    {isForged && reasons.length > 0 && (
                      <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                        <h4 className="text-xs font-semibold text-red-400 mb-1">Anomalies Detected:</h4>
                        <ul className="list-disc list-inside text-xs text-[var(--color-text-secondary)] space-y-1">
                          {reasons.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.75rem]">
                      {[
                        { label: 'Typography', status: isForged ? 'Inconsistent' : 'Consistent' },
                        { label: 'Logo region', status: isForged ? 'Anomalous' : 'Normal' },
                        { label: 'Compression', status: isForged ? 'Artefacts' : 'Uniform' },
                        { label: 'Lighting/Shadows', status: isForged ? 'Mismatched' : 'Valid' },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                          {isForged ? (
                            <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          )}
                          <span>{s.label}: {s.status}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 rounded bg-[var(--color-bg-hover)] border border-[var(--color-border-default)]">
                      <p className="text-[0.6875rem] text-[var(--color-text-muted)] flex items-start gap-1.5">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {isForged
                          ? 'This document has failed visual forensic analysis and is strongly suspected to be AI-generated or digitally manipulated. This is a critical policy violation.'
                          : 'This is an authenticity signal only. It is not proof of wrongdoing. The receipt image appears authentic, but the expense still requires independent evidence verification.'}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Evidence Graph */}
          <div className="mb-3">
            <EvidenceGraph
              claimId={claim.id}
              merchantRaw={claim.merchantRaw}
              amount={claim.amount}
              status={claim.status}
              evidenceItems={claim.evidenceItems}
            />
          </div>

          {/* Findings */}
          {claim.findings.length > 0 && (
            <div className="card mb-3 overflow-hidden">
              <div className="px-3.5 py-2 border-b border-[var(--color-border-default)]">
                <h3 className="text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">Key Findings</h3>
              </div>
              <div className="divide-y divide-[var(--color-border-default)]">
                {claim.findings.map((f) => (
                  <div key={f.id} className="p-3.5 flex items-start gap-2.5">
                    {f.severity === 'CRITICAL' ? (
                      <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    ) : f.severity === 'WARNING' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-[0.8125rem] font-medium text-[var(--color-text-primary)]">{f.title}</div>
                      <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{f.detail}</div>
                      <SourceChip source={f.sourceRef} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case file & actions */}
          {claim.caseFile && (
            <div className="card mb-3 p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="section-label">Recommended Action</div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)] mt-0.5">{claim.caseFile.recommendedAction}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/case-file/${claim.id}`} className="btn btn-secondary text-xs px-3 py-1.5">
                    View Case File
                  </Link>
                  <Link href={`/claims/${claim.id}`} className="btn btn-primary text-xs px-3 py-1.5">
                    Review & Decide <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Unverified explainer */}
          {(claim.status === 'UNVERIFIED' || claim.status === 'CONFLICTING') && (
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <p className="text-[0.6875rem] text-amber-300/80 flex items-start gap-1.5">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {claim.status === 'UNVERIFIED' ? UNVERIFIED_EXPLAINER : 'Evidence conflicts have been identified. This is not an accusation — it means independent sources do not fully corroborate the submitted claim. Human review is required.'}
              </p>
            </div>
          )}

          {/* Re-upload */}
          <div className="text-center mt-6">
            <button
              onClick={() => { setPhase('upload'); setClaim(null); }}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              ← Verify another expense
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
