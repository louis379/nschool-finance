import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, message } = body as { token: string; message: string };

    if (!token || !message) {
      return NextResponse.json({ success: false, error: 'Missing token or message' }, { status: 400 });
    }

    const params = new URLSearchParams({ message });
    const res = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ success: false, error: data.message ?? 'LINE Notify error' }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
