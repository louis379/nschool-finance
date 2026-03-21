'use client';

import Link from 'next/link';
import { ArrowRight, Utensils, Car, Banknote, ShoppingBag, TrendingUp, LucideIcon } from 'lucide-react';

type CategoryKey = '餐飲' | '交通' | '薪資' | '購物' | '投資收入';

const categoryConfig: Record<CategoryKey, { icon: LucideIcon; bg: string; text: string }> = {
  '餐飲':   { icon: Utensils,    bg: 'bg-orange-100', text: 'text-orange-500' },
  '交通':   { icon: Car,         bg: 'bg-sky-100',    text: 'text-sky-500' },
  '薪資':   { icon: Banknote,    bg: 'bg-green-100',  text: 'text-green-600' },
  '購物':   { icon: ShoppingBag, bg: 'bg-pink-100',   text: 'text-pink-500' },
  '投資收入': { icon: TrendingUp,  bg: 'bg-primary-100', text: 'text-primary-500' },
};

const mockTransactions = [
  { id: '1', category: '餐飲' as CategoryKey,    description: '午餐 - 便當',      amount: -120,  date: '今天' },
  { id: '2', category: '交通' as CategoryKey,    description: 'YouBike',          amount: -30,   date: '今天' },
  { id: '3', category: '薪資' as CategoryKey,    description: '3月份薪資',         amount: 55000, date: '昨天' },
  { id: '4', category: '購物' as CategoryKey,    description: 'momo 購物',         amount: -1290, date: '昨天' },
  { id: '5', category: '投資收入' as CategoryKey, description: '股利入帳 - 0050',  amount: 3500,  date: '3/18' },
];

export default function RecentTransactions() {
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

      <div className="space-y-0.5">
        {mockTransactions.map((tx) => {
          const config = categoryConfig[tx.category];
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
                  <p className="text-xs text-gray-400 mt-0.5">{tx.category} · {tx.date}</p>
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
    </div>
  );
}
