'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { PnlPoint, PnlRange } from '@/lib/pnl-curve';

const RANGES: { key: PnlRange; label: string }[] = [
  { key: '30d', label: '30 天' },
  { key: '90d', label: '90 天' },
  { key: 'all', label: '全部' },
];

type ChartPoint = PnlPoint & { changePct: number };

function buildChartPoints(points: PnlPoint[]): ChartPoint[] {
  if (points.length === 0) return [];
  const base = points[0].value;
  return points.map((p) => {
    const changePct = base !== 0 ? ((p.value - base) / Math.abs(base)) * 100 : 0;
    return { ...p, changePct };
  });
}

function formatShortDate(date: string): string {
  const [, m, d] = date.split('-');
  return `${m}/${d}`;
}

function formatTwd(value: number): string {
  return `NT$ ${Math.round(value).toLocaleString()}`;
}

type TooltipPayload = { payload: ChartPoint };

function PnlTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  const positive = p.changePct >= 0;
  return (
    <div className="rounded-xl bg-gray-900/95 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-medium">{p.date}</p>
      <p className="mt-1">{formatTwd(p.value)}</p>
      <p className={positive ? 'text-emerald-300' : 'text-red-300'}>
        {positive ? '+' : ''}{p.changePct.toFixed(2)}%
      </p>
    </div>
  );
}

export default function PnlCurveCard() {
  const [range, setRange] = useState<PnlRange>('30d');
  const [points, setPoints] = useState<PnlPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/profile/pnl-curve?range=${range}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`status_${res.status}`);
        return res.json() as Promise<{ points: PnlPoint[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setPoints(Array.isArray(body.points) ? body.points : []);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'fetch_failed');
        setPoints([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [range]);

  const chartPoints = useMemo(() => buildChartPoints(points), [points]);

  const summary = useMemo(() => {
    if (chartPoints.length === 0) return null;
    const last = chartPoints[chartPoints.length - 1];
    return { value: last.value, changePct: last.changePct };
  }, [chartPoints]);

  const isEmpty = !loading && chartPoints.length === 0 && !error;

  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary-500" /> 報酬曲線
        </h3>
        <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                range === r.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {summary && (
        <div className="mb-3">
          <p className="text-2xl font-bold text-gray-800">{formatTwd(summary.value)}</p>
          <p className={`text-xs mt-0.5 ${summary.changePct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {summary.changePct >= 0 ? '+' : ''}{summary.changePct.toFixed(2)}% (此區間)
          </p>
        </div>
      )}

      <div className="h-48 sm:h-56">
        {loading && (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            載入中…
          </div>
        )}

        {error && !loading && (
          <div className="h-full flex items-center justify-center text-xs text-red-500">
            無法載入資料，請稍後再試
          </div>
        )}

        {isEmpty && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <p className="text-sm font-medium text-gray-500">還沒有交易紀錄</p>
            <p className="text-xs text-gray-400 mt-1">先去交易吧，記帳完曲線就會出現</p>
          </div>
        )}

        {!loading && !error && chartPoints.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartPoints} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                minTickGap={24}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                width={48}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<PnlTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6C5CE7"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
