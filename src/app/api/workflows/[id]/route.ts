import { NextResponse } from 'next/server';
import { workflowsRepo, getDatabase } from '@/server/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workflow = workflowsRepo.getById(id);
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }
  return NextResponse.json({ workflow });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDatabase();
  const user = db.users[0];
  const ok = workflowsRepo.delete(id, user);
  return NextResponse.json({ success: ok });
}
