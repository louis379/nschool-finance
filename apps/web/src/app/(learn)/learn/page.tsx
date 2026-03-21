'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Lock, CheckCircle2, PlayCircle, Trophy, Star } from 'lucide-react';

const learningModules = [
  {
    id: '1', level: 1, title: '理財觀念入門', description: '預算管理、儲蓄技巧、建立記帳習慣',
    icon: '💰', lessons: 8, completed: 5, unlocked: true,
  },
  {
    id: '2', level: 2, title: '投資基礎知識', description: '認識股票、ETF、基金的基本概念',
    icon: '📊', lessons: 10, completed: 3, unlocked: true,
  },
  {
    id: '3', level: 3, title: '技術分析基礎', description: 'K線、均線、成交量的判讀方式',
    icon: '📈', lessons: 12, completed: 0, unlocked: true,
  },
  {
    id: '4', level: 4, title: '基本面分析', description: '財報解讀、估值方法、產業分析',
    icon: '🔍', lessons: 10, completed: 0, unlocked: false,
  },
  {
    id: '5', level: 5, title: '資產配置策略', description: '投資組合建構、風險管理、再平衡',
    icon: '🎯', lessons: 8, completed: 0, unlocked: false,
  },
];

const achievements = [
  { id: '1', name: '初出茅廬', icon: '🌱', description: '完成第一堂課', unlocked: true },
  { id: '2', name: '理財達人', icon: '💎', description: '完成 Level 1 全部課程', unlocked: false },
  { id: '3', name: '首次交易', icon: '🎉', description: '完成第一筆模擬交易', unlocked: true },
  { id: '4', name: '記帳達人', icon: '📝', description: '連續記帳 7 天', unlocked: false },
  { id: '5', name: '投資學徒', icon: '🎓', description: '完成 Level 2 全部課程', unlocked: false },
];

export default function LearnPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">學習路徑</h1>
        <p className="text-sm text-gray-500 mb-6">從小白到懂投資，一步步建立你的理財知識</p>

        {/* Progress Overview */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-[var(--radius-card)] p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-200 text-sm">學習進度</p>
              <p className="text-2xl font-bold mt-1">Level 2 - 投資基礎</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-bold">280 積分</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
            <div className="bg-white rounded-full h-2.5" style={{ width: '35%' }} />
          </div>
          <p className="text-xs text-primary-200">已完成 8/48 堂課 (17%)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Path */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">課程模組</h2>
            {learningModules.map((module) => {
              const progress = module.lessons > 0 ? (module.completed / module.lessons) * 100 : 0;
              const isComplete = module.completed === module.lessons && module.lessons > 0;

              return (
                <div
                  key={module.id}
                  className={`bg-white rounded-[var(--radius-card)] p-5 border-2 transition-all ${
                    !module.unlocked
                      ? 'border-gray-100 opacity-60'
                      : isComplete
                      ? 'border-up/30'
                      : 'border-transparent hover:border-primary-200 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 font-medium">
                          Level {module.level}
                        </span>
                        {isComplete && <CheckCircle2 className="w-4 h-4 text-up" />}
                        {!module.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                      <h3 className="text-base font-semibold text-gray-800">{module.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-primary-500 rounded-full h-2 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {module.completed}/{module.lessons}
                        </span>
                        {module.unlocked && !isComplete && (
                          <PlayCircle className="w-5 h-5 text-primary-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              <Trophy className="w-5 h-5 inline-block text-amber-500 mr-1" />
              成就
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-white rounded-[var(--radius-card)] p-4 flex items-center gap-3 ${
                    !achievement.unlocked ? 'opacity-50' : ''
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{achievement.name}</p>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle2 className="w-5 h-5 text-up ml-auto flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
