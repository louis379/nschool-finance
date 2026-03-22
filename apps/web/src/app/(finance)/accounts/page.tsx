'use client';

import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Building2, BarChart2, Bitcoin, Banknote,
  Plus, Target, Wallet, X,
  CheckCircle2, Clock, MoreHorizontal, LucideIcon,
  Trash2, Edit3, CheckCircle,
} from 'lucide-react';

type AccountType = 'bank' | 'broker' | 'crypto' | 'cash';

const accountTypeConfig: Record<AccountType, {
  icon: LucideIcon; bg: string; text: string; bar: string; label: string;
}> = {
  bank:   { icon: Building2, bg: 'bg-primary-100', text: 'text-primary-600', bar: 'bg-primary-400',  label: '銀行' },
  broker: { icon: BarChart2,  bg: 'bg-blue-100',    text: 'text-blue-600',    bar: 'bg-blue-400',    label: '券商' },
  crypto: { icon: Bitcoin,    bg: 'bg-amber-100',   text: 'text-amber-600',   bar: 'bg-amber-400',   label: '加密' },
  cash:   { icon: Banknote,   bg: 'bg-green-100',   text: 'text-green-600',   bar: 'bg-green-400',   label: '現金' },
};

type Account = { id: string; name: string; type: AccountType; balance: number; currency: string };
type Goal = { id: string; name: string; target: number; current: number; deadline: string; emoji: string };

const DEFAULT_ACCOUNTS: Account[] = [
  { id: '1', name: '台銀帳戶', type: 'bank',   balance: 450000, currency: 'TWD' },
  { id: '2', name: '國泰證券', type: 'broker', balance: 580000, currency: 'TWD' },
  { id: '3', name: 'Binance',  type: 'crypto', balance: 120000, currency: 'TWD' },
  { id: '4', name: '現金',     type: 'cash',   balance: 100000, currency: 'TWD' },
];

const DEFAULT_GOALS: Goal[] = [
  { id: '1', name: '緊急預備金', target: 360000,  current: 230000, deadline: '2026-12-31', emoji: '🛡️' },
  { id: '2', name: '購屋頭期款', target: 2000000, current: 680000, deadline: '2030-01-01', emoji: '🏠' },
  { id: '3', name: '出國旅遊',   target: 80000,   current: 80000,  deadline: '2026-06-30', emoji: '✈️' },
];

type Tab = 'accounts' | 'goals';

const ACCOUNTS_KEY = 'nschool-accounts';
const GOALS_KEY = 'nschool-goals';

