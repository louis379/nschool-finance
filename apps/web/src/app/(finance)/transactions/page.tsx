'use client';

import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Plus, Camera, Filter, Calendar,
  ArrowDownLeft, ArrowUpRight, Wallet,
  Utensils, Car, Banknote, ShoppingBag, TrendingUp,
  Home, Smartphone, Tv, X, LucideIcon, CheckCircle, Trash2,
  Upload, Loader2, ChevronDown,
} from 'lucide-react';

type TxType = 'all' | 'income' | 'expense';

type CategoryKey = '餐飲' | '交通' | '薪資' | '購物' | '投資收入' | '居住' | '通訊' | '娛樂';

const categoryConfig: Record<CategoryKey, { icon: LucideIcon; bg: string; text: string }> = {
  '餐飲':   { icon: Utensils,   bg: 'bg-orange-100', text: 'text-orange-500' },
  '交通':   { icon: Car,        bg: 'bg-sky-100',    text: 'text-sky-500' },
  '薪資':   { icon: Banknote,   bg: 'bg-green-100',  text: 'text-green-600' },
  '購物':   { icon: ShoppingBag, bg: 'bg-pink-100',  text: 'text-pink-500' },
  '投資收入': { icon: TrendingUp, bg: 'bg-primary-100', text: 'text-primary-500' },
  '居住':   { icon: Home,        bg: 'bg-amber-100',  text: 'text-amber-600' },
  '通訊':   { icon: Smartphone,  bg: 'bg-blue-100',   text: 'text-blue-500' },
  '娛樂':   { icon: Tv,          bg: 'bg-purple-100', text: 'text-purple-500' },
};

const expenseCategories: CategoryKey[] = ['餐飲', '交通', '購物', '居住', '通訊', '娛樂'];
const incomeCategories: CategoryKey[] = ['薪資', '投資收入'];
const fallbackConfig = { icon: Wallet, bg: 'bg-gray-100', text: 'text-gray-500' };

type Transaction = {
  id: string; category: CategoryKey; description: string;
  amount: number; date: string; account: string;
};


