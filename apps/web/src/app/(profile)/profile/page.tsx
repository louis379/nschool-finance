'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  User, Settings, Shield, Bell, HelpCircle, LogOut,
  Star, BookOpen, BarChart3, Receipt, TrendingUp, Award, LucideIcon,
  Edit2, ChevronDown, ChevronRight,
} from 'lucide-react';

const stats = [
  { label: '記帳天數', value: 32, icon: Receipt,  color: 'text-primary-500', bgColor: 'bg-primary-50' },
  { label: '模擬交易', value: 15, icon: BarChart3, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { label: '完成課程', value: 8,  icon: BookOpen,  color: 'text-blue-500',    bgColor: 'bg-blue-50' },
];

const learningProgress = [
  { label: 'Level 1 理財觀念', percent: 63, color: 'bg-amber-400' },
  { label: 'Level 2 投資基礎', percent: 30, color: 'bg-primary-400' },
];

type ToggleProps = { on: boolean; onChange: () => void };
function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${on ? 'bg-primary-500' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

type ActivePanel = 'notifications' | 'profile' | 'risk' | 'account' | 'help' | null;

export default function ProfilePage() {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [notifications, setNotifications] = useState({
    push: true, trading: true, price: true, learning: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [riskType, setRiskType] = useState('穩健型');

  function togglePanel(panel: ActivePanel) {
    setActivePanel((p) => p === panel ? null : panel);
  }

  const menuItems: { icon: LucideIcon; label: string; description: string; panel: ActivePanel; iconBg: string; iconColor: string }[] = [
    { icon: User,       label: '個人資料', description: '編輯名稱、頭像等基本資料', panel: 'profile',       iconBg: 'bg-primary-50', iconColor: 'text-primary-500' },
    { icon: Shield,     label: '風險偏好', description: '重新評估你的投資風格',     panel: 'risk',          iconBg: 'bg-amber-50',   iconColor: 'text-amber-500' },
    { icon: Bell,       label: '通知設定', description: '管理行情、學習推播通知',   panel: 'notifications', iconBg: 'bg-blue-50',    iconColor: 'text-blue-500' },
    { icon: Settings,   label: '帳戶設定', description: '密碼、連結 Google 帳號',   panel: 'account',       iconBg: 'bg-gray-100',   iconColor: 'text-gray-500' },
    { icon: HelpCircle, label: '幫助中心', description: '常見問題 & 聯絡客服',       panel: 'help',          iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
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
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">投資新手</h2>
                <button onClick={() => togglePanel('profile')} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-primary-300 text-sm">user@example.com</p>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" /> Level 2
                </span>
                <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">{riskType}投資者</span>
                <span className="flex items-center gap-1 text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">
                  <Award className="w-3 h-3 text-amber-300" /> 280 積分
                </span>
              </div>
            </div>
          </div>
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
                <Toggle on={notifications[key]} onChange={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))} />
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
                            <Toggle on={notifications[key]} onChange={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))} />
                          </div>
                        ))}
                      </div>
                    )}
                    {item.panel === 'profile' && (
                      <div className="space-y-3 pt-4">
                        <div>
                          <label className="text-xs text-gray-400 font-medium block mb-1.5">顯示名稱</label>
                          <input defaultValue="投資新手" className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors active:scale-95">
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
                            onClick={() => setRiskType(type)}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              riskType === type
                                ? 'border-primary-400 bg-primary-50 text-primary-700'
                                : 'border-gray-100 hover:border-gray-200 text-gray-600 bg-white'
                            }`}
                          >
                            {type} {riskType === type && '✓'}
                          </button>
                        ))}
                      </div>
                    )}
                    {item.panel === 'account' && (
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Google 帳號</p>
                            <p className="text-xs text-gray-400">user@example.com</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-600 font-medium">已連結</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-sm font-medium text-gray-700">深色模式</p>
                            <p className="text-xs text-gray-400">切換介面主題</p>
                          </div>
                          <Toggle on={darkMode} onChange={() => setDarkMode((v) => !v)} />
                        </div>
                      </div>
                    )}
                    {item.panel === 'help' && (
                      <div className="space-y-2 pt-4">
                        {(['如何開始使用？', '如何新增帳戶？', '模擬交易怎麼操作？', '如何聯絡客服？']).map((q) => (
                          <button key={q} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-100 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            {q} <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                          </button>
                        ))}
                        <a href="mailto:louis@howwork.org" className="block w-full text-center py-2.5 text-sm text-primary-600 font-medium hover:underline mt-2">
                          📧 louis@howwork.org 聯絡我們
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
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-card)] bg-white text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors font-medium text-sm border border-red-100">
          <LogOut className="w-4 h-4" /> 登出帳號
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">nSchool Finance v0.1.0</p>
      </div>
    </AppLayout>
  );
}
