'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Building2, BarChart2, Bitcoin, Banknote,
  Plus, Target, Wallet, ChevronRight,
  CheckCircle2, Clock, MoreHorizontal, LucideIcon,
} from 'lucide-react';

type AccountType = 'bank' | 'broker' | 'crypto' | 'cash';

const accountTypeConfig: Record<AccountType, {
  icon: LucideIcon; bg: string; text: string; bar: string; label: string;
}> = {
  bank:   { icon: Building2, bg: 'bg-primary-100', text: 'text-primary-600', bar: 'bg-primary-400',  label: '銀行' },
  broker: { icon: BarChart2,  bg: 'bg-blue-100',    text: 'text-blue-600',    bar: 'bg-blue-400',    label: '券商' },
  crypto: { icon: Bitcoin,    bg: 'bg-amber-100',   text: 'text-amber-600',   bar: 'bg-amber-400',   label: '加密' },
  cash:   { icon: Banknote,   bg: 'bg-green-100',   text: 'text-green-600',   bar: 'bg-green-400',   label: '現金' },
};

const mockAccounts = [
  { id: '1', name: '台銀帳戶', type: 'bank'   as AccountType, balance: 450000, currency: 'TWD' },
  { id: '2', name: '國泰證券', type: 'broker' as AccountType, balance: 580000, currency: 'TWD' },
  { id: '3', name: 'Binance',  type: 'crypto' as AccountType, balance: 120000, currency: 'TWD' },
  { id: '4', name: '現金',     type: 'cash'   as AccountType, balance: 100000, currency: 'TWD' },
];

const mockGoals = [
  { id: '1', name: '緊急預備金', target: 360000,  current: 230000, deadline: '2026-12-31', emoji: '🛡️' },
  { id: '2', name: '購屋頭期款', target: 2000000, current: 680000, deadline: '2030-01-01', emoji: '🏠' },
  { id: '3', name: '出國旅遊',   target: 80000,   current: 80000,  deadline: '2026-06-30', emoji: '✈️' },
];

type Tab = 'accounts' | 'goals';

export default function AccountsPage() {
  const [tab, setTab] = useState<Tab>('accounts');
  const totalBalance = mockAccounts.reduce((s, a) => s + a.balance, 0);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {tab === 'accounts' ? '帳戶管理' : '財務目標'}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {tab === 'accounts' ? '管理你的所有資產帳戶' : '追蹤你的理財目標進度'}
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-md shadow-primary-400/30 hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            {tab === 'accounts' ? '新增帳戶' : '新增目標'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1.5 rounded-2xl mb-6 shadow-sm">
          {([
            { key: 'accounts' as Tab, icon: Wallet,  label: '帳戶管理' },
            { key: 'goals'    as Tab, icon: Target,  label: '財務目標' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === key
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'accounts' ? (
          <>
            {/* Total Balance Banner */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[var(--radius-card)] p-5 text-white mb-4 shadow-lg shadow-primary-500/20">
              <p className="text-primary-300 text-xs font-medium mb-1">所有帳戶總計</p>
              <p className="text-3xl font-bold tabular-nums">NT$ {totalBalance.toLocaleString()}</p>
              <p className="text-primary-300 text-sm mt-1">{mockAccounts.length} 個帳戶</p>

              {/* Mini proportion bar */}
              <div className="flex gap-0.5 h-1 rounded-full overflow-hidden mt-4">
                {mockAccounts.map((a) => (
                  <div
                    key={a.id}
                    className={accountTypeConfig[a.type].bar}
                    style={{ width: `${(a.balance / totalBalance) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex gap-4 mt-2">
                {mockAccounts.map((a) => (
                  <div key={a.id} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${accountTypeConfig[a.type].bar}`} />
                    <span className="text-[11px] text-primary-300">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account List */}
            <div className="space-y-3">
              {mockAccounts.map((account) => {
                const cfg = accountTypeConfig[account.type];
                const Icon = cfg.icon;
                const pct = ((account.balance / totalBalance) * 100).toFixed(1);

                return (
                  <div
                    key={account.id}
                    className="bg-white rounded-[var(--radius-card)] p-5 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${cfg.text}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-base font-semibold text-gray-800 truncate">{account.name}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${cfg.bg} ${cfg.text}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">佔總資產 {pct}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-800 tabular-nums">
                            NT$ {account.balance.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">{account.currency}</p>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Proportion bar */}
                    <div className="mt-3.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cfg.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {mockGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const isComplete = pct >= 100;
              const remaining = goal.target - goal.current;

              return (
                <div
                  key={goal.id}
                  className={`bg-white rounded-[var(--radius-card)] p-5 border-2 transition-all cursor-pointer hover:shadow-md ${
                    isComplete ? 'border-up/40' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
                        {goal.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-gray-800 truncate">{goal.name}</p>
                          {isComplete && <CheckCircle2 className="w-4 h-4 text-up shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>目標：{goal.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-2xl font-bold tabular-nums ${isComplete ? 'text-up' : 'text-primary-600'}`}>
                        {pct}%
                      </p>
                      {!isComplete && (
                        <p className="text-xs text-gray-400 tabular-nums mt-0.5">
                          還差 NT$ {remaining.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-up' : 'bg-primary-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-400 tabular-nums">
                    <span>NT$ {goal.current.toLocaleString()}</span>
                    <span>NT$ {goal.target.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
