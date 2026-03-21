'use client';

const healthScore = 72;
const metrics = [
  { label: '儲蓄率', value: '32%', status: 'good' as const, description: '高於建議的 20%' },
  { label: '收支比', value: '0.68', status: 'good' as const, description: '支出佔收入 68%' },
  { label: '緊急預備金', value: '3.2 個月', status: 'warning' as const, description: '建議至少 6 個月' },
  { label: '投資比例', value: '46%', status: 'good' as const, description: '適當的投資配置' },
];

const statusColors = {
  good: 'text-up bg-up-light',
  warning: 'text-amber-600 bg-amber-50',
  bad: 'text-down bg-down-light',
};

export default function FinancialHealth() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">財務健康分數</h3>

      {/* Score Circle */}
      <div className="flex items-center gap-6 mb-5">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E8E0FF" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#6C5CE7"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(healthScore / 100) * 213.6} 213.6`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-primary-600">{healthScore}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">良好</p>
          <p className="text-xs text-gray-400 mt-1">
            你的財務狀況不錯！建議增加緊急預備金。
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-3 rounded-xl bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{metric.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[metric.status]}`}>
                {metric.status === 'good' ? '良好' : '待改善'}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-800">{metric.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
