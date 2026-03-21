'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const healthScore = 72;

type Status = 'good' | 'warning' | 'bad';

const metrics: { label: string; value: string; status: Status; description: string }[] = [
  { label: '儲蓄率',     value: '32%',       status: 'good',    description: '高於建議的 20%' },
  { label: '收支比',     value: '0.68',      status: 'good',    description: '支出佔收入 68%' },
  { label: '緊急預備金', value: '3.2 個月',  status: 'warning', description: '建議至少 6 個月' },
  { label: '投資比例',   value: '46%',       status: 'good',    description: '配置比例適當' },
];

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

export default function FinancialHealth() {
  const scoreLabel = getScoreLabel(healthScore);
  const dashOffset = CIRCUMFERENCE - (healthScore / 100) * CIRCUMFERENCE;

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
            <span className="text-xl font-bold text-primary-600 leading-none">{healthScore}</span>
            <span className="text-[9px] text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>
        <div>
          <p className={`text-base font-bold ${scoreLabel.color}`}>{scoreLabel.text}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            財務狀況不錯！<br />建議增加緊急預備金至 6 個月。
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric) => {
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
