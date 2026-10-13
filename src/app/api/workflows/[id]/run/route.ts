import { NextResponse } from 'next/server';
import { workflowsRepo, getDatabase } from '@/server/db';
import { executeWorkflow } from '@/server/engine/workflow-runtime';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workflow = workflowsRepo.getById(id);
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const db = getDatabase();
    const actor = db.users[0]; // Alex Mercer default

    const run = await executeWorkflow(workflow, {
      mode: body.mode || 'production',
      triggerSource: body.triggerSource || 'manual',
      initiatedBy: body.initiatedBy || actor.name,
      initialPayload: body.initialPayload,
      actor,
    });

    return NextResponse.json({ success: true, run });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Execution failed' },
      { status: 500 }
    );
  }
}
