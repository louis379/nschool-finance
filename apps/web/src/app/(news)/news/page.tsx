'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Clock, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

type NewsTab = 'all' | 'tw' | 'us' | 'crypto' | 'expert';

const mockNews = [
  {
    id: '1', title: '台積電法說會釋出正面展望，外資連續買超', category: 'tw',
    source: '經濟日報', time: '2 小時前', image: null,
    summary: '台積電第一季法說會釋出樂觀展望，預期 AI 需求持續強勁...',
    impact: 'positive' as const,
  },
  {
    id: '2', title: 'Fed 暫緩升息，美股三大指數齊揚', category: 'us',
    source: '路透社', time: '3 小時前', image: null,
    summary: '聯準會宣布維持利率不變，市場預期下半年可能降息...',
    impact: 'positive' as const,
  },
  {
    id: '3', title: 'Bitcoin 突破 87,000 美元，ETF 資金持續流入', category: 'crypto',
    source: 'CoinDesk', time: '5 小時前', image: null,
    summary: '比特幣突破 87,000 美元關卡，現貨 ETF 持續獲得資金流入...',
    impact: 'positive' as const,
  },
  {
    id: '4', title: '新手必讀：什麼是 ETF？為什麼適合投資新手？', category: 'expert',
    source: 'nSchool 專欄', time: '1 天前', image: null,
    summary: 'ETF 是一種追蹤指數的基金，具有分散風險、費用低的優勢...',
    impact: 'neutral' as const,
  },
  {
    id: '5', title: '半導體產業鏈分析：誰是下一個受惠者？', category: 'expert',
    source: 'nSchool 專欄', time: '2 天前', image: null,
    summary: '隨著 AI 產業快速發展，半導體產業鏈上下游都將受惠...',
    impact: 'neutral' as const,
  },
];

const tabLabels: Record<NewsTab, string> = {
  all: '全部', tw: '台股', us: '美股', crypto: '加密貨幣', expert: '大師觀點',
};

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<NewsTab>('all');

  const filtered = activeTab === 'all'
    ? mockNews
    : mockNews.filter((n) => n.category === activeTab);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">財經資訊</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1 rounded-xl mb-6 overflow-x-auto">
          {(Object.keys(tabLabels) as NewsTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* News List */}
        <div className="space-y-4">
          {filtered.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-[var(--radius-card)] p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      news.category === 'expert'
                        ? 'bg-primary-100 text-primary-600'
                        : news.category === 'tw'
                        ? 'bg-blue-100 text-blue-600'
                        : news.category === 'us'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {tabLabels[news.category as NewsTab]}
                    </span>
                    {news.impact !== 'neutral' && (
                      <span className={`flex items-center gap-0.5 text-[10px] ${
                        news.impact === 'positive' ? 'text-up' : 'text-down'
                      }`}>
                        {news.impact === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {news.impact === 'positive' ? '利多' : '利空'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {news.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{news.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {news.time}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
