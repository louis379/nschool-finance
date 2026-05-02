import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

import { loadSnapshot } from '@/lib/risk-share-store';

export const dynamic = 'force-dynamic';

type Params = { token: string };

function formatMoney(v: number): string {
  return `NT$ ${Math.round(v).toLocaleString('en-US')}`;
}

function formatPct(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return '—';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(digits)}%`;
}

function formatRiskPct(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return '—';
  return `${v.toFixed(digits)}%`;
}

export default async function SharedRiskPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;
  if (!token || !/^[a-f0-9]{32}$/.test(token)) notFound();

  const snapshot = loadSnapshot(token);
  if (!snapshot) notFound();

  return (
    <div className="min-h-screen bg-[#F4F2FF] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        <header className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">投資組合風險體檢（分享）</h1>
            <p className="text-sm text-gray-500">唯讀快照 · 24 小時後過期</p>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">總市值</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-gray-800">
              {formatMoney(snapshot.summary.totalValue)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">總成本</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-gray-800">
              {formatMoney(snapshot.summary.totalCost)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">未實現損益</p>
            <p
              className={`mt-1.5 text-xl font-bold tabular-nums ${
                snapshot.summary.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatMoney(snapshot.summary.pnl)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">報酬率</p>
            <p
              className={`mt-1.5 text-xl font-bold tabular-nums ${
                snapshot.summary.pnlPct >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatPct(snapshot.summary.pnlPct)}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">VaR 95%</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-800">
              {formatRiskPct(snapshot.metrics.var95)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">夏普值</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-800">
              {snapshot.metrics.sharpe.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">最大回撤</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-800">
              {formatRiskPct(snapshot.metrics.maxDrawdown)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase">年化波動率</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-800">
              {formatRiskPct(snapshot.metrics.annualizedVol)}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">持倉權重 Top 5</h2>
          <ul className="space-y-1.5 text-sm">
            {snapshot.weights.slice(0, 5).map((w) => (
              <li key={w.symbol} className="flex items-center justify-between">
                <span className="text-gray-700">{w.name}</span>
                <span className="text-gray-500 tabular-nums text-xs">
                  {w.weight.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-gray-400">
            最大集中度 {snapshot.concentration.toFixed(1)}% · 教學用，不構成投資建議
          </p>
        </section>

        <div className="text-center">
          <Link
            href="/risk-checkup"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
          >
            幫我也做一份風險體檢
          </Link>
        </div>
      </div>
    </div>
  );
}
