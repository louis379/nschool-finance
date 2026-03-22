'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, BookOpen, TrendingUp, BarChart3,
  Check, X, QrCode, Bell,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type UserLevel = 'beginner' | 'intermediate' | 'experienced';
type GoalKey = 'emergency' | 'invest' | 'budgeting' | 'house' | 'retirement';
type InvestType = 'stock' | 'etf' | 'crypto' | 'insurance' | 'none';
type BalanceRange = 'under10' | '10to50' | '50to100' | 'over100';
type MonthlySaving = '3k' | '5k' | '10k' | '20k' | '30kplus';

// ── Constants ─────────────────────────────────────────────────────────────────

const BANKS = [
  { id: 'taiban',    name: '台銀',   color: '#005BAC' },
  { id: 'cathay',   name: '國泰',   color: '#00703C' },
  { id: 'ctbc',     name: '中信',   color: '#C8102E' },
  { id: 'esun',     name: '玉山',   color: '#F7941D' },
  { id: 'fubon',    name: '富邦',   color: '#E30613' },
  { id: 'taishin',  name: '台新',   color: '#EF3E42' },
  { id: 'sinopac',  name: '永豐',   color: '#005B99' },
  { id: 'firstbank',name: '第一',   color: '#003087' },
];

const BALANCE_RANGES: { key: BalanceRange; label: string; value: number }[] = [
  { key: 'under10',  label: '10 萬以下',   value: 50000 },
  { key: '10to50',   label: '10–50 萬',    value: 300000 },
  { key: '50to100',  label: '50–100 萬',   value: 750000 },
  { key: 'over100',  label: '100 萬以上',  value: 1500000 },
];

const INVEST_TYPES: { key: InvestType; emoji: string; label: string }[] = [
  { key: 'stock',     emoji: '📈', label: '股票' },
  { key: 'etf',       emoji: '💼', label: '基金 / ETF' },
  { key: 'crypto',    emoji: '₿',  label: '加密貨幣' },
  { key: 'insurance', emoji: '🛡️', label: '保險' },
  { key: 'none',      emoji: '🔰', label: '都還沒有' },
];

const GOALS: { key: GoalKey; emoji: string; label: string }[] = [
  { key: 'emergency',  emoji: '🛡️', label: '存緊急預備金' },
  { key: 'invest',     emoji: '📈', label: '開始投資' },
  { key: 'budgeting',  emoji: '📒', label: '記帳管理' },
  { key: 'house',      emoji: '🏠', label: '買房' },
  { key: 'retirement', emoji: '🏖️', label: '退休規劃' },
];

const MONTHLY_SAVINGS: { key: MonthlySaving; label: string; value: number }[] = [
  { key: '3k',      label: '3,000',    value: 3000 },
  { key: '5k',      label: '5,000',    value: 5000 },
  { key: '10k',     label: '10,000',   value: 10000 },
  { key: '20k',     label: '20,000',   value: 20000 },
  { key: '30kplus', label: '3 萬以上', value: 30000 },
];

const LEVELS: { key: UserLevel; icon: typeof BookOpen; title: string; desc: string }[] = [
  { key: 'beginner',     icon: BookOpen,  title: '完全新手',     desc: '從零開始，想學投資理財基礎' },
  { key: 'intermediate', icon: TrendingUp, title: '有一點經驗',  desc: '知道基金、股票，想更有系統' },
  { key: 'experienced',  icon: BarChart3, title: '有經驗的投資者', desc: '已在投資，想要更好的管理工具' },
];

// ── AI Score & Recommendations ─────────────────────────────────────────────────

