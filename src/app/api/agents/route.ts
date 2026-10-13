import { NextResponse } from 'next/server';
import { agentsRepo, getDatabase } from '@/server/db';
import { Agent } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId') || undefined;
  const agents = agentsRepo.list(workspaceId);
  return NextResponse.json({ agents });
}

export async function POST(request: Request) {
  try {
    const body: Agent = await request.json();
    const db = getDatabase();
    const user = db.users[0];
    const saved = agentsRepo.save(body, user);
    return NextResponse.json({ success: true, agent: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed saving agent' }, { status: 500 });
  }
}
