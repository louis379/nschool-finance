'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus, Bookmark, X, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';

type NewsTab = 'all' | 'tw' | 'us' | 'crypto' | 'expert';
type Impact = 'positive' | 'negative' | 'neutral';

type NewsItem = {
  id: string;
  title: string;
  category: NewsTab;
  source: string;
  time: string;
  summary: string;
  body?: string;
  impact: Impact;
  readingTime: number;
  url?: string;
};

const fallbackNews: NewsItem[] = [
  {
    id: 'f1', category: 'expert', impact: 'neutral',
    title: '【新手必讀】什麼是 ETF？為什麼適合投資入門者？',
    source: 'nSchool 專欄', time: '專欄', readingTime: 8,
    summary: 'ETF 是一種追蹤指數的基金，具有分散風險、費用低、交易靈活的優勢，是理財入門的絕佳工具。',
    body: `ETF（Exchange-Traded Fund）是一種在股票市場上交易的基金，追蹤特定指數的表現。\n\n主要優勢：分散風險、費用低廉、交易靈活、透明度高。\n\n適合新手的 ETF：台股 0050（元大台灣50）、00878（國泰永續高股息）；美股 VTI、VOO。`,
  },
  {
    id: 'f2', category: 'expert', impact: 'neutral',
    title: '半導體產業鏈深度分析：誰是下一個 AI 受惠者？',
    source: 'nSchool 專欄', time: '專欄', readingTime: 12,
    summary: '隨著 AI 產業快速發展，從晶片設計、製造到封測，整個半導體產業鏈都將受惠。',
    body: `AI 浪潮帶動了整個半導體產業鏈的蓬勃發展。晶片設計（NVIDIA、AMD）、晶圓代工（台積電）、封裝測試（日月光）、HBM 記憶體（SK Hynix、Micron）都是受惠者。`,
  },
];

const tabConfig: Record<NewsTab, { label: string; dotColor: string }> = {
  all:    { label: '全部',   dotColor: 'bg-gray-400' },
  tw:     { label: '台股',   dotColor: 'bg-primary-500' },
  us:     { label: '美股',   dotColor: 'bg-blue-500' },
  crypto: { label: '加密貨幣', dotColor: 'bg-amber-500' },
  expert: { label: '大師觀點', dotColor: 'bg-pink-500' },
};

const categoryBadge: Partial<Record<NewsTab, string>> = {
  tw:     'bg-primary-100 text-primary-700',
  us:     'bg-blue-100 text-blue-700',
  crypto: 'bg-amber-100 text-amber-700',
  expert: 'bg-pink-100 text-pink-700',
};

