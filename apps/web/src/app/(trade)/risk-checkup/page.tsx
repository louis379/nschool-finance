import { createServerSupabase } from '@/lib/supabase/server';
import type { Holding } from '@/lib/risk';
import RiskClient from './RiskClient';

export const dynamic = 'force-dynamic';

type HoldingRow = {
  symbol: unknown;
  name: unknown;
  quantity: unknown;
  avg_cost: unknown;
  current_price: unknown;
};

function toNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function toString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

async function fetchInitial(): Promise<{ initialHoldings: Holding[]; userId: string | null }> {
  try {
    const supabase = await createServerSupabase();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return { initialHoldings: [], userId: null };
    }

    const { data: portfolios } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    const portfolioId = portfolios && portfolios.length > 0 ? portfolios[0].id : null;
    if (!portfolioId) {
      return { initialHoldings: [], userId: user.id };
    }

    const { data: holdingsRows } = await supabase
      .from('holdings')
      .select('symbol, name, quantity, avg_cost, current_price')
      .eq('portfolio_id', portfolioId);

    const initialHoldings: Holding[] = (holdingsRows ?? []).map((row: HoldingRow) => ({
      symbol: toString(row.symbol),
      name: toString(row.name),
      qty: toNumber(row.quantity),
      avgCost: toNumber(row.avg_cost),
      currentPrice: toNumber(row.current_price),
    }));

    return { initialHoldings, userId: user.id };
  } catch (err) {
    console.warn('[risk-checkup] supabase fetch failed, falling back to client storage', err);
    return { initialHoldings: [], userId: null };
  }
}

export default async function RiskCheckupPage() {
  const { initialHoldings, userId } = await fetchInitial();
  return <RiskClient initialHoldings={initialHoldings} userId={userId} />;
}
