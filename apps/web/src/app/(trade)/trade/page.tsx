'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  TrendingUp, TrendingDown, Search, Star, X,
  Wallet, BarChart3, ArrowUpRight, Clock, CheckCircle,
  RefreshCw, ChevronDown,
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

type IndexInfo = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

// Static fallback for US & Crypto (no free real-time API without key)
const fallbackUS: Stock[] = [
  { symbol: 'AAPL',  name: 'Apple',       price: 178.72,  change: 2.34,   changePercent: 1.33,  volume: 52341 },
  { symbol: 'MSFT',  name: 'Microsoft',   price: 425.52,  change: -3.21,  changePercent: -0.75, volume: 23456 },
  { symbol: 'NVDA',  name: 'NVIDIA',      price: 875.28,  change: 18.45,  changePercent: 2.15,  volume: 89012 },
  { symbol: 'TSLA',  name: 'Tesla',       price: 245.67,  change: -8.90,  changePercent: -3.50, volume: 67890 },
  { symbol: 'GOOGL', name: 'Alphabet',    price: 165.34,  change: 1.56,   changePercent: 0.95,  volume: 15678 },
  { symbol: 'AMZN',  name: 'Amazon',      price: 198.45,  change: 3.21,   changePercent: 1.64,  volume: 34567 },
  { symbol: 'META',  name: 'Meta',        price: 512.30,  change: -7.80,  changePercent: -1.50, volume: 28901 },
  { symbol: 'NFLX',  name: 'Netflix',     price: 718.90,  change: 12.40,  changePercent: 1.75,  volume: 9876 },
  { symbol: 'AMD',   name: 'AMD',         price: 168.25,  change: 4.50,   changePercent: 2.75,  volume: 45678 },
  { symbol: 'INTC',  name: 'Intel',       price: 24.80,   change: -0.60,  changePercent: -2.36, volume: 78901 },
  { symbol: 'BRKB',  name: 'Berkshire B', price: 471.20,  change: 2.10,   changePercent: 0.45,  volume: 5678 },
  { symbol: 'JPM',   name: 'JPMorgan',    price: 224.50,  change: 1.80,   changePercent: 0.81,  volume: 18234 },
  { symbol: 'V',     name: 'Visa',        price: 320.15,  change: -1.45,  changePercent: -0.45, volume: 12345 },
  { symbol: 'DIS',   name: 'Disney',      price: 115.60,  change: 2.30,   changePercent: 2.03,  volume: 23456 },
  { symbol: 'COIN',  name: 'Coinbase',    price: 198.70,  change: 8.90,   changePercent: 4.69,  volume: 34567 },
  { symbol: 'ORCL',  name: 'Oracle',      price: 148.30,  change: 3.50,   changePercent: 2.42,  volume: 18234 },
  { symbol: 'TSM',   name: 'TSMC ADR',    price: 165.80,  change: 2.40,   changePercent: 1.47,  volume: 23456 },
  { symbol: 'ASML',  name: 'ASML',        price: 795.40,  change: -12.60, changePercent: -1.56, volume: 4567 },
  { symbol: 'QCOM',  name: 'Qualcomm',    price: 178.90,  change: 3.20,   changePercent: 1.82,  volume: 15678 },
  { symbol: 'AVGO',  name: 'Broadcom',    price: 1428.50, change: 25.30,  changePercent: 1.80,  volume: 6789 },
  { symbol: 'MU',    name: 'Micron',      price: 112.40,  change: -2.80,  changePercent: -2.43, volume: 34567 },
  { symbol: 'PLTR',  name: 'Palantir',    price: 25.60,   change: 1.20,   changePercent: 4.92,  volume: 156789 },
  { symbol: 'SNOW',  name: 'Snowflake',   price: 185.30,  change: -4.50,  changePercent: -2.37, volume: 12345 },
];

