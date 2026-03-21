'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TrendingUp, TrendingDown, Search, Star, ArrowUpDown } from 'lucide-react';

type MarketTab = 'tw' | 'us' | 'crypto';

const mockStocks = {
  tw: [
    { symbol: '2330', name: '台積電', price: 1025, change: 15, changePercent: 1.48, volume: 28543 },
    { symbol: '2317', name: '鴻海', price: 178.5, change: -2.5, changePercent: -1.38, volume: 45621 },
    { symbol: '2454', name: '聯發科', price: 1580, change: 30, changePercent: 1.94, volume: 8745 },
    { symbol: '0050', name: '元大台灣50', price: 185.3, change: 1.2, changePercent: 0.65, volume: 12356 },
    { symbol: '2603', name: '長榮', price: 198, change: -5, changePercent: -2.46, volume: 67890 },
    { symbol: '2881', name: '富邦金', price: 89.5, change: 0.8, changePercent: 0.90, volume: 34567 },
  ],
  us: [
    { symbol: 'AAPL', name: 'Apple', price: 178.72, change: 2.34, changePercent: 1.33, volume: 52341 },
    { symbol: 'MSFT', name: 'Microsoft', price: 425.52, change: -3.21, changePercent: -0.75, volume: 23456 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 875.28, change: 18.45, changePercent: 2.15, volume: 89012 },
    { symbol: 'TSLA', name: 'Tesla', price: 245.67, change: -8.9, changePercent: -3.50, volume: 67890 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 165.34, change: 1.56, changePercent: 0.95, volume: 15678 },
  ],
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 87250.5, change: 1250.3, changePercent: 1.45, volume: 245678 },
    { symbol: 'ETH', name: 'Ethereum', price: 3420.8, change: -45.2, changePercent: -1.30, volume: 123456 },
    { symbol: 'SOL', name: 'Solana', price: 185.6, change: 8.4, changePercent: 4.74, volume: 89012 },
    { symbol: 'BNB', name: 'BNB', price: 645.3, change: 12.7, changePercent: 2.01, volume: 34567 },
  ],
};

const tabLabels: Record<MarketTab, string> = { tw: '台股', us: '美股', crypto: '加密貨幣' };

export default function TradePage() {
  const [activeTab, setActiveTab] = useState<MarketTab>('tw');
  const [searchQuery, setSearchQuery] = useState('');

  const stocks = mockStocks[activeTab].filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">模擬交易</h1>
          <div className="flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-primary-400">虛擬資金</span>
            <span className="text-sm font-bold text-primary-600">NT$ 1,000,000</span>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: '總資產', value: 'NT$ 1,035,200', trend: '+3.52%', isUp: true },
            { label: '已投入', value: 'NT$ 780,000', trend: '', isUp: true },
            { label: '未實現損益', value: '+NT$ 35,200', trend: '+4.51%', isUp: true },
            { label: '今日損益', value: '+NT$ 5,800', trend: '+0.56%', isUp: true },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-[var(--radius-card)] p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              {stat.trend && (
                <span className={`text-xs font-medium ${stat.isUp ? 'text-up' : 'text-down'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
          ))}
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
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 w-48"
              />
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 py-3 px-2">代號/名稱</th>
                  <th className="text-right text-xs font-medium text-gray-400 py-3 px-2">
                    <span className="flex items-center justify-end gap-1">
                      現價 <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 py-3 px-2">漲跌</th>
                  <th className="text-right text-xs font-medium text-gray-400 py-3 px-2 hidden md:table-cell">成交量</th>
                  <th className="text-center text-xs font-medium text-gray-400 py-3 px-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const isUp = stock.change >= 0;
                  return (
                    <tr key={stock.symbol} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-300 hover:text-amber-400 transition-colors">
                            <Star className="w-4 h-4" />
                          </button>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{stock.symbol}</p>
                            <p className="text-xs text-gray-400">{stock.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2">
                        <span className={`text-sm font-semibold ${isUp ? 'text-up' : 'text-down'}`}>
                          {stock.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right py-3 px-2">
                        <div className={`flex items-center justify-end gap-1 ${isUp ? 'text-up' : 'text-down'}`}>
                          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          <div>
                            <p className="text-xs font-medium">{isUp ? '+' : ''}{stock.change}</p>
                            <p className="text-[10px]">{isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 hidden md:table-cell">
                        <span className="text-xs text-gray-500">{stock.volume.toLocaleString()}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <button className="px-3 py-1.5 rounded-lg bg-up/10 text-up text-xs font-medium hover:bg-up/20 transition-colors">
                            買入
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-down/10 text-down text-xs font-medium hover:bg-down/20 transition-colors">
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
    </AppLayout>
  );
}
