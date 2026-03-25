'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import AssetOverview from '@/components/dashboard/AssetOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import { Sparkles, CalendarDays, X, Loader2 } from 'lucide-react';

// Lazy load below-the-fold components
const RecentTransactions = dynamic(() => import('@/components/dashboard/RecentTransactions'), { ssr: false });
const MarketOverview = dynamic(() => import('@/components/dashboard/MarketOverview'), { ssr: false });
const FinancialHealth = dynamic(() => import('@/components/dashboard/FinancialHealth'), { ssr: false });

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return { text: '夜深了', sub: '注意休息，財務管理明天繼續 💪' };
  if (hour < 12) return { text: '早安', sub: '美好的一天從了解財務開始 ☀️' };
  if (hour < 18) return { text: '午安', sub: '來看看今天的財務狀況吧 🌤️' };
  return { text: '晚安', sub: '回顧今天的收支，做好記錄 🌆' };
}

function getFormattedDate() {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
}

type AiResult = {
  summary: string;
  analysis: string;
  suggestions: string[];
  risk_note: string;
  score: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const greeting = getGreeting();
  const today = getFormattedDate();
  const [displayName, setDisplayName] = useState('投資新手');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiError, setAiError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Redirect to onboarding if not completed
    const onboarded = localStorage.getItem('nschool-onboarded');
    if (!onboarded) {
      router.replace('/onboarding');
      return;
    }

    try {
      const raw = localStorage.getItem('nschool-profile');
      if (raw) {
        const profile = JSON.parse(raw);
        if (profile.displayName) setDisplayName(profile.displayName);
      }
    } catch {}
    setReady(true);
  }, [router]);

  if (!ready) return null;

  async function runAiAnalysis() {
    setShowAiModal(true);
    setAiLoading(true);
    setAiError('');
    setAiResult(null);

    try {
      // Gather financial data from localStorage
      const txRaw = localStorage.getItem('nschool-transactions');
      const accRaw = localStorage.getItem('nschool-accounts');
      const profileRaw = localStorage.getItem('nschool-profile');

      const txs = txRaw ? JSON.parse(txRaw) : [];
      const accs = accRaw ? JSON.parse(accRaw) : [];
      const profile = profileRaw ? JSON.parse(profileRaw) : {};

      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const monthlyTxs = txs.filter((t: { date: string }) => t.date.startsWith(thisMonth));

      const income = monthlyTxs.filter((t: { amount: number }) => t.amount > 0).reduce((s: number, t: { amount: number }) => s + t.amount, 0);
      const expense = monthlyTxs.filter((t: { amount: number }) => t.amount < 0).reduce((s: number, t: { amount: number }) => s + Math.abs(t.amount), 0);
      const totalAssets = accs.reduce((s: number, a: { balance: number }) => s + a.balance, 0);

      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'financial_health',
          data: {
            income,
            expense,
            totalAssets,
            totalDebt: 0,
            emergencyFund: totalAssets * 0.3,
            riskProfile: profile.riskType || '穩健型',
          },
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');

      const json = await res.json();
      if (json.success && json.data) {
        setAiResult(json.data);
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      setAiError('AI 分析暫時無法使用，請稍後再試');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {greeting.text}，{displayName}！
            </h1>
            <p className="text-sm text-gray-400 mt-1">{greeting.sub}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{today}</span>
            </div>
          </div>
          <button
            onClick={runAiAnalysis}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl text-sm font-medium transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            AI 財務分析
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <AssetOverview />
            <QuickActions />
            <RecentTransactions />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <FinancialHealth />
            <MarketOverview />
          </div>
        </div>

        {/* Mobile AI button */}
        <button
          onClick={runAiAnalysis}
          className="md:hidden fixed bottom-20 right-4 z-30 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* AI Analysis Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm modal-backdrop" onClick={() => setShowAiModal(false)} />
          <div className="relative bg-white rounded-b-3xl md:rounded-2xl w-full max-w-lg shadow-2xl max-h-[85vh] overflow-hidden flex flex-col modal-content">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">AI 財務分析</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {aiLoading ? (
                <div className="py-16 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">AI 正在分析你的財務狀況...</p>
                    <p className="text-xs text-gray-400 mt-1">根據你的收支和資產數據生成建議</p>
                  </div>
                </div>
              ) : aiError ? (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-3">🤖</p>
                  <p className="text-gray-500 font-medium">{aiError}</p>
                  <button
                    onClick={runAiAnalysis}
                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    重新分析
                  </button>
                </div>
              ) : aiResult ? (
                <div className="space-y-5">
                  {/* Score */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-2xl font-bold text-primary-600">{aiResult.score}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800">{aiResult.summary}</p>
                      <p className="text-xs text-gray-500 mt-0.5">財務健康評分 / 100</p>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">分析結果</h4>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{aiResult.analysis}</p>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">建議</h4>
                    <div className="space-y-2">
                      {aiResult.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-primary-50/50 rounded-xl">
                          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-600">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Note */}
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs text-amber-700 leading-relaxed">⚠️ {aiResult.risk_note}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
