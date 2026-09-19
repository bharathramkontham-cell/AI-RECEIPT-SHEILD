import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { action, reason, actor, role } = body;

  // Validate action
  const validActions = ['APPROVE', 'HOLD', 'REJECT', 'REQUEST_EVIDENCE', 'INVESTIGATE'];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Reject requires a reason
  if (action === 'REJECT' && (!reason || reason.trim() === '')) {
    return NextResponse.json(
      { error: 'A reason is required when choosing to reject a claim' },
      { status: 400 }
    );
  }

  // Fetch current evidence for snapshot
  const claim = await prisma.claim.findUnique({
    where: { id },
    include: {
      evidenceItems: true,
      findings: true,
    },
  });

  if (!claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  // Create immutable decision record
  const decision = await prisma.decision.create({
    data: {
      claimId: id,
      actor: actor || 'Demo User',
      role: role || 'Finance',
      action,
      reason: reason || null,
      evidenceSnapshot: JSON.stringify({
        status: claim.status,
        evidenceCount: claim.evidenceItems.length,
        findingsCount: claim.findings.length,
        timestamp: new Date().toISOString(),
      }),
    },
  });

  // Update claim status based on action
  let newStatus = claim.status;
  if (action === 'APPROVE') newStatus = 'VERIFIED';
  if (action === 'REJECT') newStatus = 'CONFLICTING';
  if (action === 'HOLD') newStatus = 'UNVERIFIED';

  await prisma.claim.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json({ decision, newStatus });
}
