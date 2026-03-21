'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Calculator, TrendingUp, Wallet, PiggyBank } from 'lucide-react';

function formatShort(v: number) {
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)} 億`;
  if (v >= 10_000_000)  return `${(v / 10_000_000).toFixed(1)} 千萬`;
  if (v >= 1_000_000)   return `${(v / 1_000_000).toFixed(1)} 百萬`;
  if (v >= 10_000)      return `${(v / 10_000).toFixed(0)} 萬`;
  return `NT$ ${v.toLocaleString()}`;
}

type SliderFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  display: string;
};

function SliderField({ label, value, onChange, min, max, step, display }: SliderFieldProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm text-gray-600 font-medium">{label}</label>
        <span className="text-sm font-bold text-primary-600 tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-primary-500 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-gray-300 mt-1 tabular-nums">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [monthly, setMonthly]     = useState(5000);
  const [rate, setRate]           = useState(8);
  const [years, setYears]         = useState(20);

  const chartData = useMemo(() => {
    const result = [];
    let balance = principal;

    for (let y = 0; y <= years; y++) {
      const totalInvested = principal + monthly * 12 * y;
      result.push({
        year: `${y}年`,
        資產總值: Math.round(balance),
        總投入:   totalInvested,
      });
      for (let m = 0; m < 12; m++) {
        balance = (balance + monthly) * (1 + rate / 100 / 12);
      }
    }
    return result;
  }, [principal, monthly, rate, years]);

  const finalBalance   = chartData[chartData.length - 1]?.資產總值 ?? 0;
  const totalInvested  = principal + monthly * 12 * years;
  const totalGain      = finalBalance - totalInvested;
  const gainPercent    = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(1) : '0';

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">複利計算器</h1>
          <p className="text-sm text-gray-400 mt-0.5">模擬長期定期定額投資的複利效果</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 bg-white rounded-[var(--radius-card)] p-5 space-y-5 h-fit">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary-500" />
              投資參數設定
            </h3>

            <SliderField
              label="初始本金"
              value={principal}
              onChange={setPrincipal}
              min={0} max={2000000} step={10000}
              display={`NT$ ${principal.toLocaleString()}`}
            />
            <SliderField
              label="每月定投"
              value={monthly}
              onChange={setMonthly}
              min={0} max={50000} step={500}
              display={`NT$ ${monthly.toLocaleString()}`}
            />
            <SliderField
              label="年化報酬率"
              value={rate}
              onChange={setRate}
              min={1} max={30} step={0.5}
              display={`${rate}%`}
            />
            <SliderField
              label="投資年數"
              value={years}
              onChange={setYears}
              min={1} max={40} step={1}
              display={`${years} 年`}
            />

            {/* Assumptions note */}
            <p className="text-[10px] text-gray-300 leading-relaxed pt-1 border-t border-gray-50">
              * 假設每月月初投入，報酬率為年化複利，未考慮稅費與通膨。僅供參考，非投資建議。
            </p>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '最終資產',  value: formatShort(finalBalance),  icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
                { label: '總投入金額', value: formatShort(totalInvested), icon: Wallet,     color: 'text-blue-500',   bg: 'bg-blue-50' },
                { label: '利息收益',  value: formatShort(totalGain),     icon: PiggyBank,  color: 'text-up',         bg: 'bg-up/10' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-[var(--radius-card)] p-4">
                  <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className={`text-xl font-bold ${color} tabular-nums leading-tight`}>{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Gain Highlight */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-[var(--radius-card)] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">投資 {years} 年 · 總報酬</p>
                <p className="text-3xl font-bold text-primary-600 mt-0.5">+{gainPercent}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">複利讓你多賺</p>
                <p className="text-xl font-bold text-up tabular-nums">
                  NT$ {totalGain.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-[var(--radius-card)] p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">資產成長趨勢</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6C5CE7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#A29BFE" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#A29BFE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    interval={Math.ceil(years / 5)}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickFormatter={(v) => formatShort(v)}
                    width={56}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `NT$ ${value.toLocaleString()}`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="資產總值"
                    stroke="#6C5CE7"
                    strokeWidth={2}
                    fill="url(#gradTotal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="總投入"
                    stroke="#A29BFE"
                    strokeWidth={2}
                    strokeDasharray="4 2"
                    fill="url(#gradInvested)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-4 h-0.5 bg-primary-500 rounded" />
                  資產總值
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-4 h-0.5 bg-primary-300 rounded border-dashed" style={{ borderTop: '2px dashed #A29BFE', background: 'none' }} />
                  總投入金額
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
