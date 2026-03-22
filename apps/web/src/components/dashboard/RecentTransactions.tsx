'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Utensils, Car, Banknote, ShoppingBag, TrendingUp,
  Home, Smartphone, Tv, Wallet, LucideIcon,
} from 'lucide-react';

type CategoryKey = '餐飲' | '交通' | '薪資' | '購物' | '投資收入' | '居住' | '通訊' | '娛樂';

const categoryConfig: Record<CategoryKey, { icon: LucideIcon; bg: string; text: string }> = {
  '餐飲':   { icon: Utensils,    bg: 'bg-orange-100', text: 'text-orange-500' },
  '交通':   { icon: Car,         bg: 'bg-sky-100',    text: 'text-sky-500' },
  '薪資':   { icon: Banknote,    bg: 'bg-green-100',  text: 'text-green-600' },
  '購物':   { icon: ShoppingBag, bg: 'bg-pink-100',   text: 'text-pink-500' },
  '投資收入': { icon: TrendingUp,  bg: 'bg-primary-100', text: 'text-primary-500' },
  '居住':   { icon: Home,        bg: 'bg-amber-100',  text: 'text-amber-600' },
  '通訊':   { icon: Smartphone,  bg: 'bg-blue-100',   text: 'text-blue-500' },
  '娛樂':   { icon: Tv,          bg: 'bg-purple-100', text: 'text-purple-500' },
};

const fallbackConfig = { icon: Wallet, bg: 'bg-gray-100', text: 'text-gray-500' };

type Transaction = {
  id: string; category: CategoryKey; description: string;
  amount: number; date: string; account: string;
};

const defaultTransactions: Transaction[] = [
  { id: '1', category: '餐飲',   description: '午餐 - 便當',       amount: -120,   date: '2026-03-21', account: '台銀帳戶' },
  { id: '2', category: '交通',   description: 'YouBike 租借',       amount: -30,    date: '2026-03-21', account: '台銀帳戶' },
  { id: '3', category: '薪資',   description: '3月份薪資',          amount: 55000,  date: '2026-03-20', account: '台銀帳戶' },
  { id: '4', category: '購物',   description: 'momo 購物 - 耳機',   amount: -1290,  date: '2026-03-20', account: '台銀帳戶' },
  { id: '5', category: '投資收入', description: '股利入帳 - 0050',  amount: 3500,   date: '2026-03-18', account: '國泰證券' },
];

function formatDateLabel(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  return new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric' }).format(d);
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nschool-transactions');
      if (raw) {
        const txs: Transaction[] = JSON.parse(raw);
        setTransactions(txs.slice(0, 5));
      }
    } catch {}
  }, []);

  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">最近交易</h3>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 transition-colors font-medium"
        >
          查看全部 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-2xl mb-2">📋</p>
          <p className="text-gray-400 text-sm">尚無交易記錄</p>
          <Link href="/transactions" className="text-primary-500 text-sm font-medium mt-2 inline-block hover:underline">
            前往記帳
          </Link>
        </div>
      ) : (
        <div className="space-y-0.5">
          {transactions.map((tx) => {
            const config = categoryConfig[tx.category] ?? fallbackConfig;
            const Icon = config.icon;
            const isIncome = tx.amount >= 0;

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 leading-snug">{tx.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{tx.category} · {formatDateLabel(tx.date)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-up' : 'text-gray-800'}`}>
                    {isIncome ? '+' : '-'}NT$ {Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
