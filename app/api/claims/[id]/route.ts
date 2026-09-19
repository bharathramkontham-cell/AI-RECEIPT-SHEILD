import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const claim = await prisma.claim.findUnique({
    where: { id },
    include: {
      employee: true,
      extraction: true,
      evidenceItems: {
        orderBy: { fetchedAt: 'asc' },
      },
      findings: {
        orderBy: { rank: 'asc' },
      },
      caseFile: true,
      decisions: {
        orderBy: { at: 'desc' },
      },
      evidenceRequests: {
        orderBy: { sentAt: 'desc' },
      },
    },
  });

  if (!claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  return NextResponse.json(claim);
}
