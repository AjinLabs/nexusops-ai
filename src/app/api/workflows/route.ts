import { NextResponse } from 'next/server';
import { workflowsRepo, getDatabase } from '@/server/db';
import { Workflow } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId') || undefined;
  const list = workflowsRepo.list(workspaceId);
  return NextResponse.json({ workflows: list });
}

export async function POST(request: Request) {
  try {
    const body: Workflow = await request.json();
    const db = getDatabase();
    const user = db.users[0]; // Alex Mercer default
    const saved = workflowsRepo.save(body, user);
    return NextResponse.json({ success: true, workflow: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed saving workflow' }, { status: 400 });
  }
}
