'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Eye, Star, TrendingUp, TrendingDown, Plus, X, Search } from 'lucide-react';
import Link from 'next/link';

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
};

const allStocks: Stock[] = [
  { symbol: '2330', name: '台積電',    price: 1025,   change: 15,    changePercent: 1.48,  market: '台股' },
  { symbol: '2317', name: '鴻海',      price: 178.5,  change: -2.5,  changePercent: -1.38, market: '台股' },
  { symbol: '2454', name: '聯發科',    price: 1580,   change: 30,    changePercent: 1.94,  market: '台股' },
  { symbol: '0050', name: '元大台灣50', price: 185.3,  change: 1.2,   changePercent: 0.65,  market: '台股' },
  { symbol: '2603', name: '長榮',      price: 198,    change: -5,    changePercent: -2.46, market: '台股' },
  { symbol: '2881', name: '富邦金',    price: 89.5,   change: 0.8,   changePercent: 0.90,  market: '台股' },
  { symbol: 'AAPL',  name: 'Apple',    price: 178.72, change: 2.34,  changePercent: 1.33,  market: '美股' },
  { symbol: 'MSFT',  name: 'Microsoft',price: 425.52, change: -3.21, changePercent: -0.75, market: '美股' },
  { symbol: 'NVDA',  name: 'NVIDIA',   price: 875.28, change: 18.45, changePercent: 2.15,  market: '美股' },
  { symbol: 'TSLA',  name: 'Tesla',    price: 245.67, change: -8.9,  changePercent: -3.50, market: '美股' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 165.34, change: 1.56,  changePercent: 0.95,  market: '美股' },
  { symbol: 'BTC', name: 'Bitcoin',  price: 87250.5, change: 1250.3, changePercent: 1.45,  market: '加密' },
  { symbol: 'ETH', name: 'Ethereum', price: 3420.8,  change: -45.2,  changePercent: -1.30, market: '加密' },
  { symbol: 'SOL', name: 'Solana',   price: 185.6,   change: 8.4,    changePercent: 4.74,  market: '加密' },
  { symbol: 'BNB', name: 'BNB',      price: 645.3,   change: 12.7,   changePercent: 2.01,  market: '加密' },
];

const defaultFavorites = ['2330', 'NVDA'];

export default function WatchlistPage() {
  const [favorites, setFavorites] = useState<string[]>(defaultFavorites);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nschool-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  function saveFavorites(next: string[]) {
    setFavorites(next);
    try { localStorage.setItem('nschool-favorites', JSON.stringify(next)); } catch {}
  }

  function removeFavorite(symbol: string) {
    saveFavorites(favorites.filter((s) => s !== symbol));
  }

  function addFavorite(symbol: string) {
    if (!favorites.includes(symbol)) {
      saveFavorites([...favorites, symbol]);
    }
    setSearchQuery('');
    setShowSearch(false);
  }

  const watchedStocks = allStocks.filter((s) => favorites.includes(s.symbol));

  const searchResults = searchQuery.length >= 1
    ? allStocks.filter(
        (s) =>
          !favorites.includes(s.symbol) &&
          (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">觀察名單</h1>
            <p className="text-sm text-gray-400 mt-0.5">追蹤感興趣的股票，即時掌握行情</p>
          </div>
          <button
            onClick={() => { setShowSearch((v) => !v); setSearchQuery(''); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md shadow-primary-400/30 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> 新增
          </button>
        </div>

        {/* Search / Add Panel */}
        {showSearch && (
          <div className="bg-white rounded-[var(--radius-card)] p-4 mb-4 shadow-sm">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋股票代號或名稱..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
              />
            </div>
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((stock) => {
                  const isUp = stock.change >= 0;
                  return (
                    <button
                      key={stock.symbol}
                      onClick={() => addFavorite(stock.symbol)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-primary-600">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{stock.symbol}</p>
                          <p className="text-xs text-gray-400">{stock.name} · {stock.market}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${isUp ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}`}>
                          {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                        <Plus className="w-4 h-4 text-primary-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : searchQuery.length > 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">找不到相關股票</p>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">輸入代號或名稱搜尋</p>
            )}
          </div>
        )}

        {/* Watchlist */}
        {watchedStocks.length === 0 ? (
          <div className="bg-white rounded-[var(--radius-card)] p-12 text-center">
            <Eye className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">觀察名單是空的</p>
            <p className="text-gray-400 text-sm mt-1">點擊「新增」或在交易頁點擊 ☆ 加入追蹤</p>
            <Link
              href="/trade"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors"
            >
              前往交易頁
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-[var(--radius-card)] divide-y divide-gray-50">
            {watchedStocks.map((stock) => {
              const isUp = stock.change >= 0;
              return (
                <div key={stock.symbol} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary-600">{stock.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-800">{stock.symbol}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">
                          {stock.market}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{stock.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800 tabular-nums">
                        {stock.price.toLocaleString()}
                      </p>
                      <div className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-up' : 'text-down'}`}>
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <button
                        onClick={() => removeFavorite(stock.symbol)}
                        className="p-1.5 rounded-lg text-gray-200 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="移除追蹤"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          共追蹤 {watchedStocks.length} 支股票 · 觀察名單與交易頁同步
        </p>
      </div>
    </AppLayout>
  );
}
