'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  TrendingUp, TrendingDown, Search, Star, X,
  Wallet, BarChart3, ArrowUpRight, Clock, CheckCircle,
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

const fallbackStocks: Record<MarketTab, Stock[]> = {
  tw: [
    // 台灣50成分股
    { symbol: '2330', name: '台積電',      price: 1025,  change: 15,    changePercent: 1.48,  volume: 28543 },
    { symbol: '2317', name: '鴻海',        price: 178.5, change: -2.5,  changePercent: -1.38, volume: 45621 },
    { symbol: '2454', name: '聯發科',      price: 1580,  change: 30,    changePercent: 1.94,  volume: 8745 },
    { symbol: '2412', name: '中華電',      price: 121.5, change: -0.5,  changePercent: -0.41, volume: 18234 },
    { symbol: '2882', name: '國泰金',      price: 55.8,  change: 0.6,   changePercent: 1.09,  volume: 56789 },
    { symbol: '2881', name: '富邦金',      price: 89.5,  change: 0.8,   changePercent: 0.90,  volume: 34567 },
    { symbol: '2886', name: '兆豐金',      price: 38.2,  change: -0.2,  changePercent: -0.52, volume: 43210 },
    { symbol: '2891', name: '中信金',      price: 31.5,  change: 0.4,   changePercent: 1.28,  volume: 67890 },
    { symbol: '3711', name: '日月光投控',  price: 158,   change: 3,     changePercent: 1.94,  volume: 12345 },
    { symbol: '2303', name: '聯電',        price: 55.2,  change: -0.8,  changePercent: -1.43, volume: 87654 },
    { symbol: '2308', name: '台達電',      price: 342,   change: 5,     changePercent: 1.48,  volume: 9876 },
    { symbol: '3008', name: '大立光',      price: 2450,  change: -50,   changePercent: -2.00, volume: 3456 },
    { symbol: '2002', name: '中鋼',        price: 28.5,  change: 0.1,   changePercent: 0.35,  volume: 156789 },
    { symbol: '1301', name: '台塑',        price: 78.5,  change: -1.2,  changePercent: -1.51, volume: 23456 },
    { symbol: '2207', name: '和泰車',      price: 680,   change: 10,    changePercent: 1.49,  volume: 4567 },
    { symbol: '6505', name: '台塑化',      price: 90.2,  change: -0.8,  changePercent: -0.88, volume: 34567 },
    { symbol: '1303', name: '南亞',        price: 72.1,  change: 0.5,   changePercent: 0.70,  volume: 45678 },
    { symbol: '2885', name: '元大金',      price: 26.8,  change: 0.3,   changePercent: 1.13,  volume: 78901 },
    { symbol: '2892', name: '第一金',      price: 25.4,  change: -0.1,  changePercent: -0.39, volume: 56789 },
    { symbol: '9904', name: '寶成',        price: 32.6,  change: 0.2,   changePercent: 0.62,  volume: 23456 },
    { symbol: '2884', name: '玉山金',      price: 31.2,  change: 0.4,   changePercent: 1.30,  volume: 89012 },
    { symbol: '2887', name: '台新金',      price: 20.5,  change: -0.1,  changePercent: -0.49, volume: 67890 },
    { symbol: '5880', name: '合庫金',      price: 26.3,  change: 0.3,   changePercent: 1.15,  volume: 45678 },
    { symbol: '2883', name: '開發金',      price: 15.8,  change: -0.2,  changePercent: -1.25, volume: 123456 },
    { symbol: '5871', name: '中租KY',      price: 235,   change: 4,     changePercent: 1.73,  volume: 8901 },
    { symbol: '3045', name: '台灣大',      price: 109.5, change: -0.5,  changePercent: -0.45, volume: 15678 },
    { symbol: '4904', name: '遠傳',        price: 82.3,  change: 0.3,   changePercent: 0.37,  volume: 18234 },
    { symbol: '2357', name: '華碩',        price: 560,   change: -8,    changePercent: -1.41, volume: 7890 },
    { symbol: '2382', name: '廣達',        price: 298,   change: 5,     changePercent: 1.71,  volume: 23456 },
    { symbol: '3034', name: '聯詠',        price: 520,   change: 10,    changePercent: 1.96,  volume: 5678 },
    { symbol: '2345', name: '智邦',        price: 680,   change: 15,    changePercent: 2.26,  volume: 4567 },
    { symbol: '2379', name: '瑞昱',        price: 680,   change: -10,   changePercent: -1.45, volume: 6789 },
    { symbol: '6669', name: '緯穎',        price: 1850,  change: 35,    changePercent: 1.93,  volume: 2345 },
    { symbol: '2327', name: '國巨',        price: 780,   change: -15,   changePercent: -1.89, volume: 5678 },
    { symbol: '3037', name: '欣興',        price: 185,   change: 3,     changePercent: 1.65,  volume: 12345 },
    { symbol: '2395', name: '研華',        price: 420,   change: 5,     changePercent: 1.20,  volume: 4567 },
    { symbol: '4938', name: '和碩',        price: 72.5,  change: -1.0,  changePercent: -1.36, volume: 34567 },
    { symbol: '5876', name: '上海商銀',    price: 58.2,  change: 0.4,   changePercent: 0.69,  volume: 23456 },
    { symbol: '2912', name: '統一超',      price: 325,   change: 2,     changePercent: 0.62,  volume: 8901 },
    { symbol: '1216', name: '統一',        price: 78.5,  change: 0.8,   changePercent: 1.03,  volume: 45678 },
    { symbol: '2301', name: '光寶科',      price: 105,   change: 1.5,   changePercent: 1.45,  volume: 18234 },
    { symbol: '8046', name: '南電',        price: 420,   change: 8,     changePercent: 1.94,  volume: 5678 },
    { symbol: '3231', name: '緯創',        price: 92.5,  change: -1.5,  changePercent: -1.60, volume: 23456 },
    { symbol: '2409', name: '友達',        price: 21.5,  change: -0.3,  changePercent: -1.38, volume: 189012 },
    { symbol: '3529', name: '力旺',        price: 2850,  change: 50,    changePercent: 1.79,  volume: 1234 },
    { symbol: '6415', name: '矽力KY',      price: 3200,  change: -60,   changePercent: -1.84, volume: 890 },
    { symbol: '2377', name: '微星',        price: 195,   change: 3,     changePercent: 1.56,  volume: 15678 },
    { symbol: '6488', name: '環球晶',      price: 680,   change: 12,    changePercent: 1.80,  volume: 4567 },
    { symbol: '3661', name: '世芯KY',      price: 3500,  change: -70,   changePercent: -1.96, volume: 789 },
    { symbol: '2049', name: '上銀',        price: 350,   change: 5,     changePercent: 1.45,  volume: 5678 },
    { symbol: '2603', name: '長榮',        price: 198,   change: -5,    changePercent: -2.46, volume: 67890 },
    // ETF
    { symbol: '0050',  name: '元大台灣50',           price: 185.3, change: 1.2,  changePercent: 0.65,  volume: 123456 },
    { symbol: '0056',  name: '元大高股息',           price: 38.5,  change: 0.3,  changePercent: 0.79,  volume: 987654 },
    { symbol: '00878', name: '國泰永續高股息',       price: 22.8,  change: 0.2,  changePercent: 0.88,  volume: 456789 },
    { symbol: '00713', name: '元大台灣高息低波',     price: 52.6,  change: 0.4,  changePercent: 0.77,  volume: 78901 },
    { symbol: '00692', name: '富邦公司治理',         price: 48.3,  change: 0.3,  changePercent: 0.63,  volume: 34567 },
    { symbol: '00850', name: '元大臺灣ESG永續',      price: 35.2,  change: 0.2,  changePercent: 0.57,  volume: 45678 },
    { symbol: '0051',  name: '元大中型100',          price: 78.4,  change: 0.5,  changePercent: 0.64,  volume: 23456 },
    { symbol: '0052',  name: '富邦科技',             price: 165.8, change: 2.1,  changePercent: 1.28,  volume: 18234 },
  ],
  us: [
    { symbol: 'AAPL',  name: 'Apple',          price: 178.72,  change: 2.34,   changePercent: 1.33,  volume: 52341 },
    { symbol: 'MSFT',  name: 'Microsoft',      price: 425.52,  change: -3.21,  changePercent: -0.75, volume: 23456 },
    { symbol: 'NVDA',  name: 'NVIDIA',         price: 875.28,  change: 18.45,  changePercent: 2.15,  volume: 89012 },
    { symbol: 'TSLA',  name: 'Tesla',          price: 245.67,  change: -8.90,  changePercent: -3.50, volume: 67890 },
    { symbol: 'GOOGL', name: 'Alphabet',       price: 165.34,  change: 1.56,   changePercent: 0.95,  volume: 15678 },
    { symbol: 'AMZN',  name: 'Amazon',         price: 198.45,  change: 3.21,   changePercent: 1.64,  volume: 34567 },
    { symbol: 'META',  name: 'Meta',           price: 512.30,  change: -7.80,  changePercent: -1.50, volume: 28901 },
    { symbol: 'NFLX',  name: 'Netflix',        price: 718.90,  change: 12.40,  changePercent: 1.75,  volume: 9876 },
    { symbol: 'AMD',   name: 'AMD',            price: 168.25,  change: 4.50,   changePercent: 2.75,  volume: 45678 },
    { symbol: 'INTC',  name: 'Intel',          price: 24.80,   change: -0.60,  changePercent: -2.36, volume: 78901 },
    { symbol: 'BRKB',  name: 'Berkshire B',    price: 471.20,  change: 2.10,   changePercent: 0.45,  volume: 5678 },
    { symbol: 'JPM',   name: 'JPMorgan',       price: 224.50,  change: 1.80,   changePercent: 0.81,  volume: 18234 },
    { symbol: 'V',     name: 'Visa',           price: 320.15,  change: -1.45,  changePercent: -0.45, volume: 12345 },
    { symbol: 'DIS',   name: 'Disney',         price: 115.60,  change: 2.30,   changePercent: 2.03,  volume: 23456 },
    { symbol: 'COIN',  name: 'Coinbase',       price: 198.70,  change: 8.90,   changePercent: 4.69,  volume: 34567 },
    { symbol: 'ORCL',  name: 'Oracle',         price: 148.30,  change: 3.50,   changePercent: 2.42,  volume: 18234 },
    { symbol: 'TSM',   name: 'TSMC ADR',       price: 165.80,  change: 2.40,   changePercent: 1.47,  volume: 23456 },
    { symbol: 'ASML',  name: 'ASML',           price: 795.40,  change: -12.60, changePercent: -1.56, volume: 4567 },
    { symbol: 'QCOM',  name: 'Qualcomm',       price: 178.90,  change: 3.20,   changePercent: 1.82,  volume: 15678 },
    { symbol: 'AVGO',  name: 'Broadcom',       price: 1428.50, change: 25.30,  changePercent: 1.80,  volume: 6789 },
    { symbol: 'MU',    name: 'Micron',         price: 112.40,  change: -2.80,  changePercent: -2.43, volume: 34567 },
    { symbol: 'PLTR',  name: 'Palantir',       price: 25.60,   change: 1.20,   changePercent: 4.92,  volume: 156789 },
    { symbol: 'SNOW',  name: 'Snowflake',      price: 185.30,  change: -4.50,  changePercent: -2.37, volume: 12345 },
  ],
  crypto: [
    { symbol: 'BTC',   name: 'Bitcoin',        price: 87250.5, change: 1250.3, changePercent: 1.45,  volume: 245678 },
    { symbol: 'ETH',   name: 'Ethereum',       price: 3420.8,  change: -45.2,  changePercent: -1.30, volume: 123456 },
    { symbol: 'SOL',   name: 'Solana',         price: 185.6,   change: 8.4,    changePercent: 4.74,  volume: 89012 },
    { symbol: 'BNB',   name: 'BNB',            price: 645.3,   change: 12.7,   changePercent: 2.01,  volume: 34567 },
    { symbol: 'XRP',   name: 'XRP',            price: 2.45,    change: 0.08,   changePercent: 3.37,  volume: 567890 },
    { symbol: 'ADA',   name: 'Cardano',        price: 0.85,    change: -0.03,  changePercent: -3.41, volume: 456789 },
    { symbol: 'DOGE',  name: 'Dogecoin',       price: 0.285,   change: 0.012,  changePercent: 4.40,  volume: 789012 },
    { symbol: 'AVAX',  name: 'Avalanche',      price: 38.50,   change: 1.20,   changePercent: 3.22,  volume: 78901 },
    { symbol: 'DOT',   name: 'Polkadot',       price: 8.90,    change: -0.30,  changePercent: -3.26, volume: 123456 },
    { symbol: 'LINK',  name: 'Chainlink',      price: 18.75,   change: 0.85,   changePercent: 4.74,  volume: 89012 },
    { symbol: 'UNI',   name: 'Uniswap',        price: 12.40,   change: 0.55,   changePercent: 4.64,  volume: 45678 },
    { symbol: 'MATIC', name: 'Polygon',        price: 0.72,    change: -0.04,  changePercent: -5.26, volume: 234567 },
    { symbol: 'LTC',   name: 'Litecoin',       price: 105.30,  change: 2.10,   changePercent: 2.03,  volume: 56789 },
    { symbol: 'ATOM',  name: 'Cosmos',         price: 9.85,    change: 0.35,   changePercent: 3.69,  volume: 34567 },
    { symbol: 'ARB',   name: 'Arbitrum',       price: 1.25,    change: -0.06,  changePercent: -4.58, volume: 123456 },
    { symbol: 'SUI',   name: 'Sui',            price: 1.85,    change: 0.12,   changePercent: 6.94,  volume: 89012 },
    { symbol: 'TON',   name: 'Toncoin',        price: 5.45,    change: 0.20,   changePercent: 3.81,  volume: 67890 },
    { symbol: 'OP',    name: 'Optimism',       price: 2.15,    change: -0.08,  changePercent: -3.59, volume: 78901 },
  ],
};

