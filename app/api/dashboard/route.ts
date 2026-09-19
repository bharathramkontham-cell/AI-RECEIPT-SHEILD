import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [
    totalClaims,
    verifiedCount,
    conflictingCount,
    unverifiedCount,
    policyExceptionCount,
    claims,
    recentDecisions,
  ] = await Promise.all([
    prisma.claim.count(),
    prisma.claim.count({ where: { status: { in: ['VERIFIED', 'RECONSTRUCTED_VERIFIED'] } } }),
    prisma.claim.count({ where: { status: 'CONFLICTING' } }),
    prisma.claim.count({ where: { status: 'UNVERIFIED' } }),
    prisma.claim.count({ where: { status: 'POLICY_EXCEPTION' } }),
    prisma.claim.findMany({
      select: { amount: true, status: true, category: true, date: true },
    }),
    prisma.decision.findMany({
      take: 10,
      orderBy: { at: 'desc' },
      include: { claim: { select: { merchantRaw: true, amount: true } } },
    }),
  ]);

  const moneyAtRisk = claims
    .filter((c) => c.status === 'CONFLICTING' || c.status === 'UNVERIFIED')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);

  // Category breakdown
  const categoryBreakdown = claims.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Status funnel
  const statusFunnel = [
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
    categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({
      name,
      value,
    })),
    statusFunnel,
    recentDecisions,
  });
}