const impactConfig: Record<Impact, { label: string; color: string; icon: typeof TrendingUp | null }> = {
  positive: { label: '利多', color: 'text-up bg-up/10',   icon: TrendingUp },
  negative: { label: '利空', color: 'text-down bg-down/10', icon: TrendingDown },
  neutral:  { label: '中性', color: 'text-gray-500 bg-gray-100', icon: Minus },
};

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<NewsTab>('all');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          // Merge API news with expert columns
          setNews([...json.data, ...fallbackNews]);
        }
      }
    } catch {
      // Keep fallback data
    } finally {
      setLoading(false);
    }
  }

  const filtered = activeTab === 'all' ? news : news.filter((n) => n.category === activeTab);

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const countForTab = (tab: NewsTab) =>
    tab === 'all' ? news.length : news.filter((n) => n.category === tab).length;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">財經資訊</h1>
            <p className="text-sm text-gray-400 mt-1">掌握市場脈動，做更好的投資決策</p>
          </div>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1.5 rounded-2xl mb-6 overflow-x-auto shadow-sm">
          {(Object.keys(tabConfig) as NewsTab[]).map((tab) => {
            const count = countForTab(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tabConfig[tab].label}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading && news.length <= fallbackNews.length ? (
          <div className="bg-white rounded-[var(--radius-card)] p-12 text-center">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">載入最新資訊...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-[var(--radius-card)] p-12 text-center">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-gray-500 font-medium">目前沒有相關文章</p>
            <p className="text-gray-400 text-sm mt-1">請稍後再查看</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, idx) => {
              const impactCfg = impactConfig[item.impact];
              const ImpactIcon = impactCfg.icon;
              const isSaved = saved.has(item.id);
              const isFeatured = idx === 0 && activeTab === 'all';

              return (
                <article
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  className={`bg-white rounded-[var(--radius-card)] p-5 hover:shadow-md transition-all cursor-pointer group ${isFeatured ? 'border-l-4 border-primary-400' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${categoryBadge[item.category] ?? 'bg-gray-100 text-gray-500'}`}>
                          {tabConfig[item.category]?.label}
                        </span>
                        {item.impact !== 'neutral' && ImpactIcon && (
                          <span className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${impactCfg.color}`}>
                            <ImpactIcon className="w-3 h-3" />{impactCfg.label}
                          </span>
                        )}
                        {isFeatured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500 text-white font-semibold">置頂</span>
                        )}
                      </div>

                      <h3 className={`font-semibold text-gray-800 mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors ${isFeatured ? 'text-base' : 'text-sm'}`}>
                        {item.title}
                      </h3>

                      {item.summary && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">{item.summary}</p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="font-medium text-gray-500">{item.source}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                        <span>{item.readingTime} 分鐘閱讀</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0 ml-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSaved(item.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-primary-500 bg-primary-50' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'}`}
                        aria-label={isSaved ? '取消收藏' : '收藏文章'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary-500' : ''}`} />
                      </button>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-gray-200 hover:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm modal-backdrop" onClick={() => setSelectedArticle(null)} />
          <div className="relative bg-white rounded-b-3xl md:rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col modal-content">
            {/* Modal Header */}
            <div className="flex items-center gap-3 p-5 border-b border-gray-100 shrink-0">
              <button onClick={() => setSelectedArticle(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${categoryBadge[selectedArticle.category] ?? 'bg-gray-100 text-gray-500'}`}>
                    {tabConfig[selectedArticle.category]?.label}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedArticle.time}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleSaved(selectedArticle.id); }}
                className={`p-2 rounded-xl transition-colors shrink-0 ${saved.has(selectedArticle.id) ? 'text-primary-500 bg-primary-50' : 'text-gray-300 hover:bg-gray-100'}`}
              >
                <Bookmark className={`w-5 h-5 ${saved.has(selectedArticle.id) ? 'fill-primary-500' : ''}`} />
              </button>
              <button onClick={() => setSelectedArticle(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Article Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-3 leading-snug">{selectedArticle.title}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span className="font-semibold text-gray-600">{selectedArticle.source}</span>
                <span>{selectedArticle.readingTime} 分鐘閱讀</span>
              </div>

              {selectedArticle.summary && (
                <div className={`flex items-start gap-2 p-3 rounded-xl mb-5 ${
                  selectedArticle.impact === 'positive' ? 'bg-up/10' :
                  selectedArticle.impact === 'negative' ? 'bg-down/10' : 'bg-gray-50'
                }`}>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedArticle.summary}</p>
                </div>
              )}

              {selectedArticle.body ? (
                <div className="prose prose-sm text-gray-700 leading-relaxed space-y-3">
                  {selectedArticle.body.split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed">
                      {para.startsWith('**') ? (
                        <strong className="text-gray-800 font-semibold">{para.replace(/\*\*/g, '')}</strong>
                      ) : para}
                    </p>
                  ))}
                </div>
              ) : selectedArticle.url ? (
                <div className="text-center py-6">
                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    閱讀完整文章
                  </a>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 shrink-0">
              <p className="text-xs text-gray-400 text-center">本文內容僅供參考，不構成投資建議</p>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
