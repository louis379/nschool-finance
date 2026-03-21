'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  Wallet,
  Receipt,
  Newspaper,
  GraduationCap,
  Calculator,
  User,
  Target,
  TrendingUp,
  Eye,
} from 'lucide-react';

const menuGroups = [
  {
    title: '總覽',
    items: [
      { href: '/', icon: Home, label: '儀表板' },
    ],
  },
  {
    title: '財務管理',
    items: [
      { href: '/accounts', icon: Wallet, label: '帳戶管理' },
      { href: '/transactions', icon: Receipt, label: '記帳' },
      { href: '/accounts', icon: Target, label: '財務目標' },
    ],
  },
  {
    title: '投資交易',
    items: [
      { href: '/trade', icon: BarChart3, label: '模擬交易' },
      { href: '/trade', icon: Eye, label: '觀察名單' },
      { href: '/trade', icon: TrendingUp, label: '投資組合' },
      { href: '/trade', icon: Calculator, label: '複利計算器' },
    ],
  },
  {
    title: '學習成長',
    items: [
      { href: '/news', icon: Newspaper, label: '財經資訊' },
      { href: '/learn', icon: GraduationCap, label: '學習路徑' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-primary-100 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">n</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary-800">nSchool</h1>
          <p className="text-[10px] text-primary-400">Finance</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.title}
            </h3>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-primary-50">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">我的帳戶</p>
            <p className="text-[10px] text-gray-400">設定 & 個人資料</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
