'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  TrendingUp, TrendingDown, Search, Star, X,
  Wallet, BarChart3, ArrowUpRight, Clock,
} from 'lucide-react';

type MarketTab = 'tw' | 'us' | 'crypto';

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
};

const mockStocks: Record<MarketTab, Stock[]> = {
  tw: [
    { symbol: '2330', name: '台積電',    price: 1025,   change: 15,    changePercent: 1.48,  volume: 28543 },
    { symbol: '2317', name: '鴻海',      price: 178.5,  change: -2.5,  changePercent: -1.38, volume: 45621 },
    { symbol: '2454', name: '聯發科',    price: 1580,   change: 30,    changePercent: 1.94,  volume: 8745 },
    { symbol: '0050', name: '元大台灣50', price: 185.3,  change: 1.2,   changePercent: 0.65,  volume: 12356 },
    { symbol: '2603', name: '長榮',      price: 198,    change: -5,    changePercent: -2.46, volume: 67890 },
    { symbol: '2881', name: '富邦金',    price: 89.5,   change: 0.8,   changePercent: 0.90,  volume: 34567 },
  ],
  us: [
    { symbol: 'AAPL',  name: 'Apple',    price: 178.72, change: 2.34,  changePercent: 1.33,  volume: 52341 },
    { symbol: 'MSFT',  name: 'Microsoft',price: 425.52, change: -3.21, changePercent: -0.75, volume: 23456 },
    { symbol: 'NVDA',  name: 'NVIDIA',   price: 875.28, change: 18.45, changePercent: 2.15,  volume: 89012 },
    { symbol: 'TSLA',  name: 'Tesla',    price: 245.67, change: -8.9,  changePercent: -3.50, volume: 67890 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 165.34, change: 1.56,  changePercent: 0.95,  volume: 15678 },
  ],
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin',  price: 87250.5, change: 1250.3, changePercent: 1.45,  volume: 245678 },
    { symbol: 'ETH', name: 'Ethereum', price: 3420.8,  change: -45.2,  changePercent: -1.30, volume: 123456 },
    { symbol: 'SOL', name: 'Solana',   price: 185.6,   change: 8.4,    changePercent: 4.74,  volume: 89012 },
    { symbol: 'BNB', name: 'BNB',      price: 645.3,   change: 12.7,   changePercent: 2.01,  volume: 34567 },
  ],
};

const tabLabels: Record<MarketTab, string> = { tw: '台股', us: '美股', crypto: '加密貨幣' };

const portfolioStats = [
  { label: '總資產',    value: 'NT$ 1,035,200', sub: '+3.52%',  isUp: true,  icon: Wallet },
  { label: '已投入',    value: 'NT$ 780,000',   sub: '佔 75%',  isUp: true,  icon: BarChart3 },
  { label: '未實現損益', value: '+NT$ 35,200',   sub: '+4.51%',  isUp: true,  icon: TrendingUp },
  { label: '今日損益',  value: '+NT$ 5,800',    sub: '+0.56%',  isUp: true,  icon: ArrowUpRight },
];

const holdings = [
  { symbol: '2330', name: '台積電', qty: 200, avgCost: 980,   currentPrice: 1025,  pnlPercent: 4.59 },
  { symbol: '0050', name: '元大台灣50', qty: 1000, avgCost: 178, currentPrice: 185.3, pnlPercent: 4.10 },
  { symbol: 'NVDA', name: 'NVIDIA',   qty: 10,  avgCost: 780,   currentPrice: 875.28, pnlPercent: 12.22 },
];

type TradeModalState = { stock: Stock; side: 'buy' | 'sell' } | null;