function computeInitialScore(
  balance: BalanceRange | null,
  investTypes: Set<InvestType>,
  goals: Set<GoalKey>,
  saving: MonthlySaving | null,
  level: UserLevel,
): { score: number; firstStep: string; courses: string[] } {
  let score = 30; // base

  // Balance score
  if (balance === 'under10') score += 5;
  else if (balance === '10to50') score += 15;
  else if (balance === '50to100') score += 25;
  else if (balance === 'over100') score += 35;

  // Investment diversity
  const hasInvest = !investTypes.has('none');
  if (hasInvest) score += investTypes.size * 8;

  // Goals
  if (goals.size > 0) score += Math.min(goals.size * 5, 15);

  // Monthly saving
  if (saving === '3k') score += 2;
  else if (saving === '5k') score += 5;
  else if (saving === '10k') score += 10;
  else if (saving === '20k' || saving === '30kplus') score += 15;

  score = Math.max(15, Math.min(85, score));

  // First step based on level
  const firstStepMap: Record<UserLevel, string> = {
    beginner:     '先從「學習中心」第一課開始，建立理財基礎觀念',
    intermediate: '開始模擬交易，測試你的投資策略',
    experienced:  '連結所有帳戶，用 AI 分析優化你的資產配置',
  };

  // Course recommendations
  const coursesMap: Record<UserLevel, string[]> = {
    beginner:     ['理財觀念入門', '投資基礎知識', '技術分析基礎'],
    intermediate: ['技術分析基礎', '基本面分析', '資產配置策略'],
    experienced:  ['基本面分析', '資產配置策略', '技術分析基礎'],
  };

  return {
    score,
    firstStep: firstStepMap[level],
    courses: coursesMap[level],
  };
}

// ── Animation variants ─────────────────────────────────────────────────────────

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
};