// TW fallback (Taiwan 50 + ETF) shown while API loads
const fallbackTW: Stock[] = [
  { symbol: '2330', name: '台積電',    price: 1025,  change: 15,   changePercent: 1.48,  volume: 28543 },
  { symbol: '2317', name: '鴻海',      price: 178.5, change: -2.5, changePercent: -1.38, volume: 45621 },
  { symbol: '2454', name: '聯發科',    price: 1580,  change: 30,   changePercent: 1.94,  volume: 8745 },
  { symbol: '2412', name: '中華電',    price: 121.5, change: -0.5, changePercent: -0.41, volume: 18234 },
  { symbol: '2882', name: '國泰金',    price: 55.8,  change: 0.6,  changePercent: 1.09,  volume: 56789 },
  { symbol: '2303', name: '聯電',      price: 55.2,  change: -0.8, changePercent: -1.43, volume: 87654 },
  { symbol: '2308', name: '台達電',    price: 342,   change: 5,    changePercent: 1.48,  volume: 9876 },
  { symbol: '3008', name: '大立光',    price: 2450,  change: -50,  changePercent: -2.00, volume: 3456 },
  { symbol: '0050', name: '元大台灣50', price: 185.3, change: 1.2,  changePercent: 0.65,  volume: 123456 },
  { symbol: '0056', name: '元大高股息', price: 38.5,  change: 0.3,  changePercent: 0.79,  volume: 987654 },
];

const PAGE_SIZE = 50;

const tabLabels: Record<MarketTab, string> = { tw: '台股', us: '美股', crypto: '加密貨幣' };

type Holding = {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  pnlPercent: number;
};

type TradeModalState = { stock: Stock; side: 'buy' | 'sell' } | null;

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-14 h-3.5 bg-gray-100 rounded animate-pulse" />
            <div className="w-20 h-3 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-right"><div className="w-16 h-4 bg-gray-100 rounded animate-pulse ml-auto" /></td>
      <td className="py-3 px-3 text-right"><div className="w-14 h-5 bg-gray-100 rounded-lg animate-pulse ml-auto" /></td>
      <td className="py-3 px-3 hidden md:table-cell text-right"><div className="w-12 h-3.5 bg-gray-50 rounded animate-pulse ml-auto" /></td>
      <td className="py-3 px-3"><div className="flex gap-1.5 justify-center"><div className="w-12 h-6 bg-gray-100 rounded-lg animate-pulse" /><div className="w-12 h-6 bg-gray-100 rounded-lg animate-pulse" /></div></td>
    </tr>
  );
}

