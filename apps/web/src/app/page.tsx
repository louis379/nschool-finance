'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AssetOverview from '@/components/dashboard/AssetOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import MarketOverview from '@/components/dashboard/MarketOverview';
import FinancialHealth from '@/components/dashboard/FinancialHealth';
import { Sparkles, CalendarDays } from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return { text: '夜深了', sub: '注意休息，財務管理明天繼續 💪' };
  if (hour < 12) return { text: '早安', sub: '美好的一天從了解財務開始 ☀️' };
  if (hour < 18) return { text: '午安', sub: '來看看今天的財務狀況吧 🌤️' };
  return { text: '晚安', sub: '回顧今天的收支，做好記錄 🌆' };
}

function getFormattedDate() {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
}

export default function DashboardPage() {
  const greeting = getGreeting();
  const today = getFormattedDate();
  const [displayName, setDisplayName] = useState('投資新手');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nschool-profile');
      if (raw) {
        const profile = JSON.parse(raw);
        if (profile.displayName) setDisplayName(profile.displayName);
      }
    } catch {}
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {greeting.text}，{displayName}！
            </h1>
            <p className="text-sm text-gray-400 mt-1">{greeting.sub}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{today}</span>
            </div>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl text-sm font-medium transition-colors shrink-0">
            <Sparkles className="w-4 h-4" />
            AI 財務分析
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <AssetOverview />
            <QuickActions />
            <RecentTransactions />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <FinancialHealth />
            <MarketOverview />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
