import { describe, expect, it } from 'vitest';
import {
  aggregateTransactionsToDailyEOD,
  type PnlTransactionRow,
} from './pnl-curve';

const NOW = new Date('2026-05-01T12:00:00Z');

describe('aggregateTransactionsToDailyEOD', () => {
  it('returns empty array when there are no transactions', () => {
    expect(aggregateTransactionsToDailyEOD([], '30d', NOW)).toEqual([]);
    expect(aggregateTransactionsToDailyEOD([], 'all', NOW)).toEqual([]);
  });

  it('forward-fills daily EOD values across the 30d window', () => {
    const rows: PnlTransactionRow[] = [
      { date: '2026-04-29', type: 'income', amount: 1000 },
      { date: '2026-04-30', type: 'expense', amount: 200 },
    ];
    const out = aggregateTransactionsToDailyEOD(rows, '30d', NOW);
    expect(out).toHaveLength(30);
    expect(out[0]).toEqual({ date: '2026-04-02', value: 0 });
    expect(out[27]).toEqual({ date: '2026-04-29', value: 1000 });
    expect(out[28]).toEqual({ date: '2026-04-30', value: 800 });
    expect(out[29]).toEqual({ date: '2026-05-01', value: 800 });
  });

  it('treats transfers as net-zero and aggregates same-day rows', () => {
    const rows: PnlTransactionRow[] = [
      { date: '2026-04-30', type: 'income', amount: 500 },
      { date: '2026-04-30', type: 'transfer', amount: 9999 },
      { date: '2026-04-30', type: 'expense', amount: 100 },
    ];
    const out = aggregateTransactionsToDailyEOD(rows, '30d', NOW);
    const last = out[out.length - 1];
    expect(last.date).toBe('2026-05-01');
    expect(last.value).toBe(400);
  });

  it('range "all" starts at the earliest transaction date', () => {
    const rows: PnlTransactionRow[] = [
      { date: '2026-04-28', type: 'income', amount: 100 },
      { date: '2026-05-01', type: 'income', amount: 50 },
    ];
    const out = aggregateTransactionsToDailyEOD(rows, 'all', NOW);
    expect(out[0]).toEqual({ date: '2026-04-28', value: 100 });
    expect(out[out.length - 1]).toEqual({ date: '2026-05-01', value: 150 });
    expect(out).toHaveLength(4);
  });

  it('carries forward running total from before the 30d window into the first point', () => {
    const rows: PnlTransactionRow[] = [
      { date: '2026-01-01', type: 'income', amount: 10000 },
      { date: '2026-04-15', type: 'expense', amount: 2000 },
      { date: '2026-04-29', type: 'income', amount: 500 },
    ];
    const out = aggregateTransactionsToDailyEOD(rows, '30d', NOW);
    expect(out[0]).toEqual({ date: '2026-04-02', value: 10000 });
    expect(out[13]).toEqual({ date: '2026-04-15', value: 8000 });
    expect(out[27]).toEqual({ date: '2026-04-29', value: 8500 });
    expect(out[29]).toEqual({ date: '2026-05-01', value: 8500 });
  });

  it('produces exactly 90 points for "90d" range', () => {
    const rows: PnlTransactionRow[] = [
      { date: '2026-04-01', type: 'income', amount: 1 },
    ];
    const out = aggregateTransactionsToDailyEOD(rows, '90d', NOW);
    expect(out).toHaveLength(90);
    expect(out[0].date).toBe('2026-02-01');
    expect(out[out.length - 1].date).toBe('2026-05-01');
    expect(out[out.length - 1].value).toBe(1);
  });

  it('rounds values to two decimals', () => {
    const rows: PnlTransactionRow[] = [
      { date: '2026-05-01', type: 'income', amount: 0.1 },
      { date: '2026-05-01', type: 'income', amount: 0.2 },
    ];
    const out = aggregateTransactionsToDailyEOD(rows, '30d', NOW);
    expect(out[out.length - 1].value).toBe(0.3);
  });
});
