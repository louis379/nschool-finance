'use client';

import Link from 'next/link';
import { Camera, PenLine, BarChart3, Calculator, BookOpen, Target, LucideIcon } from 'lucide-react';

type Action = {
  href: string;
  icon: LucideIcon;
  label: string;
  gradient: string;
  shadow: string;
};

const actions: Action[] = [
  {
    href: '/transactions',
    icon: PenLine,
    label: '記帳',
    gradient: 'from-primary-400 to-primary-600',
    shadow: 'shadow-primary-400/40',
  },
  {
    href: '/transactions',
    icon: Camera,
    label: 'OCR 掃描',
    gradient: 'from-sky-400 to-blue-500',
    shadow: 'shadow-sky-400/40',
  },
  {
    href: '/trade',
    icon: BarChart3,
    label: '模擬交易',
    gradient: 'from-emerald-400 to-emerald-600',
    shadow: 'shadow-emerald-400/40',
  },
  {
    href: '/trade',
    icon: Calculator,
    label: '複利計算',
    gradient: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-400/40',
  },
  {
    href: '/learn',
    icon: BookOpen,
    label: '學習路徑',
    gradient: 'from-pink-400 to-rose-500',
    shadow: 'shadow-pink-400/40',
  },
  {
    href: '/accounts',
    icon: Target,
    label: '財務目標',
    gradient: 'from-teal-400 to-cyan-500',
    shadow: 'shadow-teal-400/40',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">快速操作</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 group py-1"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md ${action.shadow} group-hover:scale-110 group-hover:shadow-lg transition-all duration-200 ease-out`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] text-gray-500 group-hover:text-primary-500 transition-colors text-center leading-tight font-medium">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