export default function TradePage() {
  const [activeTab, setActiveTab] = useState<MarketTab>('tw');
  const [tabKey, setTabKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2330', 'NVDA']));
  const [tradeModal, setTradeModal] = useState<TradeModalState>(null);
  const [tradeQty, setTradeQty] = useState('1');
  const [tradeError, setTradeError] = useState('');
  const [toast, setToast] = useState('');

  // TW stocks from API (full list)
  const [twStocks, setTwStocks] = useState<Stock[]>(fallbackTW);
  const [twTotal, setTwTotal] = useState(0);
  const [twPage, setTwPage] = useState(1);
  const [twIndex, setTwIndex] = useState<IndexInfo | null>(null);
  const [twLoading, setTwLoading] = useState(true);
  const [twLoadingMore, setTwLoadingMore] = useState(false);
  const [apiSearchQuery, setApiSearchQuery] = useState('');

  // Crypto from API
  const [cryptoStocks, setCryptoStocks] = useState<Stock[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);

  const [balance, setBalance] = useState(100000);
  const [userHoldings, setUserHoldings] = useState<Holding[]>([]);

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state
  useEffect(() => {
    try {
      const b = localStorage.getItem('nschool-balance');
      if (b) setBalance(parseFloat(b));
      const h = localStorage.getItem('nschool-holdings');
      if (h) setUserHoldings(JSON.parse(h));
      const f = localStorage.getItem('nschool-favorites');
      if (f) setFavorites(new Set(JSON.parse(f)));
    } catch {}
    fetchTWData(1, '');
    fetchCryptoData();
  }, []);

  // Debounce search → re-fetch from API for TW tab
  useEffect(() => {
    if (activeTab !== 'tw') return;
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setApiSearchQuery(searchQuery);
      setTwPage(1);
      fetchTWData(1, searchQuery);
    }, 350);
    return () => { if (searchDebounce.current) clearTimeout(searchDebounce.current); };
  }, [searchQuery, activeTab]);

  const fetchTWData = useCallback(async (page: number, search: string, append = false) => {
    if (page === 1 && !append) setTwLoading(true);
    else setTwLoadingMore(true);
    try {
      const params = new URLSearchParams({ market: 'tw', page: String(page), limit: String(PAGE_SIZE) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/market?${params}`);
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success) return;
      const stocks: Stock[] = json.data.tw_stocks || [];
      const total: number = json.data.tw_total || 0;
      const indices: IndexInfo[] = json.data.tw_indices || [];
      if (indices.length > 0) setTwIndex(indices[0]);
      if (append) {
        setTwStocks((prev) => [...prev, ...stocks]);
      } else {
        setTwStocks(stocks.length > 0 ? stocks : fallbackTW);
      }
      setTwTotal(total);
    } catch {
      if (!append) setTwStocks(fallbackTW);
    } finally {
      setTwLoading(false);
      setTwLoadingMore(false);
    }
  }, []);

  const fetchCryptoData = useCallback(async () => {
    setCryptoLoading(true);
    try {
      const res = await fetch('/api/market?market=crypto');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data.crypto?.length > 0) {
        setCryptoStocks(json.data.crypto);
      }
    } catch {} finally {
      setCryptoLoading(false);
    }
  }, []);

  function loadMore() {
    const nextPage = twPage + 1;
    setTwPage(nextPage);
    fetchTWData(nextPage, apiSearchQuery, true);
  }

  function refresh() {
    if (activeTab === 'tw') { setTwPage(1); fetchTWData(1, apiSearchQuery); }
    else if (activeTab === 'crypto') fetchCryptoData();
  }

  // Current visible list
  const getDisplayStocks = (): Stock[] => {
    if (activeTab === 'tw') return twStocks;
    if (activeTab === 'us') {
      const q = searchQuery.toLowerCase();
      return q
        ? fallbackUS.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
        : fallbackUS;
    }
    const q = searchQuery.toLowerCase();
    return q
      ? cryptoStocks.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      : cryptoStocks;
  };

  const stocks = getDisplayStocks();
  const isLoading = activeTab === 'tw' ? twLoading : activeTab === 'crypto' ? cryptoLoading : false;

  const gainersCount = stocks.filter((s) => s.change >= 0).length;
  const losersCount = stocks.length - gainersCount;
  const gainerPct = stocks.length > 0 ? (gainersCount / stocks.length) * 100 : 50;

  const totalAssets = balance + userHoldings.reduce((sum, h) => sum + h.currentPrice * h.qty, 0);
  const totalInvested = userHoldings.reduce((sum, h) => sum + h.avgCost * h.qty, 0);
  const unrealizedPnL = userHoldings.reduce((sum, h) => sum + (h.currentPrice - h.avgCost) * h.qty, 0);

  function switchTab(tab: MarketTab) {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearchQuery('');
    setTabKey((k) => k + 1);
    if (tab === 'tw') fetchTWData(1, '');
    if (tab === 'crypto') fetchCryptoData();
  }

  function toggleFavorite(symbol: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(symbol) ? next.delete(symbol) : next.add(symbol);
      try { localStorage.setItem('nschool-favorites', JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  function openModal(stock: Stock, side: 'buy' | 'sell') {
    setTradeQty('1');
    setTradeError('');
    setTradeModal({ stock, side });
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function confirmTrade() {
    if (!tradeModal) return;
    const qty = parseInt(tradeQty) || 0;
    if (qty <= 0) { setTradeError('請輸入有效數量'); return; }
    const { stock, side } = tradeModal;
    const cost = qty * stock.price;
    const fee = Math.round(cost * 0.001425);

    if (side === 'buy') {
      const total = cost + fee;
      if (total > balance) { setTradeError(`餘額不足，需要 NT$ ${total.toLocaleString()}`); return; }
      const newBalance = balance - total;
      setBalance(newBalance);
      try { localStorage.setItem('nschool-balance', String(newBalance)); } catch {}
      const existingIdx = userHoldings.findIndex((h) => h.symbol === stock.symbol);
      let newHoldings: Holding[];
      if (existingIdx >= 0) {
        const e = userHoldings[existingIdx];
        const newQty = e.qty + qty;
        const newAvg = (e.avgCost * e.qty + stock.price * qty) / newQty;
        newHoldings = [...userHoldings];
        newHoldings[existingIdx] = { ...e, qty: newQty, avgCost: newAvg, currentPrice: stock.price, pnlPercent: ((stock.price - newAvg) / newAvg) * 100 };
      } else {
        newHoldings = [...userHoldings, { symbol: stock.symbol, name: stock.name, qty, avgCost: stock.price, currentPrice: stock.price, pnlPercent: 0 }];
      }
      setUserHoldings(newHoldings);
      try { localStorage.setItem('nschool-holdings', JSON.stringify(newHoldings)); } catch {}
      setTradeModal(null);
      showToast(`✅ 成功買入 ${stock.symbol} × ${qty} 股`);
    } else {
      const existingIdx = userHoldings.findIndex((h) => h.symbol === stock.symbol);
      if (existingIdx < 0) { setTradeError('您沒有持倉此股票'); return; }
      const e = userHoldings[existingIdx];
      if (qty > e.qty) { setTradeError(`持倉不足，目前持有 ${e.qty} 股`); return; }
      const proceeds = cost - fee;
      const newBalance = balance + proceeds;
      setBalance(newBalance);
      try { localStorage.setItem('nschool-balance', String(newBalance)); } catch {}
      const newHoldings = qty === e.qty
        ? userHoldings.filter((_, i) => i !== existingIdx)
        : userHoldings.map((h, i) => i === existingIdx ? { ...h, qty: h.qty - qty } : h);
      setUserHoldings(newHoldings);
      try { localStorage.setItem('nschool-holdings', JSON.stringify(newHoldings)); } catch {}
      setTradeModal(null);
      showToast(`✅ 成功賣出 ${stock.symbol} × ${qty} 股`);
    }
  }

  const totalCost = tradeModal ? (parseInt(tradeQty) || 0) * tradeModal.stock.price : 0;
  const maxBuyQty = tradeModal ? Math.floor(balance / (tradeModal.stock.price * 1.001425)) : 0;
  const maxSellQty = tradeModal ? (userHoldings.find((h) => h.symbol === tradeModal.stock.symbol)?.qty ?? 0) : 0;
  const buyPresets = [1, 5, 10, 'max'] as const;
  const sellPresets = [
    { label: '¼', value: Math.max(1, Math.floor(maxSellQty * 0.25)) },
    { label: '½', value: Math.max(1, Math.floor(maxSellQty * 0.5)) },
    { label: '全部', value: maxSellQty },
  ];

  const portfolioStats = [
    { label: '總資產',     value: `NT$ ${Math.round(totalAssets).toLocaleString()}`,   sub: '虛擬帳戶',    isUp: true,                 icon: Wallet },
    { label: '已投入',     value: `NT$ ${Math.round(totalInvested).toLocaleString()}`, sub: '持倉市值',    isUp: true,                 icon: BarChart3 },
    { label: '未實現損益', value: `${unrealizedPnL >= 0 ? '+' : ''}NT$ ${Math.round(unrealizedPnL).toLocaleString()}`, sub: unrealizedPnL >= 0 ? '盈利中' : '虧損中', isUp: unrealizedPnL >= 0, icon: TrendingUp },
    { label: '可用資金',   value: `NT$ ${Math.round(balance).toLocaleString()}`,       sub: '可立即交易',  isUp: true,                 icon: ArrowUpRight },
  ];

  const hasMore = activeTab === 'tw' && twStocks.length < twTotal && !isLoading;

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
              <p className="text-sm font-bold text-primary-600 leading-snug">NT$ {Math.round(balance).toLocaleString()}</p>
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
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.isUp ? 'bg-up/10' : 'bg-down/10'}`}>
                    <Icon className={`w-3.5 h-3.5 ${stat.isUp ? 'text-up' : 'text-down'}`} />
                  </div>
                </div>
                <p className="text-base font-bold text-gray-800 leading-tight">{stat.value}</p>
                <span className={`text-xs font-medium mt-0.5 block ${stat.isUp ? 'text-up' : 'text-down'}`}>{stat.sub}</span>
              </div>
            );
          })}
        </div>

        {/* My Holdings */}
        <div className="bg-white rounded-[var(--radius-card)] p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">我的持倉</h2>
          {userHoldings.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-2xl mb-2">🎮</p>
              <p className="text-sm font-medium text-gray-600 mb-1">用模擬資金買你的第一張股票</p>
              <p className="text-xs text-gray-400">你有 NT$ {balance.toLocaleString()} 的模擬資金，零風險練習投資</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userHoldings.map((h) => {
                const pnlAmt = (h.currentPrice - h.avgCost) * h.qty;
                const isUp = pnlAmt >= 0;
                return (
                  <div key={h.symbol} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary-600">{h.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{h.symbol} <span className="text-xs font-normal text-gray-400">{h.name}</span></p>
                        <p className="text-xs text-gray-400">{h.qty} 股 · 均價 {h.avgCost.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800 tabular-nums">NT$ {(h.currentPrice * h.qty).toLocaleString()}</p>
                      <p className={`text-xs font-semibold tabular-nums ${isUp ? 'text-up' : 'text-down'}`}>
                        {isUp ? '+' : ''}NT$ {Math.round(pnlAmt).toLocaleString()} ({isUp ? '+' : ''}{h.pnlPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Market Panel */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">

          {/* Tabs + Search + Refresh */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {(Object.keys(tabLabels) as MarketTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'tw' ? '搜尋代號或名稱…' : '搜尋…'}
                  className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 w-44 transition-all"
                />
              </div>
              <button
                onClick={refresh}
                disabled={isLoading}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40"
                aria-label="重新整理"
              >
                <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Index bar (TW only) */}
          {activeTab === 'tw' && twIndex && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-400 leading-none">加權指數</p>
                <p className="text-base font-bold text-gray-800 tabular-nums leading-snug mt-0.5">
                  {twIndex.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold ${twIndex.change >= 0 ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}`}>
                {twIndex.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {twIndex.change >= 0 ? '+' : ''}{twIndex.change.toFixed(2)} ({twIndex.changePercent.toFixed(2)}%)
              </div>
              <div className="ml-auto text-xs text-gray-400">
                {twTotal > 0 ? `共 ${twTotal.toLocaleString()} 支上市股票` : ''}
              </div>
            </div>
          )}

          {/* Market Sentiment Bar */}
          {!isLoading && stocks.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs shrink-0">
                <span className="text-up font-semibold">↑ {gainersCount} 上漲</span>
                <span className="text-gray-300">·</span>
                <span className="text-down font-semibold">↓ {losersCount} 下跌</span>
              </div>
              <div className="flex-1 h-1.5 bg-down/20 rounded-full overflow-hidden">
                <div className="h-full bg-up/70 rounded-full transition-all duration-500" style={{ width: `${gainerPct}%` }} />
              </div>
              <span className="text-xs text-gray-400 shrink-0">{stocks.length.toLocaleString()} 支</span>
            </div>
          )}

          {/* Mobile Card List */}
          <div key={`mobile-${tabKey}`} className="md:hidden grid grid-cols-2 gap-2.5 animate-fade-in">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl p-3.5 bg-gray-50 animate-pulse h-28" />
                ))
              : stocks.map((stock) => {
                  const isUp = stock.change >= 0;
                  const isFav = favorites.has(stock.symbol);
                  return (
                    <div
                      key={stock.symbol}
                      className={`relative rounded-2xl p-3.5 flex flex-col gap-2 border ${
                        isUp ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-800 leading-none">{stock.symbol}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-none truncate max-w-[90px]">{stock.name}</p>
                        </div>
                        <button onClick={() => toggleFavorite(stock.symbol)} className="p-0.5 -mt-0.5 -mr-0.5" aria-label={isFav ? '移除追蹤' : '加入追蹤'}>
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                        </button>
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900 tabular-nums leading-none">{stock.price.toLocaleString()}</p>
                        <div className={`inline-flex items-center gap-0.5 text-[11px] font-semibold mt-0.5 ${isUp ? 'text-up' : 'text-down'}`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                      <div className="flex gap-1.5 mt-auto">
                        <button onClick={() => openModal(stock, 'buy')} className="flex-1 py-1.5 rounded-lg bg-up text-white text-xs font-bold hover:bg-green-600 transition-colors active:scale-95">買</button>
                        <button onClick={() => openModal(stock, 'sell')} className="flex-1 py-1.5 rounded-lg bg-down text-white text-xs font-bold hover:bg-red-600 transition-colors active:scale-95">賣</button>
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Mobile Load More */}
          {hasMore && (
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <button
                onClick={loadMore}
                disabled={twLoadingMore}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors disabled:opacity-50"
              >
                {twLoadingMore ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {twLoadingMore ? '載入中…' : `載入更多（${twStocks.length} / ${twTotal}）`}
              </button>
            </div>
          )}

          {/* Desktop Table */}
          <div key={`desktop-${tabKey}`} className="hidden md:block overflow-x-auto animate-fade-in">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 py-3 px-3 w-52">代號 / 名稱</th>
                  <th className="text-right text-xs font-semibold text-gray-400 py-3 px-3">現價</th>
                  <th className="text-right text-xs font-semibold text-gray-400 py-3 px-3">漲跌幅</th>
                  <th className="text-right text-xs font-semibold text-gray-400 py-3 px-3 hidden md:table-cell">成交量(張)</th>
                  <th className="text-center text-xs font-semibold text-gray-400 py-3 px-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 12 }).map((_, i) => <SkeletonRow key={i} />)
                  : stocks.map((stock) => {
                      const isUp = stock.change >= 0;
                      const isFav = favorites.has(stock.symbol);
                      return (
                        <tr key={stock.symbol} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => toggleFavorite(stock.symbol)}
                                className="transition-transform hover:scale-125 shrink-0"
                                aria-label={isFav ? '移除追蹤' : '加入追蹤'}
                              >
                                <Star className={`w-3.5 h-3.5 transition-colors ${isFav ? 'text-amber-400 fill-amber-400' : 'text-gray-200 group-hover:text-gray-300'}`} />
                              </button>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 leading-none">{stock.symbol}</p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[120px]">{stock.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-3">
                            <span className="text-sm font-semibold text-gray-800 tabular-nums">
                              {stock.price >= 10000
                                ? stock.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
                                : stock.price >= 100
                                  ? stock.price.toFixed(1)
                                  : stock.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold tabular-nums ${isUp ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}`}>
                              {isUp ? <TrendingUp className="w-3 h-3 shrink-0" /> : <TrendingDown className="w-3 h-3 shrink-0" />}
                              {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </div>
                          </td>
                          <td className="text-right py-3 px-3 hidden md:table-cell">
                            <span className="text-xs text-gray-400 tabular-nums">{stock.volume.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openModal(stock, 'buy')}
                                className="px-3 py-1.5 rounded-lg bg-up/10 text-up text-xs font-semibold hover:bg-up hover:text-white transition-colors"
                              >
                                買入
                              </button>
                              <button
                                onClick={() => openModal(stock, 'sell')}
                                className="px-3 py-1.5 rounded-lg bg-down/10 text-down text-xs font-semibold hover:bg-down hover:text-white transition-colors"
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

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-4 pb-2">
                <button
                  onClick={loadMore}
                  disabled={twLoadingMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors disabled:opacity-50"
                >
                  {twLoadingMore ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {twLoadingMore ? '載入中…' : `載入更多（已顯示 ${twStocks.length.toLocaleString()} / ${twTotal.toLocaleString()} 支）`}
                </button>
              </div>
            )}
            {!isLoading && stocks.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">找不到符合的股票</div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-fade-in">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          {toast}
        </div>
      )}

      {/* Trade Modal */}
      {tradeModal && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm modal-backdrop" onClick={() => setTradeModal(null)} />
          <div className="relative bg-white rounded-b-3xl md:rounded-2xl w-full max-w-sm p-6 pt-[max(1.5rem,env(safe-area-inset-top))] shadow-2xl modal-content">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{tradeModal.side === 'buy' ? '買入' : '賣出'} {tradeModal.stock.symbol}</h3>
                <p className="text-sm text-gray-400">{tradeModal.stock.name}</p>
              </div>
              <button onClick={() => setTradeModal(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-xl mb-4 ${tradeModal.stock.change >= 0 ? 'bg-up/10' : 'bg-down/10'}`}>
              <span className="text-sm text-gray-500">目前價格</span>
              <span className={`text-lg font-bold tabular-nums ${tradeModal.stock.change >= 0 ? 'text-up' : 'text-down'}`}>
                {tradeModal.stock.price.toLocaleString()}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">快速選擇數量</p>
              {tradeModal.side === 'buy' ? (
                <div className="flex gap-2">
                  {buyPresets.map((p) => {
                    const val = p === 'max' ? maxBuyQty : p;
                    const label = p === 'max' ? `最多 ${val}` : `×${p}`;
                    const isActive = parseInt(tradeQty) === val;
                    return (
                      <button key={p} onClick={() => { setTradeQty(String(val)); setTradeError(''); }} disabled={val <= 0}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 ${isActive ? 'bg-up text-white shadow-sm' : 'bg-up/10 text-up hover:bg-up/20'}`}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex gap-2">
                  {sellPresets.map((p) => {
                    const isActive = parseInt(tradeQty) === p.value;
                    return (
                      <button key={p.label} onClick={() => { setTradeQty(String(p.value)); setTradeError(''); }} disabled={p.value <= 0}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 ${isActive ? 'bg-down text-white shadow-sm' : 'bg-down/10 text-down hover:bg-down/20'}`}>
                        {p.label} ({p.value})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 block mb-2">{tradeModal.side === 'buy' ? '買入' : '賣出'}數量（股/張）</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setTradeQty((prev) => String(Math.max(1, parseInt(prev) - 1)))} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-medium transition-colors">−</button>
                <input type="number" value={tradeQty} onChange={(e) => { setTradeQty(e.target.value); setTradeError(''); }} min="1"
                  className="flex-1 text-center text-xl font-bold text-gray-800 border-2 border-gray-100 focus:border-primary-300 rounded-xl py-2 outline-none transition-colors" />
                <button onClick={() => setTradeQty((prev) => String(parseInt(prev) + 1))} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-medium transition-colors">+</button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">預估金額</span>
                <span className="font-semibold text-gray-800 tabular-nums">NT$ {totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 手續費（0.1425%）</span>
                <span className="text-gray-500 tabular-nums">NT$ {(totalCost * 0.001425).toFixed(0)}</span>
              </div>
              {tradeModal.side === 'buy' && (
                <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
                  <span className="text-gray-400">可用餘額</span>
                  <span className={`font-semibold tabular-nums ${balance >= totalCost ? 'text-gray-600' : 'text-down'}`}>NT$ {Math.round(balance).toLocaleString()}</span>
                </div>
              )}
            </div>

            {tradeError && <p className="text-xs text-down font-medium mb-3 text-center">{tradeError}</p>}

            <button onClick={confirmTrade} className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all active:scale-95 ${tradeModal.side === 'buy' ? 'bg-up hover:bg-green-600' : 'bg-down hover:bg-red-600'}`}>
              確認{tradeModal.side === 'buy' ? '買入' : '賣出'}
            </button>
            <button onClick={() => setTradeModal(null)} className="w-full mt-2 py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">取消</button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