const tabLabels: Record<MarketTab, string> = { tw: '台股', us: '美股', crypto: '加密貨幣' };

type Holding = {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  pnlPercent: number;
};

const defaultHoldings: Holding[] = [];

type TradeModalState = { stock: Stock; side: 'buy' | 'sell' } | null;

export default function TradePage() {
  const [activeTab, setActiveTab] = useState<MarketTab>('tw');
  const [tabKey, setTabKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2330', 'NVDA']));
  const [tradeModal, setTradeModal] = useState<TradeModalState>(null);
  const [tradeQty, setTradeQty] = useState('1');
  const [tradeError, setTradeError] = useState('');
  const [toast, setToast] = useState('');
  const [marketStocks, setMarketStocks] = useState(fallbackStocks);

  const [balance, setBalance] = useState(100000);
  const [userHoldings, setUserHoldings] = useState<Holding[]>(defaultHoldings);

  // Load from localStorage after mount
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem('nschool-balance');
      if (savedBalance) setBalance(parseFloat(savedBalance));

      const savedHoldings = localStorage.getItem('nschool-holdings');
      if (savedHoldings) setUserHoldings(JSON.parse(savedHoldings));

      const savedFavorites = localStorage.getItem('nschool-favorites');
      if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
    } catch {}

    // Fetch real market data
    fetchMarketData();
  }, []);

  async function fetchMarketData() {
    try {
      const res = await fetch('/api/market?market=all');
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success) return;

      const updated = { ...fallbackStocks };

      // Update TW stocks
      if (json.data.tw_stocks && json.data.tw_stocks.length > 0) {
        updated.tw = json.data.tw_stocks.map((s: Stock) => ({
          ...s,
          volume: s.volume || 0,
        }));
        // Keep any fallback stocks not in API result
        for (const fb of fallbackStocks.tw) {
          if (!updated.tw.find((s: Stock) => s.symbol === fb.symbol)) {
            updated.tw.push(fb);
          }
        }
      }

      // Update crypto
      if (json.data.crypto && json.data.crypto.length > 0) {
        updated.crypto = json.data.crypto.map((s: Stock) => ({
          ...s,
          volume: s.volume || 0,
        }));
      }

      setMarketStocks(updated);
    } catch {
      // Keep fallback data
    }
  }

  const stocks = marketStocks[activeTab].filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Market sentiment: count gainers vs losers in current tab
  const allTabStocks = marketStocks[activeTab];
  const gainersCount = allTabStocks.filter((s) => s.change >= 0).length;
  const losersCount = allTabStocks.length - gainersCount;
  const gainerPct = allTabStocks.length > 0 ? (gainersCount / allTabStocks.length) * 100 : 50;

  const totalAssets = balance + userHoldings.reduce((sum, h) => sum + h.currentPrice * h.qty, 0);
  const totalInvested = userHoldings.reduce((sum, h) => sum + h.avgCost * h.qty, 0);
  const unrealizedPnL = userHoldings.reduce((sum, h) => sum + (h.currentPrice - h.avgCost) * h.qty, 0);

  function switchTab(tab: MarketTab) {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setTabKey((k) => k + 1); // trigger fade-in animation
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
        const existing = userHoldings[existingIdx];
        const newQty = existing.qty + qty;
        const newAvgCost = (existing.avgCost * existing.qty + stock.price * qty) / newQty;
        const pnlPct = ((stock.price - newAvgCost) / newAvgCost) * 100;
        newHoldings = [...userHoldings];
        newHoldings[existingIdx] = { ...existing, qty: newQty, avgCost: newAvgCost, currentPrice: stock.price, pnlPercent: pnlPct };
      } else {
        newHoldings = [...userHoldings, {
          symbol: stock.symbol, name: stock.name, qty,
          avgCost: stock.price, currentPrice: stock.price, pnlPercent: 0,
        }];
      }
      setUserHoldings(newHoldings);
      try { localStorage.setItem('nschool-holdings', JSON.stringify(newHoldings)); } catch {}
      setTradeModal(null);
      showToast(`✅ 成功買入 ${stock.symbol} × ${qty} 股`);
    } else {
      const existingIdx = userHoldings.findIndex((h) => h.symbol === stock.symbol);
      if (existingIdx < 0) { setTradeError('您沒有持倉此股票'); return; }
      const existing = userHoldings[existingIdx];
      if (qty > existing.qty) { setTradeError(`持倉不足，目前持有 ${existing.qty} 股`); return; }

      const proceeds = cost - fee;
      const newBalance = balance + proceeds;
      setBalance(newBalance);
      try { localStorage.setItem('nschool-balance', String(newBalance)); } catch {}

      let newHoldings: Holding[];
      if (qty === existing.qty) {
        newHoldings = userHoldings.filter((_, i) => i !== existingIdx);
      } else {
        newHoldings = [...userHoldings];
        newHoldings[existingIdx] = { ...existing, qty: existing.qty - qty };
      }
      setUserHoldings(newHoldings);
      try { localStorage.setItem('nschool-holdings', JSON.stringify(newHoldings)); } catch {}
      setTradeModal(null);
      showToast(`✅ 成功賣出 ${stock.symbol} × ${qty} 股`);
    }
  }

  const totalCost = tradeModal
    ? (parseInt(tradeQty) || 0) * tradeModal.stock.price
    : 0;

  // Quick qty presets for trade modal
  const maxBuyQty = tradeModal ? Math.floor(balance / (tradeModal.stock.price * 1.001425)) : 0;
  const maxSellQty = tradeModal
    ? (userHoldings.find((h) => h.symbol === tradeModal.stock.symbol)?.qty ?? 0)
    : 0;

  const buyPresets = [1, 5, 10, 'max'] as const;
  const sellPresets = [
    { label: '¼', value: Math.max(1, Math.floor(maxSellQty * 0.25)) },
    { label: '½', value: Math.max(1, Math.floor(maxSellQty * 0.5)) },
    { label: '全部', value: maxSellQty },
  ];

  const portfolioStats = [
    { label: '總資產',    value: `NT$ ${Math.round(totalAssets).toLocaleString()}`,     sub: '+3.52%',  isUp: true,  icon: Wallet },
    { label: '已投入',    value: `NT$ ${Math.round(totalInvested).toLocaleString()}`,    sub: '持倉市值', isUp: true,  icon: BarChart3 },
    { label: '未實現損益', value: `${unrealizedPnL >= 0 ? '+' : ''}NT$ ${Math.round(unrealizedPnL).toLocaleString()}`, sub: unrealizedPnL >= 0 ? '盈利中' : '虧損中', isUp: unrealizedPnL >= 0, icon: TrendingUp },
    { label: '可用資金',  value: `NT$ ${Math.round(balance).toLocaleString()}`,          sub: '虛擬資金', isUp: true,  icon: ArrowUpRight },
  ];

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
          )}
        </div>

        {/* Market Tabs & Search */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {(Object.keys(tabLabels) as MarketTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
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

          {/* Market Sentiment Bar — moomoo-style */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="text-up font-semibold">↑ {gainersCount} 上漲</span>
              <span className="text-gray-300">·</span>
              <span className="text-down font-semibold">↓ {losersCount} 下跌</span>
            </div>
            <div className="flex-1 h-1.5 bg-down/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-up/70 rounded-full transition-all duration-500"
                style={{ width: `${gainerPct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 shrink-0">{gainersCount}/{allTabStocks.length}</span>
          </div>

          {/* Stock list — key prop triggers fade-in animation on tab switch (Webull-style) */}

          {/* Mobile Card List — S12-004 卡片化 */}
          <div key={`mobile-${tabKey}`} className="md:hidden grid grid-cols-2 gap-2.5 animate-fade-in">
            {stocks.map((stock) => {
              const isUp = stock.change >= 0;
              const isFav = favorites.has(stock.symbol);
              return (
                <div
                  key={stock.symbol}
                  className={`relative rounded-2xl p-3.5 flex flex-col gap-2 border ${
                    isUp
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'
                  }`}
                >
                  {/* Top row: symbol + favorite */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-none">{stock.symbol}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-none truncate max-w-[90px]">{stock.name}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(stock.symbol)}
                      className="p-0.5 -mt-0.5 -mr-0.5"
                      aria-label={isFav ? '移除追蹤' : '加入追蹤'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-base font-bold text-gray-900 tabular-nums leading-none">
                      {stock.price.toLocaleString()}
                    </p>
                    <div className={`inline-flex items-center gap-0.5 text-[11px] font-semibold mt-0.5 ${isUp ? 'text-up' : 'text-down'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1.5 mt-auto">
                    <button
                      onClick={() => openModal(stock, 'buy')}
                      className="flex-1 py-1.5 rounded-lg bg-up text-white text-xs font-bold hover:bg-green-600 transition-colors active:scale-95"
                    >
                      買
                    </button>
                    <button
                      onClick={() => openModal(stock, 'sell')}
                      className="flex-1 py-1.5 rounded-lg bg-down text-white text-xs font-bold hover:bg-red-600 transition-colors active:scale-95"
                    >
                      賣
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div key={`desktop-${tabKey}`} className="hidden md:block overflow-x-auto animate-fade-in">
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

            {/* Quick Qty Presets — Robinhood-style one-tap quantity selection */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">快速選擇數量</p>
              {tradeModal.side === 'buy' ? (
                <div className="flex gap-2">
                  {buyPresets.map((p) => {
                    const val = p === 'max' ? maxBuyQty : p;
                    const label = p === 'max' ? `最多 ${val}` : `×${p}`;
                    const isActive = parseInt(tradeQty) === val;
                    return (
                      <button
                        key={p}
                        onClick={() => { setTradeQty(String(val)); setTradeError(''); }}
                        disabled={val <= 0}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                          isActive
                            ? 'bg-up text-white shadow-sm'
                            : 'bg-up/10 text-up hover:bg-up/20'
                        }`}
                      >
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
                      <button
                        key={p.label}
                        onClick={() => { setTradeQty(String(p.value)); setTradeError(''); }}
                        disabled={p.value <= 0}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                          isActive
                            ? 'bg-down text-white shadow-sm'
                            : 'bg-down/10 text-down hover:bg-down/20'
                        }`}
                      >
                        {p.label} ({p.value})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quantity Stepper */}
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
                  onChange={(e) => { setTradeQty(e.target.value); setTradeError(''); }}
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
            <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
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
              {tradeModal.side === 'buy' && (
                <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
                  <span className="text-gray-400">可用餘額</span>
                  <span className={`font-semibold tabular-nums ${balance >= totalCost ? 'text-gray-600' : 'text-down'}`}>
                    NT$ {Math.round(balance).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Error */}
            {tradeError && (
              <p className="text-xs text-down font-medium mb-3 text-center">{tradeError}</p>
            )}

            {/* Confirm */}
            <button
              onClick={confirmTrade}
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
