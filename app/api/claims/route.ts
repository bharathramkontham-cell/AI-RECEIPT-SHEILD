import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get('status');
  const empId = searchParams.get('empId');
  const category = searchParams.get('category');
  const dept = searchParams.get('dept');
  const minAmount = searchParams.get('minAmount');
  const maxAmount = searchParams.get('maxAmount');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (status) where.status = status;
  if (empId) where.empId = empId;
  if (category) where.category = category;
  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) where.amount.gte = parseFloat(minAmount);
    if (maxAmount) where.amount.lte = parseFloat(maxAmount);
  }
  if (dept) {
    where.employee = { dept };
  }

  const claims = await prisma.claim.findMany({
    where,
    include: {
      employee: { select: { name: true, empCode: true, dept: true } },
      caseFile: { select: { decisionStatus: true, recommendedAction: true } },
      _count: { select: { evidenceItems: true, findings: true, decisions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(claims);
}
