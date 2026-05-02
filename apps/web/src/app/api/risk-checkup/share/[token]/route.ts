import { NextResponse } from 'next/server';

import { loadSnapshot } from '@/lib/risk-share-store';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  try {
    const { token } = await context.params;
    if (!token || !/^[a-f0-9]{32}$/.test(token)) {
      return NextResponse.json({ error: '無效 token' }, { status: 400 });
    }
    const snapshot = loadSnapshot(token);
    if (!snapshot) {
      return NextResponse.json({ error: '連結已過期' }, { status: 404 });
    }
    return NextResponse.json({ snapshot });
  } catch (err) {
    console.error('[risk-checkup/share/[token]] error', err);
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 });
  }
}
