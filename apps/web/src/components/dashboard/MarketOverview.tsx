'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

const mockMarketData = [
  { symbol: '加權指數', price: 22850.32, change: 125.67, changePercent: 0.55, market: 'tw' as const },
  { symbol: '台積電', price: 1025, change: 15, changePercent: 1.48, market: 'tw' as const },
  { symbol: 'S&P 500', price: 5998.74, change: -23.45, changePercent: -0.39, market: 'us' as const },
  { symbol: 'BTC', price: 87250.5, change: 1250.3, changePercent: 1.45, market: 'crypto' as const },
  { symbol: 'ETH', price: 3420.8, change: -45.2, changePercent: -1.30, market: 'crypto' as const },
];

const marketLabels = { tw: '台股', us: '美股', crypto: '加密' };
const marketColors = { tw: 'bg-primary-100 text-primary-600', us: 'bg-blue-100 text-blue-600', crypto: 'bg-amber-100 text-amber-600' };

export default function MarketOverview() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">市場概覽</h3>
        <Link
          href="/trade"
          className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600"
        >
          查看更多 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-1">
        {mockMarketData.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.symbol}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${marketColors[item.market]}`}>
                  {marketLabels[item.market]}
                </span>
                <span className="text-sm font-medium text-gray-700">{item.symbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">
                  {item.price.toLocaleString()}
                </span>
                <div className={`flex items-center gap-0.5 ${isUp ? 'text-up' : 'text-down'}`}>
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span className="text-xs font-medium">
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
