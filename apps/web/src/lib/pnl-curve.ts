export type PnlRange = '30d' | '90d' | 'all';

export type PnlTransactionRow = {
  date: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
};

export type PnlPoint = {
  date: string;
  value: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function toIsoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseIsoDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

function netDelta(row: PnlTransactionRow): number {
  if (row.type === 'income') return row.amount;
  if (row.type === 'expense') return -row.amount;
  return 0;
}

export function aggregateTransactionsToDailyEOD(
  rows: PnlTransactionRow[],
  range: PnlRange,
  now: Date = new Date()
): PnlPoint[] {
  const today = parseIsoDate(toIsoDate(now));

  const dailyDelta = new Map<string, number>();
  for (const row of rows) {
    if (!row.date) continue;
    const key = row.date.slice(0, 10);
    dailyDelta.set(key, (dailyDelta.get(key) ?? 0) + netDelta(row));
  }

  if (dailyDelta.size === 0) return [];

  const sortedDates = [...dailyDelta.keys()].sort();
  const earliest = parseIsoDate(sortedDates[0]);

  let start: Date;
  if (range === '30d') {
    start = new Date(today.getTime() - 29 * DAY_MS);
  } else if (range === '90d') {
    start = new Date(today.getTime() - 89 * DAY_MS);
  } else {
    start = earliest;
  }

  if (start.getTime() > today.getTime()) return [];

  let running = 0;
  for (const d of sortedDates) {
    if (parseIsoDate(d).getTime() < start.getTime()) {
      running += dailyDelta.get(d) ?? 0;
    } else {
      break;
    }
  }

  const points: PnlPoint[] = [];
  for (let t = start.getTime(); t <= today.getTime(); t += DAY_MS) {
    const key = toIsoDate(new Date(t));
    if (dailyDelta.has(key)) running += dailyDelta.get(key) ?? 0;
    points.push({ date: key, value: Math.round(running * 100) / 100 });
  }

  return points;
}
