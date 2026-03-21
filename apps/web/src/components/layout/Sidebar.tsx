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
  LucideIcon,
} from 'lucide-react';

type MenuItem = { href: string; icon: LucideIcon; label: string };
type MenuGroup = { title: string; items: MenuItem[] };

const menuGroups: MenuGroup[] = [
  {
    title: '總覽',
    items: [
      { href: '/', icon: Home, label: '儀表板' },
    ],
  },
  {
    title: '財務管理',
    items: [
      { href: '/accounts',     icon: Wallet,  label: '帳戶管理' },
      { href: '/transactions', icon: Receipt,  label: '記帳' },
      { href: '/accounts',     icon: Target,   label: '財務目標' },
    ],
  },
  {
    title: '投資交易',
    items: [
      { href: '/trade', icon: BarChart3,   label: '模擬交易' },
      { href: '/trade', icon: Eye,         label: '觀察名單' },
      { href: '/trade', icon: TrendingUp,  label: '投資組合' },
      { href: '/calculator', icon: Calculator,  label: '複利計算器' },
    ],
  },
  {
    title: '學習成長',
    items: [
      { href: '/news',  icon: Newspaper,     label: '財經資訊' },
      { href: '/learn', icon: GraduationCap, label: '學習路徑' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 h-screen sticky top-0 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
          <span className="text-white font-bold text-base">n</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-none">nSchool</h1>
          <p className="text-[10px] text-primary-400 mt-0.5 font-medium tracking-wide">FINANCE</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 mb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full" />
                    )}
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
            pathname === '/profile'
              ? 'bg-primary-50 text-primary-600'
              : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">我的帳戶</p>
            <p className="text-[10px] text-gray-400 mt-0.5">設定 & 個人資料</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
