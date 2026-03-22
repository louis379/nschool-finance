'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus, Bookmark, X, ArrowLeft } from 'lucide-react';

type NewsTab = 'all' | 'tw' | 'us' | 'crypto' | 'expert';
type Impact = 'positive' | 'negative' | 'neutral';

type NewsItem = {
  id: string;
  title: string;
  category: NewsTab;
  source: string;
  time: string;
  summary: string;
  body: string;
  impact: Impact;
  readingTime: number;
};

const mockNews: NewsItem[] = [
  {
    id: '1', category: 'tw', impact: 'positive',
    title: '台積電法說會釋出正面展望，外資連續買超',
    source: '經濟日報', time: '2 小時前', readingTime: 3,
    summary: '台積電第一季法說會釋出樂觀展望，預期 AI 需求持續強勁，CoWoS 封裝產能擴充計畫超出市場預期。',
    body: `台積電（2330）今日舉行第一季法說會，執行長魏哲家表示，人工智慧（AI）相關需求持續強勁，預期全年營收將優於年初展望。

CoWoS 先進封裝產能方面，台積電宣布將大幅擴充，計畫超出市場預期，外資法人對此反應正面，連續第三個交易日淨買超台積電股票。

魏哲家強調，2nm 製程進展順利，預計 2025 年下半年量產，多家 AI 晶片廠商已確認採用。台積電股價今日收盤上漲 1.48%，收報 1,025 元。

分析師指出，台積電在 AI 晶片製造的壟斷地位持續鞏固，長期投資價值仍佳。`,
  },
  {
    id: '2', category: 'us', impact: 'positive',
    title: 'Fed 暫緩升息，美股三大指數全面翻揚',
    source: '路透社', time: '3 小時前', readingTime: 4,
    summary: '聯準會宣布維持利率不變，市場預期下半年可能降息 2-3 碼，科技股領漲，那斯達克上漲逾 1%。',
    body: `美國聯準會（Fed）在最新一次聯邦公開市場委員會（FOMC）會議中，一致決定維持聯邦基金利率不變，區間維持在 5.25%～5.50%。

主席鮑威爾在記者會上表示，通膨數據持續朝 2% 目標收斂，但尚需更多數據確認。市場解讀此為「鴿派」訊號，預期年底前可能降息 2 至 3 碼。

美股三大指數全面大漲：道瓊工業指數上漲 0.8%、S&P 500 上漲 1.1%、那斯達克上漲 1.4%。科技股表現突出，NVIDIA 上漲 2.1%，Apple 上漲 1.3%。

債券市場方面，10 年期美國國債殖利率下滑至 4.2%，美元指數也同步走弱。`,
  },
  {
    id: '3', category: 'crypto', impact: 'positive',
    title: 'Bitcoin 突破 87,000 美元，現貨 ETF 資金持續流入',
    source: 'CoinDesk', time: '5 小時前', readingTime: 3,
    summary: '比特幣突破 87,000 美元關卡，現貨 ETF 單日吸金逾 5 億美元，機構投資者持續增持部位。',
    body: `比特幣（BTC）今日突破 87,000 美元重要關卡，24 小時漲幅達 1.45%，市值重回 1.7 兆美元以上。

根據 SoSoValue 數據，美國比特幣現貨 ETF 昨日合計淨流入超過 5 億美元，連續第 8 個交易日正流入。貝萊德的 IBIT 為最大贏家，單日吸金逾 3 億美元。

分析師認為，機構投資者通過 ETF 管道持續增持，加上即將到來的減半效應，比特幣多頭動能強勁。技術面上，突破 87,000 美元後，下一目標看向 90,000 美元。

以太坊（ETH）今日表現疲軟，微幅下跌 1.3%，報 3,420 美元。`,
  },
  {
    id: '4', category: 'expert', impact: 'neutral',
    title: '【新手必讀】什麼是 ETF？為什麼適合投資入門者？',
    source: 'nSchool 專欄', time: '1 天前', readingTime: 8,
    summary: 'ETF 是一種追蹤指數的基金，具有分散風險、費用低、交易靈活的優勢，是理財入門的絕佳工具。',
    body: `ETF（Exchange-Traded Fund，交易所買賣基金）是一種在股票市場上交易的基金，它追蹤特定指數、商品或一籃子資產的表現。

**ETF 的主要優勢：**

1. **分散風險**：一檔 ETF 可以包含數十甚至數百支股票，大幅降低單一股票的風險。

2. **費用低廉**：相比主動管理基金，ETF 的管理費用（內扣費率）通常僅 0.03%～0.5%，長期下來可節省大量成本。

3. **交易靈活**：ETF 和股票一樣可以在盤中隨時買賣，不像傳統基金需要等待收盤後以淨值申購。

4. **透明度高**：ETF 的持股組成每日公布，投資人清楚知道自己買了什麼。

**適合新手的 ETF：**
- 台股：0050（元大台灣50）、00878（國泰永續高股息）
- 美股：VTI（Vanguard 全美股票）、VOO（追蹤 S&P 500）

對於剛起步的投資人，建議從定期定額買入寬基 ETF 開始，培養投資習慣。`,
  },
  {
    id: '5', category: 'expert', impact: 'neutral',
    title: '半導體產業鏈深度分析：誰是下一個 AI 受惠者？',
    source: 'nSchool 專欄', time: '2 天前', readingTime: 12,
    summary: '隨著 AI 產業快速發展，從晶片設計、製造到封測，整個半導體產業鏈都將受惠，本文深度解析各環節。',
    body: `AI 浪潮帶動了整個半導體產業鏈的蓬勃發展。從晶片設計到封測，每個環節都有其投資機會。

**晶片設計（Fabless）：**
NVIDIA 是最直接的受益者，其 H100/H200 GPU 成為 AI 訓練的標準配備。AMD 也推出了競爭產品 MI300X，市佔率持續提升。

**晶圓代工：**
台積電以先進製程（3nm/2nm）主導 AI 晶片製造，護城河深厚。三星和英特爾雖積極追趕，但差距仍大。

**封裝測試：**
AI 晶片對先進封裝需求急增，CoWoS 和 SoIC 技術成為台積電新的成長動能。日月光（ASX）和力成也因此受惠。

**HBM 記憶體：**
AI 晶片需要大量高頻寬記憶體（HBM），SK Hynix 和美光（Micron）供不應求，三星追趕中。

**投資建議：** 分散布局半導體產業鏈，可考慮 SOXX（iShares 半導體 ETF）或台灣的 00891。`,
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
                  onClick={() => setSelectedArticle(news)}
                  className={`bg-white rounded-[var(--radius-card)] p-5 hover:shadow-md transition-all cursor-pointer group ${isFeatured ? 'border-l-4 border-primary-400' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${categoryBadge[news.category] ?? 'bg-gray-100 text-gray-500'}`}>
                          {tabConfig[news.category]?.label}
                        </span>
                        {news.impact !== 'neutral' && ImpactIcon && (
                          <span className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${impactCfg.color}`}>
                            <ImpactIcon className="w-3 h-3" />{impactCfg.label}
                          </span>
                        )}
                        {isFeatured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500 text-white font-semibold">置頂</span>
                        )}
                      </div>

                      <h3 className={`font-semibold text-gray-800 mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors ${isFeatured ? 'text-base' : 'text-sm'}`}>
                        {news.title}
                      </h3>

                      <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">{news.summary}</p>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="font-medium text-gray-500">{news.source}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {news.time}</span>
                        <span>{news.readingTime} 分鐘閱讀</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0 ml-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSaved(news.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-primary-500 bg-primary-50' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'}`}
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

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedArticle(null)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

              <div className={`flex items-start gap-2 p-3 rounded-xl mb-5 ${
                selectedArticle.impact === 'positive' ? 'bg-up/10' :
                selectedArticle.impact === 'negative' ? 'bg-down/10' : 'bg-gray-50'
              }`}>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedArticle.summary}</p>
              </div>

              <div className="prose prose-sm text-gray-700 leading-relaxed space-y-3">
                {selectedArticle.body.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">
                    {para.startsWith('**') ? (
                      <strong className="text-gray-800 font-semibold">{para.replace(/\*\*/g, '')}</strong>
                    ) : para}
                  </p>
                ))}
              </div>
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
