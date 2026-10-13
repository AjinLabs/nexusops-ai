import { NextResponse } from 'next/server';
import { auditRepo } from '@/server/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const logs = auditRepo.list(limit);
  return NextResponse.json({ logs });
}