// ── Main Component ─────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  // Step 1
  const [level, setLevel] = useState<UserLevel | null>(null);
  // Step 2
  const [banks, setBanks] = useState<Set<string>>(new Set());
  const [balance, setBalance] = useState<BalanceRange | null>(null);
  const [investTypes, setInvestTypes] = useState<Set<InvestType>>(new Set());
  // Step 3
  const [goals, setGoals] = useState<Set<GoalKey>>(new Set());
  const [saving, setSaving] = useState<MonthlySaving | null>(null);
  // LINE
  const [lineToken, setLineToken] = useState('');
  const [lineLinked, setLineLinked] = useState(false);

  const TOTAL = 6; // 0:welcome 1:level 2:asset 3:goals 4:line 5:result

  function goTo(n: number) {
    setDir(n > step ? 1 : -1);
    setStep(n);
  }

  function toggleBank(id: string) {
    setBanks(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleInvest(key: InvestType) {
    setInvestTypes(prev => {
      const n = new Set(prev);
      if (key === 'none') return new Set(['none'] as InvestType[]);
      n.delete('none');
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  }
  function toggleGoal(key: GoalKey) {
    setGoals(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  function saveAndFinish() {
    const balanceValue = BALANCE_RANGES.find(b => b.key === balance)?.value ?? 0;
    const savingValue = MONTHLY_SAVINGS.find(s => s.key === saving)?.value ?? 0;
    const levelStr = level ?? 'beginner';

    // nschool-user-profile (new key)
    localStorage.setItem('nschool-user-profile', JSON.stringify({
      level: levelStr,
      goals: Array.from(goals),
      banks: Array.from(banks),
      balanceRange: balance,
      investTypes: Array.from(investTypes),
      monthlySaving: saving,
    }));

    // nschool-profile (compat)
    localStorage.setItem('nschool-profile', JSON.stringify({
      displayName: '投資新手',
      riskType: levelStr === 'beginner' ? '保守型' : levelStr === 'intermediate' ? '穩健型' : '積極型',
      notifications: lineLinked,
      darkMode: false,
    }));

    // Build accounts from bank selections
    const savedAccounts = Array.from(banks).map((bankId, i) => {
      const bank = BANKS.find(b => b.id === bankId);
      return {
        id: String(i + 1),
        name: bank ? `${bank.name}帳戶` : '銀行帳戶',
        type: 'bank',
        balance: Math.round(balanceValue / Math.max(banks.size, 1)),
        currency: 'TWD',
      };
    });

    // Add broker/crypto accounts if investments
    if (investTypes.has('stock') || investTypes.has('etf')) {
      savedAccounts.push({
        id: String(savedAccounts.length + 1),
        name: '證券帳戶',
        type: 'broker',
        balance: 0,
        currency: 'TWD',
      });
    }
    if (investTypes.has('crypto')) {
      savedAccounts.push({
        id: String(savedAccounts.length + 1),
        name: '加密貨幣',
        type: 'crypto',
        balance: 0,
        currency: 'TWD',
      });
    }

    if (savedAccounts.length === 0 && balanceValue > 0) {
      savedAccounts.push({
        id: '1',
        name: '我的帳戶',
        type: 'bank',
        balance: balanceValue,
        currency: 'TWD',
      });
    }

    localStorage.setItem('nschool-accounts', JSON.stringify(savedAccounts));

    if (!localStorage.getItem('nschool-transactions')) {
      localStorage.setItem('nschool-transactions', JSON.stringify([]));
    }

    if (lineToken.trim()) {
      localStorage.setItem('nschool-line-token', lineToken.trim());
    }

    localStorage.setItem('nschool-onboarded', 'true');
    goTo(5);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50/30 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Progress bar */}
      {step < 5 && (
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center gap-1.5 mb-2">
            {Array.from({ length: TOTAL - 1 }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full flex-1 transition-all duration-500"
                style={{ backgroundColor: i < step ? '#6C5CE7' : i === step ? '#A29BFE' : '#E8E0FF' }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-right">{step + 1} / {TOTAL - 1}</p>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-primary-500/10 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <MotionCard key="s0" dir={dir}>
              <StepWelcome onNext={() => goTo(1)} />
            </MotionCard>
          )}
          {step === 1 && (
            <MotionCard key="s1" dir={dir}>
              <StepLevel level={level} onSelect={setLevel} onBack={() => goTo(0)} onNext={() => goTo(2)} />
            </MotionCard>
          )}
          {step === 2 && (
            <MotionCard key="s2" dir={dir}>
              <StepAssets
                banks={banks} balance={balance} investTypes={investTypes}
                onToggleBank={toggleBank} onSetBalance={setBalance} onToggleInvest={toggleInvest}
                onBack={() => goTo(1)} onNext={() => goTo(3)}
              />
            </MotionCard>
          )}
          {step === 3 && (
            <MotionCard key="s3" dir={dir}>
              <StepGoals
                goals={goals} saving={saving}
                onToggleGoal={toggleGoal} onSetSaving={setSaving}
                onBack={() => goTo(2)} onNext={() => goTo(4)}
              />
            </MotionCard>
          )}
          {step === 4 && (
            <MotionCard key="s4" dir={dir}>
              <StepLine
                token={lineToken} linked={lineLinked}
                onTokenChange={setLineToken} onLinked={setLineLinked}
                onBack={() => goTo(3)} onNext={saveAndFinish} onSkip={saveAndFinish}
              />
            </MotionCard>
          )}
          {step === 5 && (
            <MotionCard key="s5" dir={dir}>
              <StepResult
                level={level ?? 'beginner'}
                balance={balance}
                investTypes={investTypes}
                goals={goals}
                saving={saving}
                onStart={() => router.push('/')}
              />
            </MotionCard>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Shared wrapper ─────────────────────────────────────────────────────────────

function MotionCard({ children, dir }: { children: React.ReactNode; dir: number }) {
  return (
    <motion.div
      custom={dir}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="p-7 md:p-10"
    >
      {children}
    </motion.div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm transition-colors">
      <ArrowLeft className="w-4 h-4" /> 返回
    </button>
  );
}

function NextBtn({ onClick, disabled, label = '下一步' }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
    >
      {label} <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// ── Step 0: Welcome ────────────────────────────────────────────────────────────

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
        <span className="text-4xl">💰</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-3">歡迎來到 nSchool Finance！</h1>
      <p className="text-gray-500 leading-relaxed mb-2">專屬投資新手的全方位理財工具。</p>
      <p className="text-gray-500 leading-relaxed mb-6">
        <span className="font-semibold text-primary-600">先認知，再投資</span>——
        30 秒完成設定，立即取得 AI 個人化建議。
      </p>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[['📊', '智能記帳'], ['🎮', '模擬交易'], ['🤖', 'AI 分析']].map(([e, l]) => (
          <div key={l} className="bg-primary-50 rounded-2xl p-3 text-center">
            <p className="text-2xl mb-1">{e}</p>
            <p className="text-xs font-medium text-primary-700">{l}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98]"
      >
        開始設定（約 30 秒） <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Step 1: Level ──────────────────────────────────────────────────────────────

function StepLevel({
  level, onSelect, onBack, onNext,
}: { level: UserLevel | null; onSelect: (v: UserLevel) => void; onBack: () => void; onNext: () => void }) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <h2 className="text-xl font-bold text-gray-800 mb-1">選擇你的身份</h2>
      <p className="text-sm text-gray-400 mb-5">幫助我們推薦最適合你的內容</p>
      <div className="space-y-3 mb-7">
        {LEVELS.map(({ key, icon: Icon, title, desc }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
              level === key ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${level === key ? 'bg-primary-500' : 'bg-gray-100'}`}>
              <Icon className={`w-5 h-5 ${level === key ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${level === key ? 'text-primary-700' : 'text-gray-700'}`}>{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            {level === key && <Check className="w-5 h-5 text-primary-500 shrink-0" />}
          </button>
        ))}
      </div>
      <NextBtn onClick={onNext} disabled={!level} />
    </div>
  );
}

// ── Step 2: Quick Asset Scan ───────────────────────────────────────────────────

function StepAssets({
  banks, balance, investTypes,
  onToggleBank, onSetBalance, onToggleInvest,
  onBack, onNext,
}: {
  banks: Set<string>; balance: BalanceRange | null; investTypes: Set<InvestType>;
  onToggleBank: (id: string) => void; onSetBalance: (v: BalanceRange) => void;
  onToggleInvest: (k: InvestType) => void; onBack: () => void; onNext: () => void;
}) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <h2 className="text-xl font-bold text-gray-800 mb-0.5">快速資產掃描</h2>
      <p className="text-sm text-gray-400 mb-5">幫助我們了解你的財務狀況</p>

      {/* Banks */}
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">你有哪些銀行帳戶？</p>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {BANKS.map(b => {
          const sel = banks.has(b.id);
          return (
            <button
              key={b.id}
              onClick={() => onToggleBank(b.id)}
              className={`relative py-2.5 px-1 rounded-xl border-2 text-xs font-semibold transition-all ${
                sel ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-600 hover:border-primary-200'
              }`}
            >
              {sel && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
              {b.name}
            </button>
          );
        })}
      </div>

      {/* Balance */}
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">大概存了多少？</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {BALANCE_RANGES.map(r => (
          <button
            key={r.key}
            onClick={() => onSetBalance(r.key)}
            className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
              balance === r.key ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-600 hover:border-primary-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Investment types */}
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">有在投資嗎？</p>
      <div className="flex flex-wrap gap-2 mb-7">
        {INVEST_TYPES.map(t => {
          const sel = investTypes.has(t.key);
          return (
            <button
              key={t.key}
              onClick={() => onToggleInvest(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                sel ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-600 hover:border-primary-200'
              }`}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          );
        })}
      </div>

      <NextBtn onClick={onNext} disabled={!balance} label="下一步" />
    </div>
  );
}

// ── Step 3: Goals ──────────────────────────────────────────────────────────────

function StepGoals({
  goals, saving, onToggleGoal, onSetSaving, onBack, onNext,
}: {
  goals: Set<GoalKey>; saving: MonthlySaving | null;
  onToggleGoal: (k: GoalKey) => void; onSetSaving: (v: MonthlySaving) => void;
  onBack: () => void; onNext: () => void;
}) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <h2 className="text-xl font-bold text-gray-800 mb-0.5">設定財務目標</h2>
      <p className="text-sm text-gray-400 mb-4">可以多選，之後也能修改</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {GOALS.map(g => {
          const sel = goals.has(g.key);
          return (
            <button
              key={g.key}
              onClick={() => onToggleGoal(g.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                sel ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-600 hover:border-primary-200'
              }`}
            >
              {g.emoji} {g.label}
              {sel && <Check className="w-3.5 h-3.5 text-primary-500" />}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">每月可以存多少？</p>
      <div className="grid grid-cols-3 gap-2 mb-7 sm:grid-cols-5">
        {MONTHLY_SAVINGS.map(s => (
          <button
            key={s.key}
            onClick={() => onSetSaving(s.key)}
            className={`py-3 rounded-xl text-xs font-semibold border-2 transition-all ${
              saving === s.key ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-600 hover:border-primary-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <NextBtn onClick={onNext} disabled={goals.size === 0 || !saving} />
    </div>
  );
}

// ── Step 4: LINE Binding ───────────────────────────────────────────────────────

function StepLine({
  token, linked, onTokenChange, onLinked, onBack, onNext, onSkip,
}: {
  token: string; linked: boolean;
  onTokenChange: (v: string) => void; onLinked: (v: boolean) => void;
  onBack: () => void; onNext: () => void; onSkip: () => void;
}) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-800">綁定 LINE 通知</h2>
        <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1">
          跳過
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-5">綁定後可收到每日支出提醒、每週財務摘要</p>

      {/* QR Code area */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-4 flex flex-col items-center">
        <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mb-3 border border-green-100 shadow-sm">
          <div className="text-center">
            <QrCode className="w-12 h-12 text-green-500 mx-auto mb-1" />
            <p className="text-[10px] text-gray-400">掃描加入好友</p>
          </div>
        </div>
        <p className="text-xs text-green-700 font-medium">nSchool Finance Bot</p>
        <p className="text-[11px] text-gray-400 mt-0.5">掃描 QR Code 或輸入 Token 綁定</p>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          LINE Notify Token（選填）
        </label>
        <div className="flex gap-2">
          <input
            value={token}
            onChange={e => onTokenChange(e.target.value)}
            placeholder="貼上你的 LINE Notify Token"
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          <button
            onClick={() => { if (token.trim()) onLinked(true); }}
            disabled={!token.trim()}
            className="px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-40 shrink-0"
          >
            綁定
          </button>
        </div>
      </div>

      {linked && (
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 mb-4">
          <Bell className="w-4 h-4 text-green-500 shrink-0" />
          <p className="text-xs text-green-700 font-medium">LINE 通知已成功綁定 🎉</p>
        </div>
      )}

      <div className="space-y-1.5 mb-6">
        {['每日支出提醒', '每週財務摘要', '學習進度提醒'].map(item => (
          <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
            <Bell className="w-3.5 h-3.5 text-green-400" />
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98]"
      >
        {linked ? '繼續' : '跳過，稍後設定'} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Step 5: AI Result ──────────────────────────────────────────────────────────

function StepResult({
  level, balance, investTypes, goals, saving, onStart,
}: {
  level: UserLevel;
  balance: BalanceRange | null;
  investTypes: Set<InvestType>;
  goals: Set<GoalKey>;
  saving: MonthlySaving | null;
  onStart: () => void;
}) {
  const { score, firstStep, courses } = computeInitialScore(balance, investTypes, goals, saving, level);

  const scoreColor = score >= 60 ? 'text-green-500' : score >= 40 ? 'text-primary-500' : 'text-amber-500';
  const scoreBg = score >= 60 ? 'from-green-400 to-green-600' : score >= 40 ? 'from-primary-400 to-primary-600' : 'from-amber-400 to-amber-600';

  const CIRCLE_R = 38;
  const CIRC = 2 * Math.PI * CIRCLE_R;
  const offset = CIRC - (score / 100) * CIRC;

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${scoreBg} flex items-center justify-center mx-auto mb-4 shadow-lg`}
      >
        <span className="text-4xl">🎉</span>
      </motion.div>

      <h2 className="text-xl font-bold text-gray-800 mb-1">你的財務健康初始分數</h2>
      <p className="text-sm text-gray-400 mb-5">基於你的資產狀況與目標計算</p>

      {/* Score ring */}
      <div className="relative w-24 h-24 mx-auto mb-5">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={CIRCLE_R} fill="none" stroke="#E8E0FF" strokeWidth="8" />
          <motion.circle
            cx="44" cy="44" r={CIRCLE_R}
            fill="none"
            stroke={score >= 60 ? '#00B894' : score >= 40 ? '#6C5CE7' : '#FDCB6E'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-2xl font-bold ${scoreColor}`}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-gray-400">/ 100</span>
        </div>
      </div>

      {/* AI first step */}
      <div className="bg-primary-50 rounded-2xl p-4 mb-4 text-left">
        <p className="text-xs font-semibold text-primary-600 mb-1.5">🤖 AI 建議你的第一步</p>
        <p className="text-sm text-gray-700 leading-relaxed">{firstStep}</p>
      </div>

      {/* Recommended courses */}
      <div className="text-left mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">推薦學習課程</p>
        <div className="space-y-2">
          {courses.map((c, i) => (
            <motion.div
              key={c}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700">{c}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98] text-base"
      >
        開始你的理財之旅 🚀
      </button>
    </div>
  );
}
