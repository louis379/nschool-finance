import { describe, expect, it } from 'vitest';

import {
  annualizedVolatility,
  buildEquityCurve,
  computeRiskMetrics,
  concentrationVerdict,
  dailyReturns,
  maxConcentration,
  maxDrawdown,
  sharpeRatio,
  valuation,
  var95,
  weights,
  type Holding,
  type TradeRecord,
} from './risk';

const sample: Holding[] = [
  { symbol: '2330', name: '台積電',  qty: 10, avgCost: 600,  currentPrice: 700 },
  { symbol: '2317', name: '鴻海',     qty: 50, avgCost: 100,  currentPrice: 110 },
  { symbol: 'NVDA', name: 'NVIDIA',   qty:  2, avgCost: 800,  currentPrice: 900 },
];

describe('valuation', () => {
  it('returns zeros for empty holdings', () => {
    expect(valuation([])).toEqual({ totalValue: 0, totalCost: 0, pnl: 0, pnlPct: 0 });
  });

  it('computes totals and pnl correctly', () => {
    const v = valuation(sample);
    // value = 10*700 + 50*110 + 2*900 = 7000 + 5500 + 1800 = 14300
    // cost  = 10*600 + 50*100 + 2*800 = 6000 + 5000 + 1600 = 12600
    expect(v.totalValue).toBe(14300);
    expect(v.totalCost).toBe(12600);
    expect(v.pnl).toBe(1700);
    expect(v.pnlPct).toBeCloseTo((1700 / 12600) * 100, 6);
  });

  it('skips invalid entries', () => {
    const bad: Holding[] = [
      ...sample,
      { symbol: 'BAD', name: 'Bad', qty: NaN, avgCost: 100, currentPrice: 100 },
    ];
    const v = valuation(bad);
    expect(v.totalValue).toBe(14300);
  });
});

describe('weights & concentration', () => {
  it('returns weights summing to 100 and sorted desc', () => {
    const w = weights(sample);
    const total = w.reduce((acc, e) => acc + e.weight, 0);
    expect(total).toBeCloseTo(100, 6);
    expect(w[0].symbol).toBe('2330');
    expect(w[1].weight).toBeGreaterThanOrEqual(w[2].weight);
  });

  it('reports max concentration', () => {
    const w = weights(sample);
    const top = maxConcentration(w);
    // 2330: 7000 / 14300 ≈ 48.95%
    expect(top).toBeCloseTo((7000 / 14300) * 100, 4);
  });

  it('flags concentration > 40% as danger', () => {
    const w = weights(sample);
    const v = concentrationVerdict(w);
    expect(v.level).toBe('danger');
    expect(v.topSymbol).toBe('2330');
  });

  it('handles zero-value holdings (skipped)', () => {
    const w = weights([{ symbol: 'X', name: 'X', qty: 0, avgCost: 1, currentPrice: 1 }]);
    expect(w).toEqual([]);
  });
});

describe('returns / volatility / sharpe', () => {
  it('dailyReturns computes period returns', () => {
    const r = dailyReturns([100, 110, 99, 105]);
    expect(r).toHaveLength(3);
    expect(r[0]).toBeCloseTo(0.1, 10);
    expect(r[1]).toBeCloseTo(-0.1, 10);
    expect(r[2]).toBeCloseTo(105 / 99 - 1, 10);
  });

  it('annualizedVolatility for constant returns is 0', () => {
    const r = [0.001, 0.001, 0.001, 0.001, 0.001];
    expect(annualizedVolatility(r)).toBe(0);
  });

  it('annualizedVolatility for varying returns is positive', () => {
    const r = [0.02, -0.01, 0.015, -0.02, 0.03, -0.005];
    const v = annualizedVolatility(r);
    expect(v).toBeGreaterThan(0);
    expect(Number.isFinite(v)).toBe(true);
  });

  it('sharpeRatio is 0 when stdev is 0', () => {
    expect(sharpeRatio([0.001, 0.001, 0.001])).toBe(0);
  });

  it('sharpeRatio is positive when mean exceeds rf', () => {
    const r = [0.01, 0.012, 0.008, 0.011, 0.009];
    const s = sharpeRatio(r, 0.02);
    expect(s).toBeGreaterThan(0);
  });
});

describe('maxDrawdown', () => {
  it('is 0 for monotonically increasing equity', () => {
    expect(maxDrawdown([100, 110, 120, 130])).toBe(0);
  });

  it('captures peak-to-trough drop in percent', () => {
    // peak 200, trough 140 → 30%
    expect(maxDrawdown([100, 200, 180, 140, 160])).toBeCloseTo(30, 6);
  });

  it('returns 0 for empty', () => {
    expect(maxDrawdown([])).toBe(0);
  });
});

describe('var95', () => {
  it('returns 0 for empty returns', () => {
    expect(var95([])).toBe(0);
  });

  it('picks 5th percentile worst loss as positive number', () => {
    const r = [-0.05, -0.04, -0.03, -0.02, -0.01, 0, 0.01, 0.02, 0.03, 0.04];
    // 5% of 10 = 0 → sorted[0] = -0.05 → 5
    expect(var95(r)).toBeCloseTo(5, 4);
  });
});

describe('buildEquityCurve & computeRiskMetrics', () => {
  it('builds curve from buys and sells', () => {
    const trades: TradeRecord[] = [
      { side: 'buy',  qty: 10, price: 100, fee: 0, executedAt: 1 },
      { side: 'buy',  qty: 10, price: 110, fee: 0, executedAt: 2 },
      { side: 'sell', qty:  5, price: 120, fee: 0, executedAt: 3 },
    ];
    const curve = buildEquityCurve(10000, trades);
    // start: 10000
    // after buy@100: cash=9000, qty=10, mark=10*100=1000 → 10000
    // after buy@110: cash=7900, qty=20, mark=20*110=2200 → 10100
    // after sell@120: cash=8500, qty=15, mark=15*120=1800 → 10300
    expect(curve).toHaveLength(4);
    expect(curve[0]).toBe(10000);
    expect(curve[3]).toBeCloseTo(10300, 6);
  });

  it('computeRiskMetrics returns all four fields', () => {
    const equity = [10000, 10100, 9900, 10200, 10000, 10500, 10300];
    const m = computeRiskMetrics(equity);
    expect(m).toHaveProperty('var95');
    expect(m).toHaveProperty('sharpe');
    expect(m).toHaveProperty('maxDrawdown');
    expect(m).toHaveProperty('annualizedVol');
    expect(Number.isFinite(m.var95)).toBe(true);
    expect(Number.isFinite(m.sharpe)).toBe(true);
    expect(Number.isFinite(m.maxDrawdown)).toBe(true);
    expect(Number.isFinite(m.annualizedVol)).toBe(true);
  });

  it('zero-equity series yields zero metrics', () => {
    const m = computeRiskMetrics([100, 100, 100, 100]);
    expect(m.var95).toBe(0);
    expect(m.maxDrawdown).toBe(0);
    expect(m.annualizedVol).toBe(0);
    expect(m.sharpe).toBe(0);
  });
});
