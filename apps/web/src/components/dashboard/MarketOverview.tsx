'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

type Market = 'tw' | 'us' | 'crypto';

type MarketItem = {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  market: Market;
};

const fallbackData: MarketItem[] = [
  { symbol: '加權指數', price: 22850.32, change: 125.67,  changePercent: 0.55,  market: 'tw' },
  { symbol: '台積電',   price: 1025,     change: 15,      changePercent: 1.48,  market: 'tw' },
  { symbol: 'S&P 500',  price: 5998.74,  change: -23.45,  changePercent: -0.39, market: 'us' },
  { symbol: 'BTC',      price: 87250.5,  change: 1250.3,  changePercent: 1.45,  market: 'crypto' },
  { symbol: 'ETH',      price: 3420.8,   change: -45.2,   changePercent: -1.30, market: 'crypto' },
];

const marketConfig: Record<Market, { label: string; badge: string }> = {
  tw:     { label: '台股',   badge: 'bg-primary-100 text-primary-600' },
  us:     { label: '美股',   badge: 'bg-blue-100 text-blue-600' },
  crypto: { label: '加密',   badge: 'bg-amber-100 text-amber-700' },
};

function formatPrice(price: number, market: Market) {
  if (market === 'crypto') return `$${price.toLocaleString()}`;
  return price.toLocaleString();
}

export default function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketItem[]>(fallbackData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarketData();
  }, []);

  async function fetchMarketData() {
    setLoading(true);
    try {
      const res = await fetch('/api/market?market=overview');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const items: MarketItem[] = json.data.map((d: { symbol: string; name?: string; price: number; change: number; changePercent: number }) => {
            let market: Market = 'tw';
            if (['BTC', 'ETH', 'SOL', 'BNB'].includes(d.symbol)) market = 'crypto';
            else if (['S&P 500', 'AAPL', 'MSFT', 'NVDA'].includes(d.symbol)) market = 'us';
            return { ...d, market };
          });
          // Keep S&P 500 from fallback if not in API results
          const hasUS = items.some((i) => i.market === 'us');
          if (!hasUS) {
            items.push(fallbackData.find((f) => f.symbol === 'S&P 500')!);
          }
          setMarketData(items.slice(0, 5));
        }
      }
    } catch {
      // Keep fallback
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">市場概覽</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMarketData}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-300 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/trade"
            className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 transition-colors font-medium"
          >
            查看更多 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="space-y-0.5">
        {marketData.map((item) => {
          const isUp = item.change >= 0;
          const cfg = marketConfig[item.market];

          return (
            <div
              key={item.symbol}
              className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ${cfg.badge}`}>
                  {cfg.label}
                </span>
                <span className="text-sm font-medium text-gray-700 truncate">{item.symbol}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="text-sm font-semibold text-gray-800 tabular-nums">
                  {formatPrice(item.price, item.market)}
                </span>
                <div className={`flex items-center gap-0.5 min-w-[52px] justify-end ${isUp ? 'text-up' : 'text-down'}`}>
                  {isUp
                    ? <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    : <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                  }
                  <span className="text-xs font-semibold tabular-nums">
                    {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
