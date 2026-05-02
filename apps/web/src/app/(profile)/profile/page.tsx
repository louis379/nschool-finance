'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { createClient } from '@/lib/supabase/client';
import PnlCurveCard from './PnlCurveCard';
import {
  User, Settings, Shield, Bell, HelpCircle, LogOut,
  Star, BookOpen, BarChart3, Receipt, TrendingUp, Award, LucideIcon,
  Edit2, ChevronDown, ChevronRight,
} from 'lucide-react';

const PROFILE_KEY = 'nschool-profile';

type ProfileData = {
  displayName: string;
  riskType: string;
  notifications: { push: boolean; trading: boolean; price: boolean; learning: boolean };
  darkMode: boolean;
};

const defaultProfile: ProfileData = {
  displayName: '投資新手',
  riskType: '穩健型',
  notifications: { push: true, trading: true, price: true, learning: false },
  darkMode: false,
};

function loadProfile(): ProfileData {
  try {
    if (typeof window === 'undefined') return defaultProfile;
    const s = localStorage.getItem(PROFILE_KEY);
    if (s) return { ...defaultProfile, ...JSON.parse(s) };
  } catch {}
  return defaultProfile;
}

function saveProfile(data: ProfileData) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(data)); } catch {}
}

type ToggleProps = { on: boolean; onChange: () => void };
function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      style={{ minHeight: 0, minWidth: 0 }}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none overflow-hidden shrink-0 ${on ? 'bg-primary-500' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

type ActivePanel = 'notifications' | 'profile' | 'risk' | 'account' | 'help' | null;

function useStats() {
  const [stats, setStats] = useState([
    { label: '記帳天數', value: 0, icon: Receipt,  color: 'text-primary-500', bgColor: 'bg-primary-50' },
    { label: '模擬交易', value: 0, icon: BarChart3, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: '完成課程', value: 0, icon: BookOpen,  color: 'text-blue-500',    bgColor: 'bg-blue-50' },
  ]);

  useEffect(() => {
    try {
      // Count unique transaction dates
      const txRaw = localStorage.getItem('nschool-transactions');
      const txs = txRaw ? JSON.parse(txRaw) : [];
      const uniqueDays = new Set(txs.map((t: { date: string }) => t.date)).size;

      // Count completed courses
      const courseRaw = localStorage.getItem('nschool-courses');
      const courses = courseRaw ? JSON.parse(courseRaw) : [];
      const completedCourses = courses.filter((c: { completed?: boolean }) => c.completed).length;

      setStats([
        { label: '記帳天數', value: uniqueDays || 0,       icon: Receipt,  color: 'text-primary-500', bgColor: 'bg-primary-50' },
        { label: '模擬交易', value: 0,                      icon: BarChart3, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { label: '完成課程', value: completedCourses || 0,   icon: BookOpen,  color: 'text-blue-500',    bgColor: 'bg-blue-50' },
      ]);
    } catch {}
  }, []);

  return stats;
}

function usePortfolioStats() {
  const [portfolio, setPortfolio] = useState({ total: 0, returnPct: 0 });

  useEffect(() => {
    try {
      // Calculate from accounts (real balances)
      const accRaw = localStorage.getItem('nschool-accounts');
      const accounts = accRaw ? JSON.parse(accRaw) : [];
      const accountTotal = accounts.reduce((s: number, a: { balance: number }) => s + a.balance, 0);

      // Calculate from trading holdings (simulated portfolio)
      const holdRaw = localStorage.getItem('nschool-holdings');
      const holdings = holdRaw ? JSON.parse(holdRaw) : [];
      const balRaw = localStorage.getItem('nschool-balance');
      const tradeBalance = balRaw ? parseFloat(balRaw) : 100000;

      const holdingsValue = holdings.reduce((s: number, h: { currentPrice: number; qty: number }) => s + h.currentPrice * h.qty, 0);
      const invested = holdings.reduce((s: number, h: { avgCost: number; qty: number }) => s + h.avgCost * h.qty, 0);

      const total = accountTotal > 0 ? accountTotal : tradeBalance + holdingsValue;
      const initialCapital = 100000; // simulated starting capital
      const returnPct = invested > 0
        ? ((holdingsValue - invested) / invested) * 100
        : 0;

      setPortfolio({ total, returnPct });
    } catch {}
  }, []);

  return portfolio;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [editName, setEditName] = useState('');
  const [toast, setToast] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const stats = useStats();
  const portfolio = usePortfolioStats();

  async function handleLogout() {
    setLoggingOut(true);
    try {
      // Call server-side logout to properly clear cookies
      await fetch('/api/auth/logout', { method: 'POST' });
      // Also sign out on client side
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore errors, still redirect
    } finally {
      // Force hard navigation to clear all client state
      window.location.href = '/login';
    }
  }

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
    setEditName(loaded.displayName);
  }, []);

  function updateProfile(update: Partial<ProfileData>) {
    setProfile((prev) => {
      const next = { ...prev, ...update };
      saveProfile(next);
      return next;
    });
  }

  function togglePanel(panel: ActivePanel) {
    setActivePanel((p) => p === panel ? null : panel);
  }

  function handleSaveName() {
    if (!editName.trim()) return;
    updateProfile({ displayName: editName.trim() });
    setToast('已儲存');
    setTimeout(() => setToast(''), 2000);
  }

  const menuItems: { icon: LucideIcon; label: string; description: string; panel: ActivePanel; iconBg: string; iconColor: string }[] = [
    { icon: User,       label: '個人資料', description: '編輯名稱、頭像等基本資料', panel: 'profile',       iconBg: 'bg-primary-50', iconColor: 'text-primary-500' },
    { icon: Shield,     label: '風險偏好', description: '重新評估你的投資風格',     panel: 'risk',          iconBg: 'bg-amber-50',   iconColor: 'text-amber-500' },
    { icon: Bell,       label: '通知設定', description: '管理行情、學習推播通知',   panel: 'notifications', iconBg: 'bg-blue-50',    iconColor: 'text-blue-500' },
    { icon: Settings,   label: '帳戶設定', description: '密碼、連結 Google 帳號',   panel: 'account',       iconBg: 'bg-gray-100',   iconColor: 'text-gray-500' },
    { icon: HelpCircle, label: '幫助中心', description: '常見問題 & 聯絡客服',       panel: 'help',          iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  ];

  const [learningProgress, setLearningProgress] = useState([
    { label: 'Level 1 理財觀念', percent: 0, color: 'bg-amber-400', total: 8 },
    { label: 'Level 2 投資基礎', percent: 0, color: 'bg-primary-400', total: 10 },
    { label: 'Level 3 技術分析', percent: 0, color: 'bg-blue-400', total: 12 },
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nschool-lesson-progress');
      if (raw) {
        const progress = JSON.parse(raw);
        const modules = [
          { id: '1', label: 'Level 1 理財觀念', total: 8, color: 'bg-amber-400' },
          { id: '2', label: 'Level 2 投資基礎', total: 10, color: 'bg-primary-400' },
          { id: '3', label: 'Level 3 技術分析', total: 12, color: 'bg-blue-400' },
        ];
        setLearningProgress(modules.map((m) => ({
          label: m.label,
          color: m.color,
          total: m.total,
          percent: progress[m.id] ? Math.round((progress[m.id].length / m.total) * 100) : 0,
        })));
      }
    } catch {}
  }, []);

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
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{profile.displayName}</h2>
                <button onClick={() => togglePanel('profile')} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" /> Level 2
                </span>
                <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">{profile.riskType}投資者</span>
                <span className="flex items-center gap-1 text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                  <Award className="w-3 h-3 text-amber-300" /> 280 積分
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-300 text-xs">總資產</p>
                <p className="text-xl font-bold mt-0.5">NT$ {portfolio.total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-300 text-xs">總報酬</p>
                <p className={`text-lg font-bold mt-0.5 flex items-center gap-1 justify-end ${portfolio.returnPct >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  <TrendingUp className="w-4 h-4" /> {portfolio.returnPct >= 0 ? '+' : ''}{portfolio.returnPct.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PnL Curve */}
        <PnlCurveCard />

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
            <BookOpen className="w-4 h-4 text-primary-500" /> 學習進度
          </h3>
          <div className="space-y-3">
            {learningProgress.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-medium">{p.label}</span>
                  <span className="font-semibold">{p.percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-2 ${p.color} rounded-full transition-all duration-700`} style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Notification Toggles */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" /> 快速設定
          </h3>
          <div className="space-y-4">
            {([
              { key: 'push'     as const, label: '推播通知', desc: '接收所有平台通知' },
              { key: 'trading'  as const, label: '交易提醒', desc: '模擬交易成交通知' },
              { key: 'price'    as const, label: '行情提醒', desc: '追蹤股票價格警示' },
              { key: 'learning' as const, label: '學習提醒', desc: '每日學習進度提醒' },
            ]).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Toggle
                  on={profile.notifications[key]}
                  onChange={() => updateProfile({
                    notifications: { ...profile.notifications, [key]: !profile.notifications[key] },
                  })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-[var(--radius-card)] overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isOpen = activePanel === item.panel;
            return (
              <div key={item.label} className={i < menuItems.length - 1 ? 'border-b border-gray-50' : ''}>
                <button
                  onClick={() => togglePanel(item.panel)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
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
                  <ChevronDown className={`w-4 h-4 text-gray-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 bg-gray-50/60 border-t border-gray-50">
                    {item.panel === 'notifications' && (
                      <div className="space-y-4 pt-4">
                        {([
                          { key: 'push'     as const, label: '推播通知', desc: '接收所有平台通知' },
                          { key: 'trading'  as const, label: '交易提醒', desc: '模擬交易成交通知' },
                          { key: 'price'    as const, label: '行情提醒', desc: '追蹤股票價格警示' },
                          { key: 'learning' as const, label: '學習提醒', desc: '每日學習進度提醒' },
                        ]).map(({ key, label, desc }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{label}</p>
                              <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                            <Toggle
                              on={profile.notifications[key]}
                              onChange={() => updateProfile({
                                notifications: { ...profile.notifications, [key]: !profile.notifications[key] },
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {item.panel === 'profile' && (
                      <div className="space-y-3 pt-4">
                        <div>
                          <label className="text-xs text-gray-400 font-medium block mb-1.5">顯示名稱</label>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                          />
                        </div>
                        <button
                          onClick={handleSaveName}
                          className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors active:scale-95"
                        >
                          儲存變更
                        </button>
                      </div>
                    )}
                    {item.panel === 'risk' && (
                      <div className="space-y-2 pt-4">
                        <p className="text-xs text-gray-400 mb-3">選擇最符合你的投資風格</p>
                        {(['保守型', '穩健型', '積極型', '高風險型']).map((type) => (
                          <button
                            key={type}
                            onClick={() => updateProfile({ riskType: type })}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              profile.riskType === type
                                ? 'border-primary-400 bg-primary-50 text-primary-700'
                                : 'border-gray-100 hover:border-gray-200 text-gray-600 bg-white'
                            }`}
                          >
                            {type} {profile.riskType === type && '✓'}
                          </button>
                        ))}
                      </div>
                    )}
                    {item.panel === 'account' && (
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Google 帳號</p>
                            <p className="text-xs text-gray-400">尚未連結</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-500 font-medium">待連結</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-sm font-medium text-gray-700">深色模式</p>
                            <p className="text-xs text-gray-400">切換介面主題</p>
                          </div>
                          <Toggle on={profile.darkMode} onChange={() => updateProfile({ darkMode: !profile.darkMode })} />
                        </div>
                      </div>
                    )}
                    {item.panel === 'help' && (
                      <div className="space-y-2 pt-4">
                        {([
                          { q: '如何開始使用？', a: '從「記帳」頁面開始記錄收支，逐步建立財務概況。' },
                          { q: '如何新增帳戶？', a: '前往「帳戶」頁面，點擊右上角「新增帳戶」即可。' },
                          { q: '模擬交易怎麼操作？', a: '進入「交易」頁面，搜尋股票後即可進行模擬買賣。' },
                          { q: '如何聯絡客服？', a: '直接寄信至下方的電子郵件地址。' },
                        ]).map(({ q, a }) => (
                          <details key={q} className="group">
                            <summary className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-100 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer list-none">
                              {q} <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 transition-transform group-open:rotate-90" />
                            </summary>
                            <p className="px-4 py-2 text-xs text-gray-500 leading-relaxed">{a}</p>
                          </details>
                        ))}
                        <a href="mailto:louis@howwork.org" className="block w-full text-center py-2.5 text-sm text-primary-600 font-medium hover:underline mt-2">
                          louis@howwork.org 聯絡我們
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-card)] bg-white text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors font-medium text-sm border border-red-100 disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" /> {loggingOut ? '登出中...' : '登出帳號'}
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">nSchool Finance v0.1.0</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium">
          {toast}
        </div>
      )}
    </AppLayout>
  );
}
