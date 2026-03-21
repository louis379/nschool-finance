'use client';

import AppLayout from '@/components/layout/AppLayout';
import { User, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Star } from 'lucide-react';

const menuItems = [
  { icon: User, label: '個人資料', href: '#', description: '編輯你的基本資料' },
  { icon: Shield, label: '風險偏好', href: '#', description: '重新設定投資風格' },
  { icon: Bell, label: '通知設定', href: '#', description: '管理推播通知' },
  { icon: Settings, label: '帳戶設定', href: '#', description: '密碼、連結帳號' },
  { icon: HelpCircle, label: '幫助中心', href: '#', description: '常見問題 & 客服' },
];

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* User Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-[var(--radius-card)] p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">投資新手</h2>
              <p className="text-primary-200 text-sm">user@example.com</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-amber-300" /> Level 2
                </span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  穩健型投資者
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-[var(--radius-card)] p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">32</p>
            <p className="text-xs text-gray-500 mt-1">記帳天數</p>
          </div>
          <div className="bg-white rounded-[var(--radius-card)] p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">15</p>
            <p className="text-xs text-gray-500 mt-1">模擬交易</p>
          </div>
          <div className="bg-white rounded-[var(--radius-card)] p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">8</p>
            <p className="text-xs text-gray-500 mt-1">完成課程</p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-[var(--radius-card)] overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                  i < menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </a>
            );
          })}
        </div>

        {/* Logout */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-card)] bg-white text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">登出</span>
        </button>
      </div>
    </AppLayout>
  );
}
