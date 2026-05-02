'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import AppLayout from '@/components/layout/AppLayout';
import {
  computeRiskMetrics,
  concentrationVerdict,
  maxConcentration,
  valuation,
  weights,
  type Holding,
  type RiskMetrics,
} from '@/lib/risk';

type RiskClientProps = {
  initialHoldings: Holding[];
  userId: string | null;
};

type LocalHolding = {
  symbol?: unknown;
  name?: unknown;
  qty?: unknown;
  avgCost?: unknown;
  currentPrice?: unknown;
};

const PIE_COLORS = [
  '#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe',
  '#6d28d9', '#5b21b6', '#4c1d95',
];

function toFiniteNumber(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function loadLocalHoldings(): Holding[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('nschool-holdings');
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry): Holding | null => {
        if (!entry || typeof entry !== 'object') return null;
        const e = entry as LocalHolding;
        const symbol = typeof e.symbol === 'string' ? e.symbol : '';
        const name = typeof e.name === 'string' ? e.name : symbol;
        const qty = toFiniteNumber(e.qty);
        const avgCost = toFiniteNumber(e.avgCost);
        const currentPrice = toFiniteNumber(e.currentPrice);
        if (!symbol || qty <= 0) return null;
        return { symbol, name, qty, avgCost, currentPrice };
      })
      .filter((h): h is Holding => h !== null);
  } catch {
    return [];
  }
}

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

type KpiProps = {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  negative?: boolean;
};

