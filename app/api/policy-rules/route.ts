import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const rules = await prisma.policyRule.findMany({
    orderBy: { category: 'asc' },
  });
  return NextResponse.json(rules);
}
