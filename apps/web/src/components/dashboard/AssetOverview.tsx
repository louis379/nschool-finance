'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const mockData = {
  totalAssets: 1250000,
  monthlyChange: 35000,
  monthlyChangePercent: 2.88,
  accounts: [
    { name: '台銀帳戶', balance: 450000, color: '#6C5CE7', type: 'bank' },
    { name: '國泰證券', balance: 580000, color: '#A29BFE', type: 'broker' },
    { name: 'Binance', balance: 120000, color: '#FDCB6E', type: 'crypto' },
    { name: '現金', balance: 100000, color: '#00B894', type: 'cash' },
  ],
};

export default function AssetOverview() {
  const isPositive = mockData.monthlyChange >= 0;

  return (
    <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-[var(--radius-card)] p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary-200" />
          <span className="text-primary-200 text-sm">總資產</span>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">TWD</span>
      </div>

      <div className="mb-4">
        <h2 className="text-3xl font-bold tracking-tight">
          NT$ {mockData.totalAssets.toLocaleString()}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-300" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-300" />
          )}
          <span className={`text-sm ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
            {isPositive ? '+' : ''}NT$ {mockData.monthlyChange.toLocaleString()}
            ({isPositive ? '+' : ''}{mockData.monthlyChangePercent}%)
          </span>
          <span className="text-xs text-primary-200">本月</span>
        </div>
      </div>

      {/* Account Bars */}
      <div className="space-y-2">
        <div className="flex rounded-full overflow-hidden h-3">
          {mockData.accounts.map((account) => (
            <div
              key={account.name}
              style={{
                width: `${(account.balance / mockData.totalAssets) * 100}%`,
                backgroundColor: account.color,
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {mockData.accounts.map((account) => (
            <div key={account.name} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: account.color }}
              />
              <span className="text-xs text-primary-100">{account.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
