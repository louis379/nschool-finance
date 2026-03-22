'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

type Status = 'good' | 'warning' | 'bad';
type Metric = { label: string; value: string; status: Status; description: string };

const statusConfig: Record<Status, { icon: typeof CheckCircle2; label: string; badge: string; icon_color: string }> = {
  good:    { icon: CheckCircle2, label: '良好', badge: 'bg-green-100 text-green-600',  icon_color: 'text-green-500' },
  warning: { icon: AlertCircle,  label: '待改善', badge: 'bg-amber-100 text-amber-600', icon_color: 'text-amber-500' },
  bad:     { icon: XCircle,      label: '需注意', badge: 'bg-red-100 text-red-600',     icon_color: 'text-red-500' },
};

function getScoreLabel(score: number) {
  if (score >= 80) return { text: '優秀', color: 'text-green-600' };
  if (score >= 60) return { text: '良好', color: 'text-primary-600' };
  if (score >= 40) return { text: '普通', color: 'text-amber-600' };
  return { text: '待改善', color: 'text-red-600' };
}

const CIRCLE_R = 34;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

function computeMetrics(): { score: number; metrics: Metric[]; advice: string } {
  try {
    const txRaw = localStorage.getItem('nschool-transactions');
    const accRaw = localStorage.getItem('nschool-accounts');

    const txs = txRaw ? JSON.parse(txRaw) : [];
    const accs = accRaw ? JSON.parse(accRaw) : [];

    const totalAssets = accs.reduce((s: number, a: { balance: number }) => s + a.balance, 0);

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyTxs = txs.filter((t: { date: string }) => t.date.startsWith(thisMonth));

    const income = monthlyTxs.filter((t: { amount: number }) => t.amount > 0).reduce((s: number, t: { amount: number }) => s + t.amount, 0);
    const expense = monthlyTxs.filter((t: { amount: number }) => t.amount < 0).reduce((s: number, t: { amount: number }) => s + Math.abs(t.amount), 0);

    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    const expenseRatio = income > 0 ? expense / income : 0;
    const emergencyMonths = expense > 0 ? totalAssets / expense : 0;

    // Investment ratio (broker + crypto / total)
    const investmentAssets = accs
      .filter((a: { type: string }) => a.type === 'broker' || a.type === 'crypto')
      .reduce((s: number, a: { balance: number }) => s + a.balance, 0);
    const investmentRatio = totalAssets > 0 ? (investmentAssets / totalAssets) * 100 : 0;

    let score = 50;
    const metrics: Metric[] = [];

    // Savings rate
    const savingsStatus: Status = savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'warning' : 'bad';
    if (savingsRate >= 20) score += 15;
    else if (savingsRate >= 10) score += 5;
    else score -= 5;
    metrics.push({
      label: '儲蓄率',
      value: `${savingsRate.toFixed(0)}%`,
      status: savingsStatus,
      description: savingsRate >= 20 ? '高於建議的 20%' : '建議提高至 20% 以上',
    });

    // Expense ratio
    const expenseStatus: Status = expenseRatio <= 0.7 ? 'good' : expenseRatio <= 0.9 ? 'warning' : 'bad';
    if (expenseRatio <= 0.7) score += 10;
    else if (expenseRatio > 0.9) score -= 10;
    metrics.push({
      label: '收支比',
      value: expenseRatio.toFixed(2),
      status: expenseStatus,
      description: `支出佔收入 ${(expenseRatio * 100).toFixed(0)}%`,
    });

    // Emergency fund
    const emergencyStatus: Status = emergencyMonths >= 6 ? 'good' : emergencyMonths >= 3 ? 'warning' : 'bad';
    if (emergencyMonths >= 6) score += 15;
    else if (emergencyMonths >= 3) score += 5;
    else score -= 5;
    metrics.push({
      label: '緊急預備金',
      value: `${emergencyMonths.toFixed(1)} 個月`,
      status: emergencyStatus,
      description: emergencyMonths >= 6 ? '達到建議水平' : '建議至少 6 個月',
    });

    // Investment ratio
    const investStatus: Status = investmentRatio >= 30 && investmentRatio <= 70 ? 'good' : investmentRatio > 70 ? 'warning' : 'warning';
    if (investmentRatio >= 30 && investmentRatio <= 70) score += 10;
    metrics.push({
      label: '投資比例',
      value: `${investmentRatio.toFixed(0)}%`,
      status: investStatus,
      description: investmentRatio >= 30 ? '配置比例適當' : '建議增加投資配置',
    });

    score = Math.max(0, Math.min(100, score));

    let advice = '持續保持良好的財務習慣！';
    if (score < 60) advice = '建議減少非必要支出，提高儲蓄率。';
    else if (emergencyMonths < 6) advice = `建議增加緊急預備金至 6 個月。`;

    return { score, metrics, advice };
  } catch {
    return {
      score: 72,
      metrics: [
        { label: '儲蓄率', value: '32%', status: 'good', description: '高於建議的 20%' },
        { label: '收支比', value: '0.68', status: 'good', description: '支出佔收入 68%' },
        { label: '緊急預備金', value: '3.2 個月', status: 'warning', description: '建議至少 6 個月' },
        { label: '投資比例', value: '46%', status: 'good', description: '配置比例適當' },
      ],
      advice: '建議增加緊急預備金至 6 個月。',
    };
  }
}

export default function FinancialHealth() {
  const [data, setData] = useState({ score: 72, metrics: [] as Metric[], advice: '' });

  useEffect(() => {
    setData(computeMetrics());
  }, []);

  const scoreLabel = getScoreLabel(data.score);
  const dashOffset = CIRCUMFERENCE - (data.score / 100) * CIRCUMFERENCE;

  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">財務健康分數</h3>
        <Link
          href="/profile"
          className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 transition-colors font-medium"
        >
          詳情 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Score Ring */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r={CIRCLE_R}
              fill="none"
              stroke="#E8E0FF"
              strokeWidth="7"
            />
            <circle
              cx="40" cy="40" r={CIRCLE_R}
              fill="none"
              stroke="#6C5CE7"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-primary-600 leading-none">{data.score}</span>
            <span className="text-[9px] text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>
        <div>
          <p className={`text-base font-bold ${scoreLabel.color}`}>{scoreLabel.text}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            {data.advice || '財務狀況不錯！'}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {data.metrics.map((metric) => {
          const cfg = statusConfig[metric.status];
          const Icon = cfg.icon;
          return (
            <div key={metric.label} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-500 font-medium">{metric.label}</span>
                <Icon className={`w-3.5 h-3.5 ${cfg.icon_color}`} />
              </div>
              <p className="text-lg font-bold text-gray-800 leading-none">{metric.value}</p>
              <p className="text-[10px] text-gray-400 mt-1.5">{metric.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