function KpiCard({ label, value, sub, positive, negative }: KpiProps) {
  const tone = positive
    ? 'text-emerald-600'
    : negative
    ? 'text-rose-600'
    : 'text-gray-800';
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
      <p className="text-[11px] md:text-xs text-gray-400 font-medium tracking-wide uppercase">
        {label}
      </p>
      <p className={`mt-1.5 text-xl md:text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] md:text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

type RiskTileProps = {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
};

function RiskTile({ label, value, hint, icon }: RiskTileProps) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <p className="text-[11px] md:text-xs text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </p>
        <span className="text-primary-500">{icon}</span>
      </div>
      <p className="mt-2 text-2xl md:text-3xl font-bold tabular-nums text-gray-800">{value}</p>
      <p className="mt-1 text-[11px] md:text-xs text-gray-500 leading-relaxed">{hint}</p>
    </div>
  );
}

export default function RiskClient({ initialHoldings, userId }: RiskClientProps) {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSentence, setAiSentence] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareError, setShareError] = useState<string>('');
  const [toast, setToast] = useState<string>('');

  // Hydrate from localStorage if server returned nothing (guest mode 慣例)
  useEffect(() => {
    if (initialHoldings.length === 0) {
      const local = loadLocalHoldings();
      if (local.length > 0) setHoldings(local);
    }
  }, [initialHoldings]);

  const summary = useMemo(() => valuation(holdings), [holdings]);
  const portfolioWeights = useMemo(() => weights(holdings), [holdings]);
  const concentration = useMemo(() => maxConcentration(portfolioWeights), [portfolioWeights]);
  const verdict = useMemo(() => concentrationVerdict(portfolioWeights), [portfolioWeights]);

  const equityCurve = useMemo<number[]>(() => {
    if (holdings.length === 0) return [];
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('nschool-equity-curve');
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
        }
      }
    } catch {
      // ignore
    }
    // Fallback: synthesize a curve from cost → current value
    if (summary.totalCost > 0 && summary.totalValue > 0) {
      const start = summary.totalCost;
      const end = summary.totalValue;
      const steps = 21;
      const arr: number[] = [];
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const drift = start + (end - start) * t;
        const wobble = Math.sin(i * 0.9) * (start * 0.01);
        arr.push(drift + wobble);
      }
      return arr;
    }
    return [];
  }, [holdings, summary.totalCost, summary.totalValue]);

  const metrics = useMemo<RiskMetrics>(() => computeRiskMetrics(equityCurve), [equityCurve]);

  async function handleRecompute() {
    setLoading(true);
    setAiError('');
    try {
      const local = loadLocalHoldings();
      const next = local.length > 0 ? local : initialHoldings;
      setHoldings(next);
      setToast('已重新計算');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(''), 1800);
    }
  }

  async function handleAiSentence() {
    setAiLoading(true);
    setAiError('');
    setAiSentence('');
    try {
      const res = await fetch('/api/risk-checkup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          weights: portfolioWeights,
          metrics,
          concentration,
        }),
      });
      const json: unknown = await res.json();
      if (!res.ok) {
        const msg =
          typeof json === 'object' && json && 'error' in json && typeof (json as { error: unknown }).error === 'string'
            ? (json as { error: string }).error
            : '建議產生失敗';
        setAiError(msg);
        return;
      }
      if (
        typeof json === 'object' &&
        json &&
        'sentence' in json &&
        typeof (json as { sentence: unknown }).sentence === 'string'
      ) {
        setAiSentence((json as { sentence: string }).sentence);
      }
    } catch (err) {
      console.error('[risk-checkup] ai sentence failed', err);
      setAiError('網路錯誤，請稍後再試');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleShare() {
    setShareError('');
    setShareUrl('');
    try {
      const res = await fetch('/api/risk-checkup/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          weights: portfolioWeights,
          metrics,
          concentration,
        }),
      });
      const json: unknown = await res.json();
      if (!res.ok) {
        setShareError('產生分享連結失敗');
        return;
      }
      if (
        typeof json === 'object' &&
        json &&
        'token' in json &&
        typeof (json as { token: unknown }).token === 'string'
      ) {
        const token = (json as { token: string }).token;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${origin}/risk-checkup/shared/${token}`;
        setShareUrl(url);
        try {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            setToast('連結已複製');
            setTimeout(() => setToast(''), 1800);
          }
        } catch {
          // ignore copy failures
        }
      }
    } catch (err) {
      console.error('[risk-checkup] share failed', err);
      setShareError('網路錯誤，請稍後再試');
    }
  }

  const empty = holdings.length === 0;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-5 md:space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-primary-500" />
              投資組合風險體檢
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {userId
                ? '依你目前的持股快速估算集中度與波動。教學用，不構成投資建議。'
                : '訪客模式：使用本機紀錄的持倉。登入後可同步雲端資料。'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRecompute}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              data-testid="recompute-btn"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              重新計算
            </button>
            <button
              onClick={handleShare}
              disabled={empty}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
              data-testid="share-btn"
            >
              <Share2 className="w-4 h-4" />
              分享給朋友
            </button>
          </div>
        </header>

        {empty ? (
          <div
            className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200"
            data-testid="empty-state"
          >
            <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="mt-3 text-base font-semibold text-gray-700">尚無持倉資料</p>
            <p className="mt-1 text-sm text-gray-500">
              先去 <a href="/trade" className="text-primary-500 hover:underline">模擬交易</a> 買幾筆，再回來體檢。
            </p>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <section
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
              data-testid="kpi-cards"
            >
              <KpiCard label="總市值" value={formatMoney(summary.totalValue)} />
              <KpiCard label="總成本" value={formatMoney(summary.totalCost)} />
              <KpiCard
                label="未實現損益"
                value={formatMoney(summary.pnl)}
                positive={summary.pnl > 0}
                negative={summary.pnl < 0}
              />
              <KpiCard
                label="報酬率"
                value={formatPct(summary.pnlPct)}
                positive={summary.pnlPct > 0}
                negative={summary.pnlPct < 0}
              />
            </section>

            {/* Concentration warning */}
            {verdict.level !== 'safe' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 rounded-2xl p-4 border ${
                  verdict.level === 'danger'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
                data-testid="concentration-warning"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">{verdict.message}</p>
                  <p className="mt-0.5 text-xs opacity-80">
                    一般建議單一標的權重 ≤ 25%。集中持倉短期可能加速賺賠，但抗風險較弱。
                  </p>
                </div>
              </motion.div>
            )}

            {/* Donut + risk metrics */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">持倉權重</h2>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioWeights.map((w) => ({ name: w.name, value: w.value }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={84}
                        paddingAngle={2}
                      >
                        {portfolioWeights.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => formatMoney(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {portfolioWeights.slice(0, 5).map((w, i) => (
                    <li key={w.symbol} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="truncate text-gray-700">{w.name}</span>
                      </span>
                      <span className="tabular-nums text-gray-500 text-xs">
                        {w.weight.toFixed(1)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4"
                data-testid="risk-tiles"
              >
                <RiskTile
                  label="VaR 95%"
                  value={formatRiskPct(metrics.var95)}
                  hint="估計 5% 機率單期損失上限，越低越穩"
                  icon={<TrendingDown className="w-4 h-4" />}
                />
                <RiskTile
                  label="夏普值"
                  value={metrics.sharpe.toFixed(2)}
                  hint="風險調整後報酬，> 1 算不錯"
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <RiskTile
                  label="最大回撤"
                  value={formatRiskPct(metrics.maxDrawdown)}
                  hint="歷史峰值跌到谷底的最大幅度"
                  icon={<TrendingDown className="w-4 h-4" />}
                />
                <RiskTile
                  label="年化波動率"
                  value={formatRiskPct(metrics.annualizedVol)}
                  hint="報酬離散度，越低代表越平穩"
                  icon={<TrendingUp className="w-4 h-4" />}
                />
              </div>
            </section>

            {/* AI sentence */}
            <section className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-4 md:p-5 border border-primary-100">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-primary-700">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-sm font-semibold">AI 一句話建議</h2>
                </div>
                <button
                  onClick={handleAiSentence}
                  disabled={aiLoading}
                  className="px-3.5 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 flex items-center gap-1.5"
                  data-testid="ai-btn"
                >
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {aiLoading ? '產生中...' : '請 AI 看一眼'}
                </button>
              </div>
              {aiSentence && (
                <p
                  className="mt-3 text-sm md:text-base text-gray-700 leading-relaxed"
                  data-testid="ai-sentence"
                >
                  {aiSentence}
                </p>
              )}
              {aiError && (
                <p className="mt-3 text-sm text-rose-600">{aiError}</p>
              )}
              <p className="mt-2 text-[11px] text-gray-400">
                教學用，不構成投資建議。每用戶 5 分鐘限 1 次。
              </p>
            </section>

            {/* Share output */}
            {(shareUrl || shareError) && (
              <section className="bg-white rounded-2xl p-4 border border-gray-100 text-sm">
                {shareUrl && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-500">分享連結：</span>
                    <code className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-700 break-all">
                      {shareUrl}
                    </code>
                  </div>
                )}
                {shareError && <p className="text-rose-600">{shareError}</p>}
              </section>
            )}
          </>
        )}

        {toast && (
          <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg z-50">
            {toast}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
