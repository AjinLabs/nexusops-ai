import { NextResponse } from 'next/server';
import { approvalsRepo } from '@/server/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as any;
  const approvals = approvalsRepo.list(status || 'all');
  return NextResponse.json({ approvals });
}
