'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff, Building2, BarChart2, Bitcoin, Banknote } from 'lucide-react';

const accountIcons = {
  bank: Building2,
  broker: BarChart2,
  crypto: Bitcoin,
  cash: Banknote,
};

const accountColors = {
  bank: '#6C5CE7',
  broker: '#A29BFE',
  crypto: '#FDCB6E',
  cash: '#00B894',
};

const mockData = {
  totalAssets: 1250000,
  monthlyChange: 35000,
  monthlyChangePercent: 2.88,
  accounts: [
    { name: '台銀帳戶', balance: 450000, type: 'bank' as const },
    { name: '國泰證券', balance: 580000, type: 'broker' as const },
    { name: 'Binance', balance: 120000, type: 'crypto' as const },
    { name: '現金', balance: 100000, type: 'cash' as const },
  ],
};

export default function AssetOverview() {
  const [showBalance, setShowBalance] = useState(true);
  const isPositive = mockData.monthlyChange >= 0;

  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-[var(--radius-card)] p-6 text-white shadow-lg shadow-primary-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary-200" />
          <span className="text-primary-200 text-sm font-medium">總資產</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label={showBalance ? '隱藏餘額' : '顯示餘額'}
          >
            {showBalance
              ? <Eye className="w-4 h-4 text-primary-200" />
              : <EyeOff className="w-4 h-4 text-primary-200" />
            }
          </button>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">TWD</span>
        </div>
      </div>

      {/* Total */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold tracking-tight tabular-nums">
          {showBalance ? `NT$ ${mockData.totalAssets.toLocaleString()}` : 'NT$ ••••••'}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {isPositive
              ? <TrendingUp className="w-3.5 h-3.5" />
              : <TrendingDown className="w-3.5 h-3.5" />
            }
            {isPositive ? '+' : ''}{mockData.monthlyChangePercent}%
          </div>
          <span className="text-xs text-primary-300">
            {isPositive ? '+' : ''}NT$ {mockData.monthlyChange.toLocaleString()} 本月
          </span>
        </div>
      </div>

      {/* Proportion Bar */}
      <div className="flex rounded-full overflow-hidden h-1.5 mb-4 gap-0.5">
        {mockData.accounts.map((account) => (
          <div
            key={account.name}
            style={{
              width: `${(account.balance / mockData.totalAssets) * 100}%`,
              backgroundColor: accountColors[account.type],
            }}
            className="h-full rounded-full"
          />
        ))}
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-2 gap-2">
        {mockData.accounts.map((account) => {
          const Icon = accountIcons[account.type];
          const color = accountColors[account.type];
          return (
            <div
              key={account.name}
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 rounded-xl p-3 transition-colors cursor-pointer group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}33` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-primary-300 truncate">{account.name}</p>
                <p className="text-sm font-semibold text-white tabular-nums">
                  {showBalance
                    ? `${(account.balance / 10000).toFixed(1)}萬`
                    : '••••'
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
