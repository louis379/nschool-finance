'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff, Building2, BarChart2, Bitcoin, Banknote, Plus } from 'lucide-react';

type AccountType = 'bank' | 'broker' | 'crypto' | 'cash';
type Account = { id: string; name: string; type: AccountType; balance: number; currency: string };

const accountIcons: Record<AccountType, typeof Building2> = {
  bank: Building2,
  broker: BarChart2,
  crypto: Bitcoin,
  cash: Banknote,
};

const accountColors: Record<AccountType, string> = {
  bank: '#6C5CE7',
  broker: '#A29BFE',
  crypto: '#FDCB6E',
  cash: '#00B894',
};

export default function AssetOverview() {
  const [showBalance, setShowBalance] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [monthlyChange, setMonthlyChange] = useState({ amount: 0, percent: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nschool-accounts');
      if (raw) {
        const parsed: Account[] = JSON.parse(raw);
        setAccounts(parsed);

        // Compute monthly income/expense from transactions
        const txRaw = localStorage.getItem('nschool-transactions');
        if (txRaw) {
          const txs = JSON.parse(txRaw);
          const now = new Date();
          const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
          const monthlyTxs = txs.filter((t: { date: string }) => t.date.startsWith(thisMonth));
          const change = monthlyTxs.reduce((s: number, t: { amount: number }) => s + t.amount, 0);
          const total = parsed.reduce((s: number, a: Account) => s + a.balance, 0);
          setMonthlyChange({
            amount: change,
            percent: total > 0 ? (change / total) * 100 : 0,
          });
        }
      }
    } catch {}
  }, []);

  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);
  const isPositive = monthlyChange.amount >= 0;

  // Empty state
  if (accounts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-[var(--radius-card)] p-6 text-white shadow-lg shadow-primary-500/20">
        <div className="flex items-center gap-2 mb-5">
          <Wallet className="w-4 h-4 text-primary-200" />
          <span className="text-primary-200 text-sm font-medium">總資產</span>
        </div>
        <div className="py-6 text-center">
          <p className="text-4xl mb-3">🏦</p>
          <h3 className="text-lg font-bold text-white mb-1">設定你的第一個帳戶</h3>
          <p className="text-primary-200 text-sm mb-5">新增帳戶後，即可追蹤你的總資產狀況</p>
          <Link
            href="/accounts"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold text-white transition-colors"
          >
            <Plus className="w-4 h-4" /> 新增帳戶
          </Link>
        </div>
      </div>
    );
  }

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
          {showBalance ? `NT$ ${totalAssets.toLocaleString()}` : 'NT$ ••••••'}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {isPositive
              ? <TrendingUp className="w-3.5 h-3.5" />
              : <TrendingDown className="w-3.5 h-3.5" />
            }
            {isPositive ? '+' : ''}{monthlyChange.percent.toFixed(2)}%
          </div>
          <span className="text-xs text-primary-300">
            {isPositive ? '+' : ''}NT$ {monthlyChange.amount.toLocaleString()} 本月
          </span>
        </div>
      </div>

      {/* Proportion Bar */}
      {totalAssets > 0 && (
        <div className="flex rounded-full overflow-hidden h-1.5 mb-4 gap-0.5">
          {accounts.map((account) => (
            <div
              key={account.id}
              style={{
                width: `${(account.balance / totalAssets) * 100}%`,
                backgroundColor: accountColors[account.type],
              }}
              className="h-full rounded-full"
            />
          ))}
        </div>
      )}

      {/* Account Cards */}
      <div className="grid grid-cols-2 gap-2">
        {accounts.map((account) => {
          const Icon = accountIcons[account.type];
          const color = accountColors[account.type];
          return (
            <div
              key={account.id}
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
