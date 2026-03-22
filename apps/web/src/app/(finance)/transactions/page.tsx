'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Plus, Camera, Filter, Calendar,
  ArrowDownLeft, ArrowUpRight, Wallet,
  Utensils, Car, Banknote, ShoppingBag, TrendingUp,
  Home, Smartphone, Tv, X, LucideIcon,
} from 'lucide-react';

type TxType = 'all' | 'income' | 'expense';

type CategoryKey = '餐飲' | '交通' | '薪資' | '購物' | '投資收入' | '居住' | '通訊' | '娛樂';

const categoryConfig: Record<CategoryKey, { icon: LucideIcon; bg: string; text: string }> = {
  '餐飲':   { icon: Utensils,  bg: 'bg-orange-100', text: 'text-orange-500' },
  '交通':   { icon: Car,       bg: 'bg-sky-100',    text: 'text-sky-500' },
  '薪資':   { icon: Banknote,  bg: 'bg-green-100',  text: 'text-green-600' },
  '購物':   { icon: ShoppingBag, bg: 'bg-pink-100', text: 'text-pink-500' },
  '投資收入': { icon: TrendingUp, bg: 'bg-primary-100', text: 'text-primary-500' },
  '居住':   { icon: Home,       bg: 'bg-amber-100',  text: 'text-amber-600' },
  '通訊':   { icon: Smartphone, bg: 'bg-blue-100',   text: 'text-blue-500' },
  '娛樂':   { icon: Tv,         bg: 'bg-purple-100', text: 'text-purple-500' },
};

const fallbackConfig = { icon: Wallet, bg: 'bg-gray-100', text: 'text-gray-500' };

type Transaction = {
  id: string; category: CategoryKey; description: string;
  amount: number; date: string; account: string;
};

const mockTransactions: Transaction[] = [
  { id: '1', category: '餐飲',   description: '午餐 - 便當',       amount: -120,   date: '2026-03-21', account: '台銀帳戶' },
  { id: '2', category: '交通',   description: 'YouBike 租借',       amount: -30,    date: '2026-03-21', account: '台銀帳戶' },
  { id: '3', category: '薪資',   description: '3月份薪資',          amount: 55000,  date: '2026-03-20', account: '台銀帳戶' },
  { id: '4', category: '購物',   description: 'momo 購物 - 耳機',   amount: -1290,  date: '2026-03-20', account: '台銀帳戶' },
  { id: '5', category: '投資收入', description: '股利入帳 - 0050',  amount: 3500,   date: '2026-03-18', account: '國泰證券' },
  { id: '6', category: '居住',   description: '房租',               amount: -12000, date: '2026-03-15', account: '台銀帳戶' },
  { id: '7', category: '通訊',   description: '中華電信月租',       amount: -599,   date: '2026-03-15', account: '台銀帳戶' },
  { id: '8', category: '娛樂',   description: 'Netflix 訂閱',       amount: -390,   date: '2026-03-14', account: '台銀帳戶' },
];

function groupByDate(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of txs) {
    if (!groups[tx.date]) groups[tx.date] = [];
    groups[tx.date].push(tx);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

function formatDateLabel(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  return new Intl.DateTimeFormat('zh-TW', { month: 'long', day: 'numeric' }).format(d);
}

export default function TransactionsPage() {
  const [txType, setTxType] = useState<TxType>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockTransactions.filter((tx) => {
    if (txType === 'income') return tx.amount > 0;
    if (txType === 'expense') return tx.amount < 0;
    return true;
  });

  const totalIncome = mockTransactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = mockTransactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;
  const grouped = groupByDate(filtered);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">記帳</h1>
            <p className="text-sm text-gray-400 mt-0.5">記錄每一筆收支，掌握財務狀況</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium shadow-md shadow-sky-400/30 hover:bg-sky-600 transition-colors">
              <Camera className="w-4 h-4" /> OCR 掃描
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md shadow-primary-400/30 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> 新增
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-lg bg-up/10 flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5 text-up" />
              </div>
              <span className="text-xs text-gray-400 font-medium">本月收入</span>
            </div>
            <p className="text-lg font-bold text-up tabular-nums">+NT$ {totalIncome.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-lg bg-down/10 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-down" />
              </div>
              <span className="text-xs text-gray-400 font-medium">本月支出</span>
            </div>
            <p className="text-lg font-bold text-down tabular-nums">-NT$ {totalExpense.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${balance >= 0 ? 'bg-up/10' : 'bg-down/10'}`}>
                <Wallet className={`w-3.5 h-3.5 ${balance >= 0 ? 'text-up' : 'text-down'}`} />
              </div>
              <span className="text-xs text-gray-400 font-medium">本月結餘</span>
            </div>
            <p className={`text-lg font-bold tabular-nums ${balance >= 0 ? 'text-up' : 'text-down'}`}>
              {balance >= 0 ? '+' : ''}NT$ {balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {([
                { key: 'all' as TxType, label: '全部' },
                { key: 'income' as TxType, label: '收入' },
                { key: 'expense' as TxType, label: '支出' },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTxType(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    txType === tab.key
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                <Calendar className="w-3.5 h-3.5" /> 3月
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                <Filter className="w-3.5 h-3.5" /> 篩選
              </button>
            </div>
          </div>

          {/* Grouped Transaction List */}
          {grouped.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-gray-400 text-sm">沒有符合條件的記錄</p>
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.map(([date, txs]) => {
                const dayTotal = txs.reduce((s, t) => s + t.amount, 0);
                return (
                  <div key={date}>
                    {/* Date Header */}
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-bold text-gray-500">{formatDateLabel(date)}</span>
                      <span className={`text-xs font-semibold tabular-nums ${dayTotal >= 0 ? 'text-up' : 'text-gray-400'}`}>
                        {dayTotal >= 0 ? '+' : ''}NT$ {dayTotal.toLocaleString()}
                      </span>
                    </div>
                    {/* Transactions */}
                    <div className="space-y-0.5">
                      {txs.map((tx) => {
                        const cfg = categoryConfig[tx.category] ?? fallbackConfig;
                        const Icon = cfg.icon;
                        const isIncome = tx.amount >= 0;
                        return (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                <Icon className={`w-4 h-4 ${cfg.text}`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 leading-snug">{tx.description}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{tx.category} · {tx.account}</p>
                              </div>
                            </div>
                            <span className={`text-sm font-bold tabular-nums shrink-0 ml-2 ${isIncome ? 'text-up' : 'text-gray-700'}`}>
                              {isIncome ? '+' : '-'}NT$ {Math.abs(tx.amount).toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">新增記錄</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl mb-4">
              {['支出', '收入'].map((t) => (
                <button key={t} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  t === '支出' ? 'bg-down text-white' : 'text-gray-400 hover:text-gray-600'
                }`}>{t}</button>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="number"
                placeholder="金額"
                className="w-full text-2xl font-bold text-center border-b-2 border-gray-100 focus:border-primary-300 outline-none py-3 transition-colors bg-transparent"
              />
              <input
                type="text"
                placeholder="描述（選填）"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
              />
            </div>

            <button
              onClick={() => setShowAddModal(false)}
              className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-sm shadow-md shadow-primary-400/30 active:scale-95 transition-all"
            >
              儲存記錄
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
