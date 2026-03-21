'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus, Bookmark } from 'lucide-react';

type NewsTab = 'all' | 'tw' | 'us' | 'crypto' | 'expert';
type Impact = 'positive' | 'negative' | 'neutral';

type NewsItem = {
  id: string;
  title: string;
  category: NewsTab;
  source: string;
  time: string;
  summary: string;
  impact: Impact;
  readingTime: number;
};

const mockNews: NewsItem[] = [
  {
    id: '1', category: 'tw', impact: 'positive',
    title: '台積電法說會釋出正面展望，外資連續買超',
    source: '經濟日報', time: '2 小時前', readingTime: 3,
    summary: '台積電第一季法說會釋出樂觀展望，預期 AI 需求持續強勁，CoWoS 封裝產能擴充計畫超出市場預期。',
  },
  {
    id: '2', category: 'us', impact: 'positive',
    title: 'Fed 暫緩升息，美股三大指數全面翻揚',
    source: '路透社', time: '3 小時前', readingTime: 4,
    summary: '聯準會宣布維持利率不變，市場預期下半年可能降息 2-3 碼，科技股領漲，那斯達克上漲逾 1%。',
  },
  {
    id: '3', category: 'crypto', impact: 'positive',
    title: 'Bitcoin 突破 87,000 美元，現貨 ETF 資金持續流入',
    source: 'CoinDesk', time: '5 小時前', readingTime: 3,
    summary: '比特幣突破 87,000 美元關卡，現貨 ETF 單日吸金逾 5 億美元，機構投資者持續增持部位。',
  },
  {
    id: '4', category: 'expert', impact: 'neutral',
    title: '【新手必讀】什麼是 ETF？為什麼適合投資入門者？',
    source: 'nSchool 專欄', time: '1 天前', readingTime: 8,
    summary: 'ETF 是一種追蹤指數的基金，具有分散風險、費用低、交易靈活的優勢，是理財入門的絕佳工具。',
  },
  {
    id: '5', category: 'expert', impact: 'neutral',
    title: '半導體產業鏈深度分析：誰是下一個 AI 受惠者？',
    source: 'nSchool 專欄', time: '2 天前', readingTime: 12,
    summary: '隨著 AI 產業快速發展，從晶片設計、製造到封測，整個半導體產業鏈都將受惠，本文深度解析各環節。',
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

  const filtered = activeTab === 'all' ? mockNews : mockNews.filter((n) => n.category === activeTab);

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const countForTab = (tab: NewsTab) =>
    tab === 'all' ? mockNews.length : mockNews.filter((n) => n.category === tab).length;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">財經資訊</h1>
          <p className="text-sm text-gray-400 mt-1">掌握市場脈動，做更好的投資決策</p>
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
                  activeTab === tab
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tabConfig[tab].label}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-[var(--radius-card)] p-12 text-center">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-gray-500 font-medium">目前沒有相關文章</p>
            <p className="text-gray-400 text-sm mt-1">請稍後再查看</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((news, idx) => {
              const impactCfg = impactConfig[news.impact];
              const ImpactIcon = impactCfg.icon;
              const isSaved = saved.has(news.id);
              const isFeatured = idx === 0 && activeTab === 'all';

              return (
                <article
                  key={news.id}
                  className={`bg-white rounded-[var(--radius-card)] p-5 hover:shadow-md transition-all cursor-pointer group ${
                    isFeatured ? 'border-l-4 border-primary-400' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Badges row */}
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${categoryBadge[news.category] ?? 'bg-gray-100 text-gray-500'}`}>
                          {tabConfig[news.category]?.label}
                        </span>
                        {news.impact !== 'neutral' && ImpactIcon && (
                          <span className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${impactCfg.color}`}>
                            <ImpactIcon className="w-3 h-3" />
                            {impactCfg.label}
                          </span>
                        )}
                        {isFeatured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500 text-white font-semibold">
                            置頂
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={`font-semibold text-gray-800 mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors ${
                        isFeatured ? 'text-base' : 'text-sm'
                      }`}>
                        {news.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                        {news.summary}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="font-medium text-gray-500">{news.source}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {news.time}
                        </span>
                        <span>{news.readingTime} 分鐘閱讀</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-2 shrink-0 ml-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSaved(news.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved ? 'text-primary-500 bg-primary-50' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'
                        }`}
                        aria-label={isSaved ? '取消收藏' : '收藏文章'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary-500' : ''}`} />
                      </button>
                      <ExternalLink className="w-4 h-4 text-gray-200 group-hover:text-gray-400 transition-colors" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