function load<T>(key: string, def: T): T {
  try {
    if (typeof window === 'undefined') return def;
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch {}
  return def;
}

const GOAL_EMOJIS = ['🛡️', '🏠', '✈️', '🎓', '🚗', '💻', '🏖️', '💍', '👶', '🎯'];

export default function AccountsPage() {
  const [tab, setTab] = useState<Tab>('accounts');
  const [accounts, setAccounts] = useState<Account[]>(() => load(ACCOUNTS_KEY, DEFAULT_ACCOUNTS));
  const [goals, setGoals] = useState<Goal[]>(() => load(GOALS_KEY, DEFAULT_GOALS));

  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [undoData, setUndoData] = useState<{ type: 'account' | 'goal'; accounts: Account[]; goals: Goal[] } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add Account form
  const [accName, setAccName]     = useState('');
  const [accType, setAccType]     = useState<AccountType>('bank');
  const [accBalance, setAccBalance] = useState('');

  // Add Goal form
  const [goalName, setGoalName]       = useState('');
  const [goalTarget, setGoalTarget]   = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalEmoji, setGoalEmoji]     = useState('🎯');

  useEffect(() => {
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); } catch {}
  }, [accounts]);

  useEffect(() => {
    try { localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); } catch {}
  }, [goals]);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('[data-menu]')) setMenuOpen(null);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => { setToast(''); setUndoData(null); }, 3500);
  }

  function openModal() {
    setEditingAccount(null);
    setEditingGoal(null);
    setAccName(''); setAccType('bank'); setAccBalance('');
    setGoalName(''); setGoalTarget(''); setGoalCurrent(''); setGoalDeadline(''); setGoalEmoji('🎯');
    setShowModal(true);
  }

  function openEditAccount(acc: Account) {
    setEditingAccount(acc);
    setEditingGoal(null);
    setAccName(acc.name); setAccType(acc.type); setAccBalance(acc.balance.toString());
    setMenuOpen(null);
    setShowModal(true);
  }

  function openEditGoal(goal: Goal) {
    setEditingGoal(goal);
    setEditingAccount(null);
    setGoalName(goal.name); setGoalTarget(goal.target.toString());
    setGoalCurrent(goal.current.toString()); setGoalDeadline(goal.deadline); setGoalEmoji(goal.emoji);
    setMenuOpen(null);
    setShowModal(true);
  }

  function saveAccount() {
    const bal = parseFloat(accBalance) || 0;
    if (!accName.trim()) return;

    if (editingAccount) {
      setAccounts((prev) => prev.map((a) =>
        a.id === editingAccount.id ? { ...a, name: accName.trim(), type: accType, balance: bal } : a
      ));
      showToastMsg('已更新帳戶');
    } else {
      const newAcc: Account = { id: Date.now().toString(), name: accName.trim(), type: accType, balance: bal, currency: 'TWD' };
      setAccounts((prev) => [...prev, newAcc]);
      showToastMsg('已新增帳戶');
    }
    setShowModal(false);
  }

  function saveGoal() {
    const target = parseFloat(goalTarget) || 0;
    const current = parseFloat(goalCurrent) || 0;
    if (!goalName.trim() || !target) return;

    if (editingGoal) {
      setGoals((prev) => prev.map((g) =>
        g.id === editingGoal.id ? { ...g, name: goalName.trim(), target, current, deadline: goalDeadline || '2027-12-31', emoji: goalEmoji } : g
      ));
      showToastMsg('已更新目標');
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(), name: goalName.trim(),
        target, current, deadline: goalDeadline || '2027-12-31', emoji: goalEmoji,
      };
      setGoals((prev) => [...prev, newGoal]);
      showToastMsg('已新增目標');
    }
    setShowModal(false);
  }

  function deleteAccount(id: string) {
    const prevAccounts = accounts;
    const prevGoals = goals;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoData({ type: 'account', accounts: prevAccounts, goals: prevGoals });
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setMenuOpen(null);
    setToast('已刪除帳戶');
    undoTimerRef.current = setTimeout(() => { setUndoData(null); setToast(''); }, 3500);
  }

  function deleteGoal(id: string) {
    const prevAccounts = accounts;
    const prevGoals = goals;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoData({ type: 'goal', accounts: prevAccounts, goals: prevGoals });
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setMenuOpen(null);
    setToast('已刪除目標');
    undoTimerRef.current = setTimeout(() => { setUndoData(null); setToast(''); }, 3500);
  }

  function handleUndo() {
    if (!undoData) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setAccounts(undoData.accounts);
    setGoals(undoData.goals);
    setUndoData(null);
    setToast('');
  }

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {tab === 'accounts' ? '帳戶管理' : '財務目標'}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {tab === 'accounts' ? '管理你的所有資產帳戶' : '追蹤你的理財目標進度'}
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-md shadow-primary-400/30 hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {tab === 'accounts' ? '新增帳戶' : '新增目標'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1.5 rounded-2xl mb-6 shadow-sm">
          {([
            { key: 'accounts' as Tab, icon: Wallet,  label: '帳戶管理' },
            { key: 'goals'    as Tab, icon: Target,  label: '財務目標' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === key ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {tab === 'accounts' ? (
          <>
            {/* Total Balance Banner */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[var(--radius-card)] p-5 text-white mb-4 shadow-lg shadow-primary-500/20">
              <p className="text-primary-300 text-xs font-medium mb-1">所有帳戶總計</p>
              <p className="text-3xl font-bold tabular-nums">NT$ {totalBalance.toLocaleString()}</p>
              <p className="text-primary-300 text-sm mt-1">{accounts.length} 個帳戶</p>
              {totalBalance > 0 && (
                <>
                  <div className="flex gap-0.5 h-1 rounded-full overflow-hidden mt-4">
                    {accounts.map((a) => (
                      <div key={a.id} className={accountTypeConfig[a.type].bar} style={{ width: `${(a.balance / totalBalance) * 100}%` }} />
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    {accounts.map((a) => (
                      <div key={a.id} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${accountTypeConfig[a.type].bar}`} />
                        <span className="text-[11px] text-primary-300">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Account List */}
            <div className="space-y-3">
              {accounts.map((account) => {
                const cfg = accountTypeConfig[account.type];
                const Icon = cfg.icon;
                const pct = totalBalance > 0 ? ((account.balance / totalBalance) * 100).toFixed(1) : '0';

                return (
                  <div key={account.id} className="bg-white rounded-[var(--radius-card)] p-5 hover:shadow-md transition-all group relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${cfg.text}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-base font-semibold text-gray-800 truncate">{account.name}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">佔總資產 {pct}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-800 tabular-nums">NT$ {account.balance.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{account.currency}</p>
                        </div>
                        <div className="relative" data-menu>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === account.id ? null : account.id); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                          {menuOpen === account.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[120px]">
                              <button
                                onClick={() => openEditAccount(account)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> 編輯
                              </button>
                              <button
                                onClick={() => deleteAccount(account.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> 刪除
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${cfg.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const isComplete = pct >= 100;
              const remaining = goal.target - goal.current;

              return (
                <div
                  key={goal.id}
                  className={`bg-white rounded-[var(--radius-card)] p-5 border-2 transition-all hover:shadow-md group relative ${isComplete ? 'border-up/40' : 'border-transparent'}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">{goal.emoji}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-gray-800 truncate">{goal.name}</p>
                          {isComplete && <CheckCircle2 className="w-4 h-4 text-up shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>目標：{goal.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className={`text-2xl font-bold tabular-nums ${isComplete ? 'text-up' : 'text-primary-600'}`}>{pct}%</p>
                        {!isComplete && <p className="text-xs text-gray-400 tabular-nums mt-0.5">還差 NT$ {remaining.toLocaleString()}</p>}
                      </div>
                      <div className="relative" data-menu>
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === goal.id ? null : goal.id); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                        {menuOpen === goal.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[120px]">
                            <button
                              onClick={() => openEditGoal(goal)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> 編輯
                            </button>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> 刪除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-up' : 'bg-primary-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-400 tabular-nums">
                    <span>NT$ {goal.current.toLocaleString()}</span>
                    <span>NT$ {goal.target.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast with undo */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          <span>{toast}</span>
          {undoData && (
            <button onClick={handleUndo} className="ml-1 text-primary-300 hover:text-primary-200 font-bold underline underline-offset-2">
              復原
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-sm p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">
                {tab === 'accounts'
                  ? (editingAccount ? '編輯帳戶' : '新增帳戶')
                  : (editingGoal ? '編輯目標' : '新增目標')
                }
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {tab === 'accounts' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">帳戶名稱</label>
                  <input
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                    placeholder="例如：國泰世華"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">帳戶類型</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(accountTypeConfig) as [AccountType, typeof accountTypeConfig.bank][]).map(([key, cfg]) => {
                      const TypeIcon = cfg.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setAccType(key)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                            accType === key ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                            <TypeIcon className={`w-3.5 h-3.5 ${cfg.text}`} />
                          </div>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">目前餘額（NT$）</label>
                  <input
                    type="number"
                    value={accBalance}
                    onChange={(e) => setAccBalance(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  />
                </div>
                <button
                  onClick={saveAccount}
                  disabled={!accName.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingAccount ? '儲存變更' : '新增帳戶'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">目標名稱</label>
                  <input
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="例如：購屋頭期款"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">選擇圖示</label>
                  <div className="flex gap-2 flex-wrap">
                    {GOAL_EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setGoalEmoji(e)}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                          goalEmoji === e ? 'border-primary-400 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 font-medium block mb-1.5">目標金額（NT$）</label>
                    <input
                      type="number"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      placeholder="500000"
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-medium block mb-1.5">目前進度（NT$）</label>
                    <input
                      type="number"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">目標期限</label>
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  />
                </div>
                <button
                  onClick={saveGoal}
                  disabled={!goalName.trim() || !goalTarget}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingGoal ? '儲存變更' : '新增目標'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
