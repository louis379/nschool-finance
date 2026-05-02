/**
 * 投資組合風險體檢 — 純計算函式（無副作用，可測試）
 */

export type Holding = {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
};

export type WeightEntry = {
  symbol: string;
  name: string;
  value: number;
  weight: number;
};

export type ValuationSummary = {
  totalValue: number;
  totalCost: number;
  pnl: number;
  pnlPct: number;
};

export type RiskMetrics = {
  var95: number;
  sharpe: number;
  maxDrawdown: number;
  annualizedVol: number;
};

export type TradeRecord = {
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  fee: number;
  executedAt: number;
};

const TRADING_DAYS_PER_YEAR = 252;

function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

export function valuation(holdings: Holding[]): ValuationSummary {
  let totalValue = 0;
  let totalCost = 0;
  for (const h of holdings) {
    if (!isFiniteNumber(h.qty) || !isFiniteNumber(h.currentPrice) || !isFiniteNumber(h.avgCost)) {
      continue;
    }
    totalValue += h.qty * h.currentPrice;
    totalCost += h.qty * h.avgCost;
  }
  const pnl = totalValue - totalCost;
  const pnlPct = totalCost === 0 ? 0 : (pnl / totalCost) * 100;
  return { totalValue, totalCost, pnl, pnlPct };
}

export function weights(holdings: Holding[]): WeightEntry[] {
  const entries: { symbol: string; name: string; value: number }[] = holdings
    .map((h) => ({
      symbol: h.symbol,
      name: h.name,
      value: Math.max(0, h.qty * h.currentPrice),
    }))
    .filter((e) => e.value > 0);

  const total = entries.reduce((acc, e) => acc + e.value, 0);
  if (total === 0) return [];

  return entries
    .map((e) => ({ ...e, weight: (e.value / total) * 100 }))
    .sort((a, b) => b.weight - a.weight);
}

export function maxConcentration(weights: WeightEntry[]): number {
  if (weights.length === 0) return 0;
  return weights.reduce((acc, w) => (w.weight > acc ? w.weight : acc), 0);
}

export function dailyReturns(equity: number[]): number[] {
  if (equity.length < 2) return [];
  const out: number[] = [];
  for (let i = 1; i < equity.length; i++) {
    const prev = equity[i - 1];
    if (!isFiniteNumber(prev) || prev === 0) continue;
    const cur = equity[i];
    if (!isFiniteNumber(cur)) continue;
    out.push((cur - prev) / prev);
  }
  return out;
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const variance = xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(variance);
}

export function annualizedVolatility(
  returns: number[],
  periodsPerYear: number = TRADING_DAYS_PER_YEAR
): number {
  if (returns.length < 2) return 0;
  return stdev(returns) * Math.sqrt(periodsPerYear) * 100;
}

export function sharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02,
  periodsPerYear: number = TRADING_DAYS_PER_YEAR
): number {
  if (returns.length < 2) return 0;
  const sd = stdev(returns);
  if (sd === 0) return 0;
  const periodicRf = riskFreeRate / periodsPerYear;
  const excess = mean(returns) - periodicRf;
  return (excess / sd) * Math.sqrt(periodsPerYear);
}

export function maxDrawdown(equity: number[]): number {
  if (equity.length === 0) return 0;
  let peak = equity[0];
  let mdd = 0;
  for (const v of equity) {
    if (!isFiniteNumber(v)) continue;
    if (v > peak) peak = v;
    if (peak <= 0) continue;
    const dd = (v - peak) / peak;
    if (dd < mdd) mdd = dd;
  }
  return Math.abs(mdd) * 100;
}

export function var95(returns: number[]): number {
  if (returns.length === 0) return 0;
  const sorted = [...returns].sort((a, b) => a - b);
  const idx = Math.max(0, Math.floor(sorted.length * 0.05));
  const q = sorted[idx];
  if (!isFiniteNumber(q)) return 0;
  return Math.abs(q) * 100;
}

/**
 * 由 trade_history 重建一條等值權益曲線（cumulative net cash flow + holdings mark-to-market）。
 * 沒有歷史價格資料時，這是合理的近似：每筆交易事件後的帳面價值序列。
 */
export function buildEquityCurve(
  initialCapital: number,
  trades: TradeRecord[],
  finalMark: { qty: number; price: number } = { qty: 0, price: 0 }
): number[] {
  const sorted = [...trades].sort((a, b) => a.executedAt - b.executedAt);
  const curve: number[] = [initialCapital];
  let cash = initialCapital;
  let qty = 0;
  for (const t of sorted) {
    if (t.side === 'buy') {
      cash -= t.qty * t.price + t.fee;
      qty += t.qty;
    } else {
      cash += t.qty * t.price - t.fee;
      qty -= t.qty;
    }
    const mark = qty * t.price;
    curve.push(cash + mark);
  }
  if (finalMark.price > 0) {
    curve.push(cash + qty * finalMark.price);
  }
  return curve;
}

export function computeRiskMetrics(equity: number[]): RiskMetrics {
  const returns = dailyReturns(equity);
  return {
    var95: var95(returns),
    sharpe: sharpeRatio(returns),
    maxDrawdown: maxDrawdown(equity),
    annualizedVol: annualizedVolatility(returns),
  };
}

export type ConcentrationVerdict = {
  level: 'safe' | 'watch' | 'danger';
  topSymbol: string | null;
  topWeight: number;
  message: string;
};

export function concentrationVerdict(weights: WeightEntry[]): ConcentrationVerdict {
  if (weights.length === 0) {
    return { level: 'safe', topSymbol: null, topWeight: 0, message: '尚無持倉資料' };
  }
  const top = weights[0];
  if (top.weight > 40) {
    return {
      level: 'danger',
      topSymbol: top.symbol,
      topWeight: top.weight,
      message: `${top.name} 佔 ${top.weight.toFixed(1)}%，集中度過高，建議分散`,
    };
  }
  if (top.weight > 25) {
    return {
      level: 'watch',
      topSymbol: top.symbol,
      topWeight: top.weight,
      message: `${top.name} 佔 ${top.weight.toFixed(1)}%，留意集中度`,
    };
  }
  return {
    level: 'safe',
    topSymbol: top.symbol,
    topWeight: top.weight,
    message: '配置分散度尚可',
  };
}