function groupByDate(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of txs) {
    if (!groups[tx.date]) groups[tx.date] = [];
    groups[tx.date].push(tx);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

function formatDateLabel(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  return new Intl.DateTimeFormat('zh-TW', { month: 'long', day: 'numeric' }).format(d);
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function TransactionsPage() {
  const [txType, setTxType] = useState<TxType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toast, setToast] = useState('');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [undoTx, setUndoTx] = useState<{ tx: Transaction; list: Transaction[] } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state
  const [formType, setFormType] = useState<'expense' | 'income'>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryKey>('餐飲');
  const [formDate, setFormDate] = useState(todayStr());
  const [formAccount, setFormAccount] = useState('台銀帳戶');
  const [accountList, setAccountList] = useState<string[]>(['台銀帳戶']);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nschool-transactions');
      if (saved) {
        setTransactions(JSON.parse(saved));
      }

      const accRaw = localStorage.getItem('nschool-accounts');
      if (accRaw) {
        const accs = JSON.parse(accRaw);
        const names = accs.map((a: { name: string }) => a.name);
        if (names.length > 0) {
          setAccountList(names);
          setFormAccount(names[0]);
        }
      }
    } catch {}
  }, []);

  // Deselect on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-tx-row]')) setSelectedTxId(null);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filtered = transactions.filter((tx) => {
    if (txType === 'income') return tx.amount > 0;
    if (txType === 'expense') return tx.amount < 0;
    return true;
  });

  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;
  const grouped = groupByDate(filtered);

  const availableCategories = formType === 'expense' ? expenseCategories : incomeCategories;

  function openModal() {
    // Restore last used category
    let lastCat: CategoryKey = '餐飲';
    try {
      const saved = localStorage.getItem('nschool-lastCategory');
      if (saved && categoryConfig[saved as CategoryKey]) lastCat = saved as CategoryKey;
    } catch {}

    setFormType('expense');
    setFormAmount('');
    setFormDesc('');
    setFormCategory(expenseCategories.includes(lastCat) ? lastCat : '餐飲');
    setFormDate(todayStr());
    setShowAddModal(true);
  }

  function handleTypeChange(type: 'expense' | 'income') {
    setFormType(type);
    setFormCategory(type === 'expense' ? '餐飲' : '薪資');
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function persist(list: Transaction[]) {
    try { localStorage.setItem('nschool-transactions', JSON.stringify(list)); } catch {}
  }

  function handleSave() {
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      category: formCategory,
      description: formDesc.trim() || formCategory,
      amount: formType === 'expense' ? -amount : amount,
      date: formDate,
      account: formAccount,
    };

    const updated = [newTx, ...transactions].sort((a, b) => b.date.localeCompare(a.date));
    setTransactions(updated);
    persist(updated);

    // Remember last category
    try { localStorage.setItem('nschool-lastCategory', formCategory); } catch {}

    setShowAddModal(false);
    showToast(`✅ 已新增${formType === 'expense' ? '支出' : '收入'} NT$ ${amount.toLocaleString()}`);
  }

  function handleDelete(txId: string) {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const prev = transactions;
    const updated = transactions.filter((t) => t.id !== txId);
    setTransactions(updated);
    persist(updated);
    setSelectedTxId(null);

    // Undo state
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoTx({ tx, list: prev });
    setToast(`🗑 已刪除「${tx.description}」`);

    undoTimerRef.current = setTimeout(() => {
      setUndoTx(null);
      setToast('');
    }, 3500);
  }

  function handleUndo() {
    if (!undoTx) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setTransactions(undoTx.list);
    persist(undoTx.list);
    setUndoTx(null);
    setToast('');
  }

  function handleOcrFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setOcrPreview(base64);
      setOcrLoading(true);

      try {
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (res.ok) {
          const data = await res.json();
          // Auto-fill form with OCR results
          if (data.amount) setFormAmount(Math.abs(data.amount).toString());
          if (data.description) setFormDesc(data.description);
          if (data.category && categoryConfig[data.category as CategoryKey]) {
            setFormCategory(data.category as CategoryKey);
          }
          setFormType(data.amount < 0 ? 'expense' : 'income');
          setShowOcrModal(false);
          setShowAddModal(true);
          showToast('OCR 辨識完成，請確認資料');
        } else {
          showToast('OCR 辨識失敗，請手動輸入');
          setShowOcrModal(false);
        }
      } catch {
        showToast('OCR 辨識失敗，請手動輸入');
        setShowOcrModal(false);
      } finally {
        setOcrLoading(false);
        setOcrPreview(null);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">記帳</h1>
            <p className="text-sm text-gray-400 mt-0.5">記錄每一筆收支，掌握財務狀況</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowOcrModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium shadow-md shadow-sky-400/30 hover:bg-sky-600 transition-colors"
            >
              <Camera className="w-4 h-4" /> OCR 掃描
            </button>
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md shadow-primary-400/30 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> 新增
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-lg bg-up/10 flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5 text-up" />
              </div>
              <span className="text-xs text-gray-400 font-medium">本月收入</span>
            </div>
            <p className="text-lg font-bold text-up tabular-nums">+NT$ {totalIncome.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-lg bg-down/10 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-down" />
              </div>
              <span className="text-xs text-gray-400 font-medium">本月支出</span>
            </div>
            <p className="text-lg font-bold text-down tabular-nums">-NT$ {totalExpense.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-[var(--radius-card)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${balance >= 0 ? 'bg-up/10' : 'bg-down/10'}`}>
                <Wallet className={`w-3.5 h-3.5 ${balance >= 0 ? 'text-up' : 'text-down'}`} />
              </div>
              <span className="text-xs text-gray-400 font-medium">本月結餘</span>
            </div>
            <p className={`text-lg font-bold tabular-nums ${balance >= 0 ? 'text-up' : 'text-down'}`}>
              {balance >= 0 ? '+' : ''}NT$ {balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[var(--radius-card)] p-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {([
                { key: 'all' as TxType, label: '全部' },
                { key: 'income' as TxType, label: '收入' },
                { key: 'expense' as TxType, label: '支出' },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTxType(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    txType === tab.key
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                <Calendar className="w-3.5 h-3.5" /> 3月
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                <Filter className="w-3.5 h-3.5" /> 篩選
              </button>
            </div>
          </div>

          {/* Grouped Transaction List */}
          {grouped.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">📋</p>
              {transactions.length === 0 ? (
                <>
                  <p className="text-gray-600 text-sm font-medium mb-1">記錄你的第一筆收支</p>
                  <p className="text-gray-400 text-xs mb-4">養成記帳習慣，清楚掌握每月收支流向</p>
                  <button
                    onClick={openModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white text-xs font-semibold rounded-xl hover:bg-primary-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> 快速新增
                  </button>
                </>
              ) : (
                <p className="text-gray-400 text-sm">沒有符合條件的記錄</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.map(([date, txs]) => {
                const dayTotal = txs.reduce((s, t) => s + t.amount, 0);
                return (
                  <div key={date}>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-bold text-gray-500">{formatDateLabel(date)}</span>
                      <span className={`text-xs font-semibold tabular-nums ${dayTotal >= 0 ? 'text-up' : 'text-gray-400'}`}>
                        {dayTotal >= 0 ? '+' : ''}NT$ {dayTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {txs.map((tx) => {
                        const cfg = categoryConfig[tx.category] ?? fallbackConfig;
                        const Icon = cfg.icon;
                        const isIncome = tx.amount >= 0;
                        const isSelected = selectedTxId === tx.id;
                        return (
                          <div
                            key={tx.id}
                            data-tx-row
                            className="relative overflow-hidden rounded-xl"
                          >
                            {/* Delete reveal layer */}
                            <div
                              className={`absolute inset-y-0 right-0 flex items-center justify-end pr-3 transition-all duration-200 ${
                                isSelected ? 'w-16 opacity-100' : 'w-0 opacity-0'
                              }`}
                            >
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                                className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-md active:scale-90 transition-transform"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>

                            {/* Row content */}
                            <div
                              onClick={() => setSelectedTxId(isSelected ? null : tx.id)}
                              style={{ transform: isSelected ? 'translateX(-52px)' : 'translateX(0)' }}
                              className="flex items-center justify-between py-2.5 px-2 -mx-2 mx-0 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                  <Icon className={`w-4 h-4 ${cfg.text}`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700 leading-snug">{tx.description}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{tx.category} · {tx.account}</p>
                                </div>
                              </div>
                              <span className={`text-sm font-bold tabular-nums shrink-0 ml-2 ${isIncome ? 'text-up' : 'text-gray-700'}`}>
                                {isIncome ? '+' : '-'}NT$ {Math.abs(tx.amount).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast with undo */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          <span>{toast}</span>
          {undoTx && (
            <button
              onClick={handleUndo}
              className="ml-1 text-primary-300 hover:text-primary-200 font-bold underline underline-offset-2"
            >
              復原
            </button>
          )}
        </div>
      )}

      {/* OCR Modal */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm modal-backdrop" onClick={() => { if (!ocrLoading) setShowOcrModal(false); }} />
          <div className="relative bg-white rounded-b-3xl md:rounded-2xl w-full max-w-sm p-6 pt-[max(1.5rem,env(safe-area-inset-top))] shadow-2xl modal-content">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">OCR 掃描收據</h3>
              <button onClick={() => setShowOcrModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {ocrLoading ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <p className="text-sm text-gray-500">AI 正在辨識收據...</p>
                {ocrPreview && (
                  <img src={ocrPreview} alt="preview" className="w-32 h-32 object-cover rounded-xl mt-2 opacity-50" />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center">拍照或上傳收據，AI 自動辨識金額與分類</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleOcrFile}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 py-8 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 hover:bg-sky-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-sky-600">拍照掃描</p>
                    <p className="text-xs text-gray-400 mt-1">開啟相機拍攝收據</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => handleOcrFile(e as unknown as React.ChangeEvent<HTMLInputElement>);
                    input.click();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-600 font-medium"
                >
                  <Upload className="w-4 h-4" /> 從相簿選擇
                </button>

                <p className="text-xs text-gray-400 text-center">支援 JPG、PNG 格式</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick-Add Bottom Sheet — 3 steps: ① amount ② category ③ save */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm modal-backdrop" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md shadow-2xl modal-content pb-[env(safe-area-inset-bottom,16px)]">
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-5 pt-3 pb-5">
              {/* Header with type toggle inline */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1 bg-gray-50 p-0.5 rounded-xl">
                  {(['支出', '收入'] as const).map((t) => {
                    const isActive = (t === '支出' && formType === 'expense') || (t === '收入' && formType === 'income');
                    return (
                      <button
                        key={t}
                        onClick={() => handleTypeChange(t === '支出' ? 'expense' : 'income')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? t === '支出' ? 'bg-down text-white shadow-sm' : 'bg-up text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 -mr-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Step 1: Amount — big, prominent */}
              <div className="mb-5">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-lg font-bold ${formType === 'expense' ? 'text-down' : 'text-up'}`}>NT$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    autoFocus
                    className="text-4xl font-extrabold text-center outline-none bg-transparent w-full max-w-[200px] tabular-nums placeholder:text-gray-200"
                  />
                </div>
              </div>

              {/* Step 2: Category — tap to select */}
              <div className="mb-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {availableCategories.map((cat) => {
                    const cfg = categoryConfig[cat];
                    const Icon = cfg.icon;
                    const isSelected = formCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFormCategory(cat)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-primary-500 text-white shadow-md shadow-primary-400/30 scale-105'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:scale-95'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cfg.text}`} />
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional: Expandable details (description, date, account) */}
              <details className="mb-4 group">
                <summary className="flex items-center justify-center gap-1 text-xs text-gray-400 cursor-pointer hover:text-gray-500 transition-colors py-1 select-none">
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                  更多選項
                </summary>
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    placeholder="備註（選填）"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">日期</p>
                      <input
                        type="date"
                        value={formDate}
                        max={todayStr()}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">帳戶</p>
                      <select
                        value={formAccount}
                        onChange={(e) => setFormAccount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all appearance-none"
                      >
                        {accountList.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </details>

              {/* Step 3: Save */}
              <button
                onClick={handleSave}
                disabled={!formAmount || parseFloat(formAmount) <= 0}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-400/30 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {formAmount && parseFloat(formAmount) > 0
                  ? `儲存 ${formType === 'expense' ? '支出' : '收入'} NT$ ${parseFloat(formAmount).toLocaleString()}`
                  : '輸入金額以儲存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
