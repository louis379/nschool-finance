'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Lock, CheckCircle2, PlayCircle, Trophy, Star,
  Coins, BarChart2, LineChart, Search, Target, LucideIcon,
  ChevronDown, ChevronUp, Check,
} from 'lucide-react';

type Module = {
  id: string;
  level: number;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  lessons: number;
  unlocked: boolean;
};

const learningModules: Module[] = [
  {
    id: '1', level: 1, title: '理財觀念入門', description: '預算管理、儲蓄技巧、建立記帳習慣',
    icon: Coins, iconBg: 'bg-amber-100', iconColor: 'text-amber-500',
    lessons: 8, unlocked: true,
  },
  {
    id: '2', level: 2, title: '投資基礎知識', description: '認識股票、ETF、基金的基本概念',
    icon: BarChart2, iconBg: 'bg-blue-100', iconColor: 'text-blue-500',
    lessons: 10, unlocked: true,
  },
  {
    id: '3', level: 3, title: '技術分析基礎', description: 'K線、均線、成交量的判讀方式',
    icon: LineChart, iconBg: 'bg-primary-100', iconColor: 'text-primary-500',
    lessons: 12, unlocked: true,
  },
  {
    id: '4', level: 4, title: '基本面分析', description: '財報解讀、估值方法、產業分析',
    icon: Search, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    lessons: 10, unlocked: false,
  },
  {
    id: '5', level: 5, title: '資產配置策略', description: '投資組合建構、風險管理、再平衡',
    icon: Target, iconBg: 'bg-pink-100', iconColor: 'text-pink-500',
    lessons: 8, unlocked: false,
  },
];

const lessonNames: Record<string, string[]> = {
  '1': ['記帳的重要性', '預算 50/30/20 法則', '緊急預備金怎麼存', '信用卡使用技巧', '保險基礎觀念', '理財目標設定', '自動化儲蓄', '財務健檢'],
  '2': ['股票是什麼', '認識交易所', 'ETF 入門', 'ETF 的種類與選擇', '基金 vs ETF', '如何開戶', '下單教學', '風險管理', '定期定額策略', '投資心態'],
  '3': ['K 線基礎', '陽線與陰線', '均線原理', 'MA5/MA20/MA60', '成交量判讀', '支撐與壓力', '突破與跌破', '常見K線型態', '技術指標 RSI', 'MACD 應用', 'KD 指標', '綜合應用'],
  '4': ['財務報表概述', '損益表解讀', '資產負債表', '現金流量表', 'EPS 計算', 'P/E 本益比', 'P/B 股淨比', '護城河概念', '產業分析框架', '競爭優勢判斷'],
  '5': ['資產配置基礎', '相關性與分散風險', '股債配置', '再平衡時機', '核心衛星策略', '全球資產配置', '生命週期投資', '稅務優化'],
};

type Achievement = { id: string; name: string; emoji: string; description: string; unlocked: boolean; points: number };

const achievementsData: Achievement[] = [
  { id: '1', name: '初出茅廬', emoji: '🌱', description: '完成第一堂課',       unlocked: true,  points: 20 },
  { id: '2', name: '理財達人', emoji: '💎', description: '完成 Level 1 全部課程', unlocked: false, points: 100 },
  { id: '3', name: '首次交易', emoji: '🎉', description: '完成第一筆模擬交易',  unlocked: true,  points: 30 },
  { id: '4', name: '記帳達人', emoji: '📝', description: '連續記帳 7 天',      unlocked: false, points: 50 },
  { id: '5', name: '投資學徒', emoji: '🎓', description: '完成 Level 2 全部課程', unlocked: false, points: 150 },
];

// lessonProgress: { [moduleId]: Set of completed lesson indices }
type LessonProgressMap = Record<string, number[]>;

const defaultProgress: LessonProgressMap = {
  '1': [0, 1, 2, 3, 4],     // 5 completed
  '2': [0, 1, 2],            // 3 completed
};

