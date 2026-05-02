import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import {
  aggregateTransactionsToDailyEOD,
  type PnlPoint,
  type PnlRange,
  type PnlTransactionRow,
} from '@/lib/pnl-curve';

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; data: PnlPoint[] }>();

function parseRange(value: string | null): PnlRange {
  if (value === '90d') return '90d';
  if (value === 'all') return 'all';
  return '30d';
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get('range'));

  const supabase = await createServerSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const userId = userData.user.id;

  const cacheKey = `${userId}:${range}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ range, points: cached.data, cached: true });
  }

  const { data: txRows, error: txError } = await supabase
    .from('transactions')
    .select('date, type, amount')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (txError) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 });
  }

  const rows: PnlTransactionRow[] = (txRows ?? []).map((r) => ({
    date: String(r.date),
    type: r.type as PnlTransactionRow['type'],
    amount: Number(r.amount),
  }));

  const points = aggregateTransactionsToDailyEOD(rows, range);

  cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data: points });

  return NextResponse.json({ range, points, cached: false });
}
