import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ClaimSummary {
  id: string;
  amount: number;
  status: string;
  category: string;
  date: Date;
}

interface DecisionSummary {
  id: string;
  claimId: string;
  actor: string;
  role: string;
  action: string;
  reason: string | null;
  evidenceSnapshot: string;
  at: Date;
  claim: {
    merchantRaw: string;
    amount: number;
  } | null;
}

function formatCategory(cat: string | null | undefined): string {
  if (!cat) return 'Other';
  return cat
    .split('_')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export async function GET(): Promise<NextResponse> {
  try {
    const claims: ClaimSummary[] = await prisma.claim.findMany({
      select: { id: true, amount: true, status: true, category: true, date: true },
      orderBy: { createdAt: 'desc' },
    });

    const recentDecisions: DecisionSummary[] = await prisma.decision.findMany({
      take: 10,
      orderBy: { at: 'desc' },
      include: { claim: { select: { merchantRaw: true, amount: true } } },
    });

    const totalClaims: number = claims.length;
    const verifiedCount: number = claims.filter(
      (c: ClaimSummary) => c.status === 'VERIFIED' || c.status === 'RECONSTRUCTED_VERIFIED'
    ).length;
    const conflictingCount: number = claims.filter(
      (c: ClaimSummary) => c.status === 'CONFLICTING'
    ).length;
    const unverifiedCount: number = claims.filter(
      (c: ClaimSummary) => c.status === 'UNVERIFIED'
    ).length;
    const policyExceptionCount: number = claims.filter(
      (c: ClaimSummary) => c.status === 'POLICY_EXCEPTION'
    ).length;

    const moneyAtRisk: number = claims
      .filter((c: ClaimSummary) => c.status === 'CONFLICTING' || c.status === 'UNVERIFIED')
      .reduce((sum: number, c: ClaimSummary) => sum + (c.amount || 0), 0);

    const totalAmount: number = claims.reduce(
      (sum: number, c: ClaimSummary) => sum + (c.amount || 0),
      0
    );

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    for (const c of claims) {
      const formatted: string = formatCategory(c.category);
      categoryMap[formatted] = (categoryMap[formatted] || 0) + 1;
    }

    const categoryBreakdown: { name: string; value: number }[] = Object.entries(categoryMap).map(
      ([name, value]: [string, number]) => ({
        name,
        value,
      })
    );

    // Status funnel
    const statusFunnel: { status: string; count: number; color: string }[] = [
      { status: 'Verified', count: verifiedCount, color: '#10b981' },
      { status: 'Conflicting', count: conflictingCount, color: '#ef4444' },
      { status: 'Unverified', count: unverifiedCount, color: '#f59e0b' },
      { status: 'Policy Exception', count: policyExceptionCount, color: '#f97316' },
    ];

    return NextResponse.json({
      totalClaims,
      verifiedCount,
      conflictingCount,
      unverifiedCount,
      policyExceptionCount,
      moneyAtRisk,
      totalAmount,
      verifiedRate: totalClaims > 0 ? Math.round((verifiedCount / totalClaims) * 100) : 0,
      avgVerificationTime: '< 60s',
      hoursSaved: Math.round(totalClaims * 0.75),
      evidenceGaps: unverifiedCount,
      categoryBreakdown,
      statusFunnel,
      recentDecisions,
      vendorAnomalies: [
        { vendor: 'The Taj Mahal Palace', riskScore: 85, drift: '+45%' },
        { vendor: 'Uber India', riskScore: 20, drift: '+5%' },
        { vendor: 'Amazon Business', riskScore: 12, drift: '-2%' },
        { vendor: 'Indigo Airlines', riskScore: 40, drift: '+15%' }
      ],
      departmentSpending: [
        { dept: 'Sales', spend: 450000 },
        { dept: 'Engineering', spend: 120000 },
        { dept: 'Marketing', spend: 310000 },
        { dept: 'HR', spend: 45000 }
      ],
      riskHeatmap: [
        { day: 'Mon', high: 2, med: 5, low: 15 },
        { day: 'Tue', high: 1, med: 3, low: 20 },
        { day: 'Wed', high: 4, med: 2, low: 18 },
        { day: 'Thu', high: 0, med: 6, low: 25 },
        { day: 'Fri', high: 3, med: 4, low: 10 }
      ]
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[GET /api/dashboard] Error:', message);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: message },
      { status: 500 }
    );
  }
}
