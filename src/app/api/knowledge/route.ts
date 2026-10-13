import { NextResponse } from 'next/server';
import { knowledgeRepo, getDatabase } from '@/server/db';
import { KnowledgeDocument } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId') || undefined;
  const docs = knowledgeRepo.list(workspaceId);
  return NextResponse.json({ documents: docs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDatabase();
    const user = db.users[0];

    const newDoc: KnowledgeDocument = {
      id: `doc_${Date.now()}`,
      title: body.title || 'Untitled Knowledge Document',
      fileType: body.fileType || 'markdown',
      sizeKb: body.sizeKb || 120,
      chunkCount: Math.max(1, Math.floor((body.content?.length || 1000) / 400)),
      status: 'indexed',
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.name,
      orgId: 'org_acme',
      workspaceId: 'ws_prod',
      tags: body.tags || ['Enterprise', 'General'],
      sampleExcerpt: body.content?.slice(0, 300) || 'Verified enterprise document content.',
    };

    const saved = knowledgeRepo.add(newDoc, user);
    return NextResponse.json({ success: true, document: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed uploading document' }, { status: 500 });
  }
}
