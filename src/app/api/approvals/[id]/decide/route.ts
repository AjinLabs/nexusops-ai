import { NextResponse } from 'next/server';
import { approvalsRepo, getDatabase } from '@/server/db';
import { resumeWorkflowAfterApproval } from '@/server/engine/workflow-runtime';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { decision, comment } = await request.json();
    if (!decision || (decision !== 'approved' && decision !== 'rejected')) {
      return NextResponse.json({ error: 'Valid decision ("approved" | "rejected") is required' }, { status: 400 });
    }

    const db = getDatabase();
    // Use Marcus Vance (Governance / Approver)
    const approverUser = db.users.find((u) => u.role === 'approver') || db.users[2];

    const updated = approvalsRepo.decide(id, decision, approverUser, comment);
    if (!updated) {
      return NextResponse.json({ error: 'Approval request not found' }, { status: 404 });
    }

    let resumedRun = null;
    if (decision === 'approved') {
      resumedRun = await resumeWorkflowAfterApproval(updated.runId, updated, approverUser);
    }

    return NextResponse.json({
      success: true,
      approval: updated,
      resumedRun,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed recording decision' }, { status: 500 });
  }
}
