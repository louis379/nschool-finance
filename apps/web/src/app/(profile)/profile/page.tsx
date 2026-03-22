'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  User, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight,
  Star, BookOpen, BarChart3, Receipt, TrendingUp, Award, LucideIcon,
} from 'lucide-react';

type MenuItem = { icon: LucideIcon; label: string; description: string; iconBg: string; iconColor: string };

const menuItems: MenuItem[] = [
  { icon: User,       label: '個人資料', description: '編輯名稱、頭像等基本資料', iconBg: 'bg-primary-50', iconColor: 'text-primary-500' },
  { icon: Shield,     label: '風險偏好', description: '重新評估你的投資風格',     iconBg: 'bg-amber-50',   iconColor: 'text-amber-500' },
  { icon: Settings,   label: '帳戶設定', description: '密碼、連結 Google 帳號',   iconBg: 'bg-gray-100',  iconColor: 'text-gray-500' },
  { icon: HelpCircle, label: '幫助中心', description: '常見問題 & 聯絡客服',       iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
];

const stats = [
  { label: '記帳天數',  value: 32, icon: Receipt,   color: 'text-primary-500', bgColor: 'bg-primary-50', suffix: '天' },
  { label: '模擬交易',  value: 15, icon: BarChart3,  color: 'text-emerald-600', bgColor: 'bg-emerald-50', suffix: '筆' },
  { label: '完成課程',  value: 8,  icon: BookOpen,   color: 'text-blue-500',    bgColor: 'bg-blue-50',    suffix: '堂' },
];

const learningProgress = [
  { label: 'Level 1 理財觀念', percent: 63, color: 'bg-amber-400' },
  { label: 'Level 2 投資基礎', percent: 30, color: 'bg-primary-400' },
];

type NotificationSettings = {
  marketAlert: boolean;
  learnReminder: boolean;
  newsDigest: boolean;
  tradeAlert: boolean;
};

const defaultNotifications: NotificationSettings = {
  marketAlert: true,
  learnReminder: true,
  newsDigest: false,
  tradeAlert: true,
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        value ? 'bg-primary-500' : 'bg-gray-200'
      }`}
      role="switch"
      aria-checked={value}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nschool-notifications');
      if (saved) setNotifications(JSON.parse(saved));
    } catch {}
  }, []);

  function updateNotification(key: keyof NotificationSettings, value: boolean) {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    try { localStorage.setItem('nschool-notifications', JSON.stringify(updated)); } catch {}
  }

  function handleMenuClick(label: string) {
    if (label === '通知設定') {
      setShowNotifPanel((v) => !v);
    }
  }

  function handleLogout() {
    try {
      localStorage.removeItem('nschool-balance');
      localStorage.removeItem('nschool-holdings');
    } catch {}
    router.push('/login');
  }

  const allMenuItems: (MenuItem & { isTogglePanel?: boolean })[] = [
    ...menuItems.slice(0, 2),
    { icon: Bell, label: '通知設定', description: '管理行情、學習推播通知', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', isTogglePanel: true },
    ...menuItems.slice(2),
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* User Card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[var(--radius-card)] p-6 text-white shadow-lg shadow-primary-500/20">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-up rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold">投資新手</h2>
              <p className="text-primary-300 text-sm">user@example.com</p>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Level 2
                </span>
                <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                  穩健型投資者
                </span>
                <span className="flex items-center gap-1 text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                  <Award className="w-3 h-3 text-amber-300" />
                  280 積分
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Preview */}
          <div className="mt-5 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-300 text-xs">模擬投資組合</p>
                <p className="text-xl font-bold mt-0.5">NT$ 1,035,200</p>
              </div>
              <div className="text-right">
                <p className="text-primary-300 text-xs">總報酬</p>
                <p className="text-lg font-bold text-green-300 mt-0.5 flex items-center gap-1 justify-end">
                  <TrendingUp className="w-4 h-4" /> +3.52%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-[var(--radius-card)] p-4 text-center">
                <div className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-[18px] h-[18px] ${stat.color}`} />
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            學習進度
          </h3>
          <div className="space-y-3">
            {learningProgress.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-medium">{p.label}</span>
                  <span className="font-semibold">{p.percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 ${p.color} rounded-full transition-all duration-700`}
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-[var(--radius-card)] overflow-hidden">
          {allMenuItems.map((item, i) => {
            const Icon = item.icon;
            const isNotif = item.label === '通知設定';
            return (
              <div key={item.label}>
                <button
                  onClick={() => handleMenuClick(item.label)}
                  className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${
                    i < allMenuItems.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-[18px] h-[18px] ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  {isNotif ? (
                    <ChevronRight className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${showNotifPanel ? 'rotate-90' : ''}`} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                </button>

                {/* Notification panel (expanded inline) */}
                {isNotif && showNotifPanel && (
                  <div className="px-5 pb-4 bg-gray-50/50 border-b border-gray-50">
                    <div className="space-y-3 pt-2">
                      {[
                        { key: 'marketAlert' as const, label: '行情提醒', desc: '重要股價變動通知' },
                        { key: 'learnReminder' as const, label: '學習提醒', desc: '每日學習進度提醒' },
                        { key: 'tradeAlert' as const, label: '交易提醒', desc: '模擬交易結果通知' },
                        { key: 'newsDigest' as const, label: '新聞摘要', desc: '每日財經新聞整理' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{label}</p>
                            <p className="text-xs text-gray-400">{desc}</p>
                          </div>
                          <Toggle
                            value={notifications[key]}
                            onChange={(v) => updateNotification(key, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-card)] bg-white text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors font-medium text-sm border border-red-100"
        >
          <LogOut className="w-4 h-4" />
          登出帳號
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">nSchool Finance v0.1.0</p>
      </div>
    </AppLayout>
  );
}
