'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  PlusCircle,
  Newspaper,
  User,
  LucideIcon,
} from 'lucide-react';

type NavItem = { href: string; icon: LucideIcon; label: string; isCenter?: boolean };

const navItems: NavItem[] = [
  { href: '/',             icon: Home,       label: '首頁' },
  { href: '/trade',        icon: BarChart3,   label: '交易' },
  { href: '/transactions', icon: PlusCircle,  label: '記帳', isCenter: true },
  { href: '/news',         icon: Newspaper,   label: '資訊' },
  { href: '/profile',      icon: User,        label: '我的' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur background */}
      <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center -mt-7"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/40 active:scale-95 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] mt-1 text-primary-500 font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-1 px-3 group"
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-primary-100 scale-110' : 'group-active:scale-95'
                }`}>
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
