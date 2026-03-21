'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  PlusCircle,
  Newspaper,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '首頁' },
  { href: '/trade', icon: BarChart3, label: '交易' },
  { href: '/transactions', icon: PlusCircle, label: '記帳', isCenter: true },
  { href: '/news', icon: Newspaper, label: '資訊' },
  { href: '/profile', icon: User, label: '我的' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-primary-100 md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] mt-1 text-primary-500 font-medium">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-primary-500' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-[10px] transition-colors ${
                  isActive ? 'text-primary-500 font-medium' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