export default function TradePage() {
  const [activeTab, setActiveTab] = useState<MarketTab>('tw');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2330', 'NVDA']));
  const [tradeModal, setTradeModal] = useState<TradeModalState>(null);
  const [tradeQty, setTradeQty] = useState('1');

  const stocks = mockStocks[activeTab].filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function toggleFavorite(symbol: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(symbol) ? next.delete(symbol) : next.add(symbol);
      return next;
    });
  }

  function openModal(stock: Stock, side: 'buy' | 'sell') {
    setTradeQty('1');
    setTradeModal({ stock, side });
  }

  const totalCost = tradeModal
    ? (parseFloat(tradeQty) || 0) * tradeModal.stock.price
    : 0;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">模擬交易</h1>
            <p className="text-sm text-gray-400 mt-0.5">以虛擬資金練習投資，無風險體驗市場</p>
          </div>
          <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl">
            <Wallet className="w-4 h-4 text-primary-400" />
            <div>
              <p className="text-[10px] text-primary-400 leading-none">可用資金</p>
              <p className="text-sm font-bold text-primary-600 leading-snug">NT$ 220,000</p>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {portfolioStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-[var(--radius-card)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    stat.isUp ? 'bg-up/10' : 'bg-down/10'
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${stat.isUp ? 'text-up' : 'text-down'}`} />
                  </div>
                </div>
                <p className="text-base font-bold text-gray-800 leading-tight">{stat.value}</p>
                {stat.sub && (
                  <span className={`text-xs font-medium mt-0.5 block ${stat.isUp ? 'text-up' : 'text-down'}`}>
                    {stat.sub}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* My Holdings */}
        <div className="bg-white rounded-[var(--radius-card)] p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">我的持倉</h2>
          <div className="space-y-2">
            {holdings.map((h) => {
              const pnlAmt = (h.currentPrice - h.avgCost) * h.qty;
              const isUp = pnlAmt >= 0;
              return (
                <div key={h.symbol} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary-600">{h.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{h.symbol}</p>
                      <p className="text-xs text-gray-400">{h.name} · {h.qty} 股</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800 tabular-nums">
                      NT$ {(h.currentPrice * h.qty).toLocaleString()}
                    </p>
                    <p className={`text-xs font-semibold tabular-nums ${isUp ? 'text-up' : 'text-down'}`}>
                      {isUp ? '+' : ''}NT$ {Math.round(pnlAmt).toLocaleString()} ({isUp ? '+' : ''}{h.pnlPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Tabs & Search */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {(Object.keys(tabLabels) as MarketTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋代號或名稱..."
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 w-48 transition-all"
              />
            </div>
          </div>

          {/* Mobile Card List (sm only) */}
          <div className="md:hidden space-y-2">
            {stocks.map((stock) => {
              const isUp = stock.change >= 0;
              const isFav = favorites.has(stock.symbol);
              return (
                <div key={stock.symbol} className="flex items-center justify-between py-3 px-1 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => toggleFavorite(stock.symbol)}
                      className="p-1 shrink-0"
                      aria-label={isFav ? '移除追蹤' : '加入追蹤'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800">{stock.symbol}</p>
                      <p className="text-xs text-gray-400 truncate">{stock.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800 tabular-nums">{stock.price.toLocaleString()}</p>
                      <div className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-up' : 'text-down'}`}>
                        {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openModal(stock, 'buy')} className="min-h-[36px] px-2.5 rounded-lg bg-up/10 text-up text-xs font-bold hover:bg-up/20 transition-colors">買</button>
                      <button onClick={() => openModal(stock, 'sell')} className="min-h-[36px] px-2.5 rounded-lg bg-down/10 text-down text-xs font-bold hover:bg-down/20 transition-colors">賣</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 py-3 px-2">代號 / 名稱</th>
                  <th className="text-right text-xs font-semibold text-gray-400 py-3 px-2">現價</th>
                  <th className="text-right text-xs font-semibold text-gray-400 py-3 px-2">漲跌幅</th>
                  <th className="text-right text-xs font-semibold text-gray-400 py-3 px-2">成交量</th>
                  <th className="text-center text-xs font-semibold text-gray-400 py-3 px-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const isUp = stock.change >= 0;
                  const isFav = favorites.has(stock.symbol);
                  return (
                    <tr key={stock.symbol} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors group">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => toggleFavorite(stock.symbol)}
                            className="transition-transform hover:scale-125"
                            aria-label={isFav ? '移除追蹤' : '加入追蹤'}
                          >
                            <Star
                              className={`w-4 h-4 transition-colors ${
                                isFav ? 'text-amber-400 fill-amber-400' : 'text-gray-200 group-hover:text-gray-300'
                              }`}
                            />
                          </button>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{stock.symbol}</p>
                            <p className="text-xs text-gray-400">{stock.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2">
                        <span className="text-sm font-semibold text-gray-800 tabular-nums">
                          {stock.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right py-3 px-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          isUp ? 'bg-up/10 text-up' : 'bg-down/10 text-down'
                        }`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 hidden md:table-cell">
                        <span className="text-xs text-gray-400 tabular-nums">{stock.volume.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openModal(stock, 'buy')}
                            className="px-3 py-1.5 rounded-lg bg-up/10 text-up text-xs font-semibold hover:bg-up/20 transition-colors"
                          >
                            買入
                          </button>
                          <button
                            onClick={() => openModal(stock, 'sell')}
                            className="px-3 py-1.5 rounded-lg bg-down/10 text-down text-xs font-semibold hover:bg-down/20 transition-colors"
                          >
                            賣出
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {tradeModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setTradeModal(null)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {tradeModal.side === 'buy' ? '買入' : '賣出'} {tradeModal.stock.symbol}
                </h3>
                <p className="text-sm text-gray-400">{tradeModal.stock.name}</p>
              </div>
              <button
                onClick={() => setTradeModal(null)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Current Price */}
            <div className={`flex items-center justify-between p-3 rounded-xl mb-4 ${
              tradeModal.stock.change >= 0 ? 'bg-up/10' : 'bg-down/10'
            }`}>
              <span className="text-sm text-gray-500">目前價格</span>
              <span className={`text-lg font-bold tabular-nums ${
                tradeModal.stock.change >= 0 ? 'text-up' : 'text-down'
              }`}>
                {tradeModal.stock.price.toLocaleString()}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 block mb-2">
                {tradeModal.side === 'buy' ? '買入' : '賣出'}數量（股/張）
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTradeQty((prev) => String(Math.max(1, parseInt(prev) - 1)))}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-medium transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={tradeQty}
                  onChange={(e) => setTradeQty(e.target.value)}
                  min="1"
                  className="flex-1 text-center text-xl font-bold text-gray-800 border-2 border-gray-100 focus:border-primary-300 rounded-xl py-2 outline-none transition-colors"
                />
                <button
                  onClick={() => setTradeQty((prev) => String(parseInt(prev) + 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-medium transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Cost estimate */}
            <div className="bg-gray-50 rounded-xl p-3 mb-5 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">預估金額</span>
                <span className="font-semibold text-gray-800 tabular-nums">
                  NT$ {totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 交易手續費（0.1425%）
                </span>
                <span className="text-gray-500 tabular-nums">
                  NT$ {(totalCost * 0.001425).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Confirm */}
            <button
              onClick={() => setTradeModal(null)}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all active:scale-95 ${
                tradeModal.side === 'buy'
                  ? 'bg-up hover:bg-green-600'
                  : 'bg-down hover:bg-red-600'
              }`}
            >
              確認{tradeModal.side === 'buy' ? '買入' : '賣出'}
            </button>
            <button
              onClick={() => setTradeModal(null)}
              className="w-full mt-2 py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
