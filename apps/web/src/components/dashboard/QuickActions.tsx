'use client';

import Link from 'next/link';
import { Camera, PenLine, BarChart3, Calculator, BookOpen, Target } from 'lucide-react';

const actions = [
  { href: '/transactions', icon: PenLine, label: '記帳', color: 'from-primary-400 to-primary-500' },
  { href: '/transactions', icon: Camera, label: 'OCR 掃描', color: 'from-blue-400 to-blue-500' },
  { href: '/trade', icon: BarChart3, label: '交易', color: 'from-emerald-400 to-emerald-500' },
  { href: '/trade', icon: Calculator, label: '複利計算', color: 'from-amber-400 to-amber-500' },
  { href: '/learn', icon: BookOpen, label: '學習', color: 'from-pink-400 to-pink-500' },
  { href: '/accounts', icon: Target, label: '目標', color: 'from-teal-400 to-teal-500' },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">快速操作</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 group-hover:text-primary-500 transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
