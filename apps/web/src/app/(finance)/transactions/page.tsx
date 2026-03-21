'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Plus, Camera, Filter, Calendar, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

type ViewMode = 'list' | 'calendar';
type TxType = 'all' | 'income' | 'expense';

const mockTransactions = [
  { id: '1', icon: '🍽️', category: '餐飲', description: '午餐 - 便當', amount: -120, date: '2026-03-21', account: '台銀帳戶' },
  { id: '2', icon: '🚗', category: '交通', description: 'YouBike 租借', amount: -30, date: '2026-03-21', account: '台銀帳戶' },
  { id: '3', icon: '💰', category: '薪資', description: '3月份薪資', amount: 55000, date: '2026-03-20', account: '台銀帳戶' },
  { id: '4', icon: '🛍️', category: '購物', description: 'momo 購物 - 耳機', amount: -1290, date: '2026-03-20', account: '台銀帳戶' },
  { id: '5', icon: '📈', category: '投資收入', description: '股利入帳 - 0050', amount: 3500, date: '2026-03-18', account: '國泰證券' },
  { id: '6', icon: '🏠', category: '居住', description: '房租', amount: -12000, date: '2026-03-15', account: '台銀帳戶' },
  { id: '7', icon: '📱', category: '通訊', description: '中華電信', amount: -599, date: '2026-03-15', account: '台銀帳戶' },
  { id: '8', icon: '🎬', category: '娛樂', description: 'Netflix 訂閱', amount: -390, date: '2026-03-14', account: '台銀帳戶' },
];

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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">記帳</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-lg shadow-primary-500/25"
            >
              <Plus className="w-4 h-4" /> 新增
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium shadow-lg shadow-blue-500/25">
              <Camera className="w-4 h-4" /> OCR 掃描
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownLeft className="w-4 h-4 text-up" />
              <span className="text-xs text-gray-500">本月收入</span>
            </div>
            <p className="text-lg font-bold text-up">+{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-down" />
              <span className="text-xs text-gray-500">本月支出</span>
            </div>
            <p className="text-lg font-bold text-down">-{totalExpense.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">本月結餘</span>
            </div>
            <p className={`text-lg font-bold ${totalIncome - totalExpense >= 0 ? 'text-up' : 'text-down'}`}>
              {(totalIncome - totalExpense).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {[
                { key: 'all' as TxType, label: '全部' },
                { key: 'income' as TxType, label: '收入' },
                { key: 'expense' as TxType, label: '支出' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTxType(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    txType === tab.key
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100">
                <Calendar className="w-4 h-4" /> 3月
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100">
                <Filter className="w-4 h-4" /> 篩選
              </button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-1">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 px-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">
                    {tx.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{tx.description}</p>
                    <p className="text-xs text-gray-400">{tx.category} · {tx.account} · {tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.amount >= 0 ? 'text-up' : 'text-gray-700'}`}>
                  {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