export default function LearnPage() {
  const [expandedModule, setExpandedModule] = useState<string | null>('2');
  const [lessonProgress, setLessonProgress] = useState<LessonProgressMap>(defaultProgress);
  // Streak tracking (Duolingo pattern)
  const [streak, setStreak] = useState(0);
  // Micro-animation: track which lesson was just completed
  const [justCompletedKey, setJustCompletedKey] = useState<string | null>(null);
  // Refs for scrolling to modules (one-tap banner CTA)
  const moduleRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nschool-lesson-progress');
      if (saved) setLessonProgress(JSON.parse(saved));
    } catch {}

    // Streak calculation (Duolingo pattern)
    try {
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem('nschool-streak-date');
      const currentStreak = parseInt(localStorage.getItem('nschool-streak-count') ?? '0', 10);

      if (lastDate === today) {
        setStreak(currentStreak);
      } else {
        const yesterday = new Date(Date.now() - 86_400_000).toDateString();
        const newStreak = lastDate === yesterday ? currentStreak + 1 : 1;
        setStreak(newStreak);
        localStorage.setItem('nschool-streak-date', today);
        localStorage.setItem('nschool-streak-count', String(newStreak));
      }
    } catch {}
  }, []);

  function getCompleted(moduleId: string) {
    return lessonProgress[moduleId]?.length ?? 0;
  }

  function isLessonDone(moduleId: string, idx: number) {
    return (lessonProgress[moduleId] ?? []).includes(idx);
  }

  const toggleLesson = useCallback((moduleId: string, idx: number) => {
    setLessonProgress((prev) => {
      const current = prev[moduleId] ?? [];
      const wasDone = current.includes(idx);
      const updated = wasDone ? current.filter((i) => i !== idx) : [...current, idx];

      // Trigger micro-animation only when marking as done (Duolingo feedback)
      if (!wasDone) {
        const key = `${moduleId}-${idx}`;
        setJustCompletedKey(key);
        setTimeout(() => setJustCompletedKey(null), 550);
      }

      const next = { ...prev, [moduleId]: updated };
      try { localStorage.setItem('nschool-lesson-progress', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // One-tap banner CTA: expand active module and scroll to it (Khan Academy pattern)
  function jumpToActiveModule(moduleId: string) {
    setExpandedModule(moduleId);
    setTimeout(() => {
      moduleRefs.current[moduleId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  const totalLessons = learningModules.reduce((s, m) => s + m.lessons, 0);
  const completedLessons = learningModules.reduce((s, m) => s + getCompleted(m.id), 0);
  const overallPercent = Math.round((completedLessons / totalLessons) * 100);

  const totalPoints = achievementsData.filter((a) => a.unlocked).reduce((s, a) => s + a.points, 0);

  // Find current active module
  const activeModule = learningModules.find((m) => m.unlocked && getCompleted(m.id) < m.lessons);

  return (
    <AppLayout>
      {/* Checkmark bounce animation */}
      <style>{`
        @keyframes lessonCheck {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.45); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .lesson-check-animate { animation: lessonCheck 0.5s ease-out; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">學習路徑</h1>
          <p className="text-sm text-gray-400 mt-1">從小白到懂投資，一步步建立你的理財知識</p>
        </div>

        {/* Progress Banner */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[var(--radius-card)] p-6 text-white mb-6 shadow-lg shadow-primary-500/20">
          <div className="flex items-start justify-between mb-4 gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-primary-200 text-xs font-medium mb-1">目前進度</p>
              <p className="text-xl font-bold">
                {activeModule ? `Level ${activeModule.level} — ${activeModule.title}` : '全部完成 🎉'}
              </p>
              {activeModule && (
                <p className="text-primary-300 text-sm mt-1">
                  下一課：{lessonNames[activeModule.id]?.[getCompleted(activeModule.id)] ?? '開始課程'}
                </p>
              )}
              {/* One-tap CTA to jump to active module (Khan Academy pattern) */}
              {activeModule && (
                <button
                  onClick={() => jumpToActiveModule(activeModule.id)}
                  className="mt-3 bg-white text-primary-700 hover:bg-primary-50 active:scale-95 transition-all duration-150 px-4 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 w-fit shadow-sm"
                >
                  繼續學習 →
                </button>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {/* Points badge */}
              <div className="flex items-center gap-1.5 bg-white/15 px-3 py-2 rounded-xl">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-sm font-bold">{totalPoints} 積分</span>
              </div>
              {/* Streak badge (Duolingo pattern) */}
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${streak > 0 ? 'bg-orange-500/80' : 'bg-white/10'}`}>
                <span className="text-base leading-none">🔥</span>
                <span className="text-sm font-bold">{streak} 天</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-primary-300">
            <span>已完成 {completedLessons}/{totalLessons} 堂課</span>
            <span>{overallPercent}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Modules */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-base font-bold text-gray-800">課程模組</h2>
            {learningModules.map((module) => {
              const completed = getCompleted(module.id);
              const progress = module.lessons > 0 ? (completed / module.lessons) * 100 : 0;
              const isComplete = completed === module.lessons && module.lessons > 0;
              const isActive = module.unlocked && !isComplete && completed > 0;
              const isExpanded = expandedModule === module.id;
              const Icon = module.icon;
              const lessons = lessonNames[module.id] ?? [];

              return (
                <div
                  key={module.id}
                  ref={(el) => { moduleRefs.current[module.id] = el; }}
                  className={`bg-white rounded-[var(--radius-card)] border-2 transition-all ${
                    !module.unlocked
                      ? 'border-gray-100 opacity-55'
                      : isComplete
                      ? 'border-up/30 bg-green-50/30'
                      : isActive
                      ? 'border-primary-300 shadow-sm shadow-primary-100'
                      : 'border-transparent hover:border-primary-200'
                  }`}
                >
                  {/* Module Header */}
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${module.iconBg}`}>
                        <Icon className={`w-5 h-5 ${module.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">
                            Level {module.level}
                          </span>
                          {isComplete && (
                            <span className="flex items-center gap-1 text-[10px] text-up font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> 已完成
                            </span>
                          )}
                          {!module.unlocked && (
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Lock className="w-3 h-3" /> 完成上一級解鎖
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 font-semibold">
                              進行中
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">{module.title}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{module.description}</p>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`rounded-full h-1.5 transition-all duration-500 ${
                                isComplete ? 'bg-up' : 'bg-primary-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 font-medium tabular-nums shrink-0">
                            {completed}/{module.lessons}
                          </span>
                          {module.unlocked && !isComplete && (
                            <PlayCircle className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-300'}`} />
                          )}
                        </div>

                        {module.unlocked && !isComplete && (
                          <button
                            onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                            className={`mt-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-primary-500 text-white hover:bg-primary-600'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {isActive ? '繼續學習' : '開始課程'}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        {isComplete && (
                          <button
                            onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                            className="mt-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-up/10 text-up hover:bg-up/20 transition-colors"
                          >
                            複習課程
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Lesson List */}
                  {isExpanded && lessons.length > 0 && (
                    <div className="border-t border-gray-50 px-5 pb-4">
                      <p className="text-xs text-gray-400 font-semibold mt-3 mb-2.5 uppercase tracking-wide">課程列表</p>
                      <div className="space-y-1">
                        {lessons.map((name, idx) => {
                          const done = isLessonDone(module.id, idx);
                          const animKey = `${module.id}-${idx}`;
                          const isJustCompleted = justCompletedKey === animKey;

                          return (
                            <button
                              key={idx}
                              onClick={() => toggleLesson(module.id, idx)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                done
                                  ? 'bg-up/5 hover:bg-up/10'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {/* Checkmark with micro-animation (Duolingo pattern) */}
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-200 ${
                                  done ? 'bg-up border-up' : 'border-gray-200 bg-white'
                                } ${isJustCompleted ? 'lesson-check-animate' : ''}`}
                              >
                                {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                              </div>
                              <span className={`text-sm transition-colors ${
                                done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'
                              }`}>
                                {idx + 1}. {name}
                              </span>
                              {/* "剛完成" flash label */}
                              {isJustCompleted && (
                                <span className="ml-auto text-[10px] font-bold text-up bg-up/10 px-2 py-0.5 rounded-full animate-fade-in">
                                  +完成!
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-gray-300 mt-3">點擊課程名稱可標記為已完成</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              成就徽章
            </h2>
            <div className="space-y-2.5">
              {achievementsData.map((ach) => (
                <div
                  key={ach.id}
                  className={`bg-white rounded-[var(--radius-card)] p-4 flex items-center gap-3 border-2 transition-all ${
                    ach.unlocked
                      ? 'border-amber-200/60 shadow-sm'
                      : 'border-transparent opacity-50 grayscale'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    ach.unlocked ? 'bg-amber-50' : 'bg-gray-100'
                  }`}>
                    {ach.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{ach.name}</p>
                    <p className="text-xs text-gray-400 truncate">{ach.description}</p>
                  </div>
                  {ach.unlocked ? (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-amber-600">{ach.points}</span>
                    </div>
                  ) : (
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Streak encouragement card */}
            {streak > 0 && (
              <div className="mt-4 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200/60 rounded-[var(--radius-card)] p-4 text-center">
                <p className="text-2xl mb-1">🔥</p>
                <p className="text-sm font-bold text-orange-700">{streak} 天連續學習!</p>
                <p className="text-xs text-orange-500 mt-0.5">保持下去，養成好習慣</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
