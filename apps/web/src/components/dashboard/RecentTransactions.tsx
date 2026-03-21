'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const mockTransactions = [
  { id: '1', category: '餐飲', icon: '🍽️', description: '午餐 - 便當', amount: -120, date: '今天' },
  { id: '2', category: '交通', icon: '🚗', description: 'YouBike', amount: -30, date: '今天' },
  { id: '3', category: '薪資', icon: '💰', description: '3月份薪資', amount: 55000, date: '昨天' },
  { id: '4', category: '購物', icon: '🛍️', description: 'momo 購物', amount: -1290, date: '昨天' },
  { id: '5', category: '投資收入', icon: '📈', description: '股利入帳 - 0050', amount: 3500, date: '3/18' },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">最近交易</h3>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600"
        >
          查看全部 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-1">
        {mockTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{tx.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-700">{tx.description}</p>
                <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold ${
                tx.amount >= 0 ? 'text-up' : 'text-gray-700'
              }`}
            >
              {tx.amount >= 0 ? '+' : ''}
              {tx.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
