import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';

import { saveSnapshot, type RiskSnapshot } from '@/lib/risk-share-store';

export const runtime = 'nodejs';

type IncomingBody = {
  summary?: unknown;
  weights?: unknown;
  metrics?: unknown;
  concentration?: unknown;
};

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function parseSnapshot(body: IncomingBody): RiskSnapshot | null {
  const s = body.summary;
  const m = body.metrics;
  const w = body.weights;
  const c = body.concentration;
  if (!s || typeof s !== 'object') return null;
  if (!m || typeof m !== 'object') return null;
  if (!Array.isArray(w)) return null;
  if (!isNumber(c)) return null;

  const so = s as Record<string, unknown>;
  const mo = m as Record<string, unknown>;

  const summary = {
    totalValue: isNumber(so.totalValue) ? so.totalValue : 0,
    totalCost:  isNumber(so.totalCost)  ? so.totalCost  : 0,
    pnl:        isNumber(so.pnl)        ? so.pnl        : 0,
    pnlPct:     isNumber(so.pnlPct)     ? so.pnlPct     : 0,
  };

  const metrics = {
    var95:         isNumber(mo.var95)         ? mo.var95         : 0,
    sharpe:        isNumber(mo.sharpe)        ? mo.sharpe        : 0,
    maxDrawdown:   isNumber(mo.maxDrawdown)   ? mo.maxDrawdown   : 0,
    annualizedVol: isNumber(mo.annualizedVol) ? mo.annualizedVol : 0,
  };

  const weights = w
    .map((entry): RiskSnapshot['weights'][number] | null => {
      if (!entry || typeof entry !== 'object') return null;
      const e = entry as Record<string, unknown>;
      return {
        symbol: typeof e.symbol === 'string' ? e.symbol : '',
        name:   typeof e.name   === 'string' ? e.name   : '',
        value:  isNumber(e.value)  ? e.value  : 0,
        weight: isNumber(e.weight) ? e.weight : 0,
      };
    })
    .filter((e): e is RiskSnapshot['weights'][number] => e !== null && e.weight > 0);

  return {
    summary,
    metrics,
    weights,
    concentration: c,
    createdAt: Date.now(),
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: '無效的 JSON' }, { status: 400 });
    }
    const snapshot = parseSnapshot((raw ?? {}) as IncomingBody);
    if (!snapshot) {
      return NextResponse.json({ error: '請求格式不正確' }, { status: 400 });
    }

    const token = randomBytes(16).toString('hex');
    saveSnapshot(token, snapshot);
    console.log('[risk-checkup/share] created', { token });
    return NextResponse.json({ token });
  } catch (err) {
    console.error('[risk-checkup/share] error', err);
    return NextResponse.json({ error: '產生連結失敗' }, { status: 500 });
  }
}
