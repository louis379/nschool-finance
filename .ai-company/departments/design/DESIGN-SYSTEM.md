# 設計系統 (Design System)

> nSchool Finance 視覺設計規範，確保產品一致性。

---

## 色彩系統

```css
/* 主色 — 成長與財富 */
--color-primary: #10B981;        /* Emerald 500 */
--color-primary-dark: #059669;   /* Emerald 600 */
--color-primary-light: #34D399;  /* Emerald 400 */

/* 語義色彩 */
--color-up: #10B981;             /* 上漲（綠）*/
--color-down: #EF4444;           /* 下跌（紅）*/
--color-warning: #F59E0B;        /* 警告（琥珀）*/
--color-info: #3B82F6;           /* 資訊（藍）*/

/* 背景層次 — Dark Mode */
--color-bg-base: #111827;        /* Gray 900 — 最底層 */
--color-bg-surface: #1F2937;     /* Gray 800 — 卡片 */
--color-bg-elevated: #374151;    /* Gray 700 — 懸浮元素 */

/* 文字 */
--color-text-primary: #F9FAFB;   /* Gray 50 */
--color-text-secondary: #9CA3AF; /* Gray 400 */
--color-text-muted: #6B7280;     /* Gray 500 */

/* 邊框 */
--color-border: #374151;         /* Gray 700 */
```

---

## 字型系統

```css
/* 字型家族 */
font-family: 'Inter', -apple-system, sans-serif;

/* 字型大小 */
--text-xs:   12px / 1.5;
--text-sm:   14px / 1.5;
--text-base: 16px / 1.5;
--text-lg:   18px / 1.5;
--text-xl:   20px / 1.5;
--text-2xl:  24px / 1.3;
--text-3xl:  30px / 1.2;

/* 字重 */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

/* 數字特殊處理 */
.number { font-variant-numeric: tabular-nums; }
```

---

## 間距系統

使用 4px 基礎單位（Tailwind 預設）：

```
4px  = p-1  (最小間距)
8px  = p-2
12px = p-3
16px = p-4  (標準間距)
20px = p-5
24px = p-6  (區塊間距)
32px = p-8
48px = p-12 (大區塊)
```

---

## 組件規範

### 卡片 (Card)
```jsx
<div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
  {/* 內容 */}
</div>
```

### 主要按鈕 (Primary Button)
```jsx
<button className="bg-emerald-500 hover:bg-emerald-600 text-white
                   font-semibold px-6 py-3 rounded-lg
                   transition-colors duration-200">
  立即買入
</button>
```

### 危險按鈕 (Danger Button)
```jsx
<button className="bg-red-500/10 hover:bg-red-500/20 text-red-400
                   font-semibold px-6 py-3 rounded-lg
                   transition-colors duration-200 border border-red-500/20">
  賣出
</button>
```

### 漲跌顯示
```jsx
// 上漲
<span className="text-emerald-500 font-semibold">▲ 2.45%</span>

// 下跌
<span className="text-red-500 font-semibold">▼ 1.23%</span>
```

### 標籤 (Badge)
```jsx
<span className="bg-emerald-500/10 text-emerald-400 text-xs
                 font-medium px-2 py-0.5 rounded-full">
  ETF
</span>
```

---

## 動畫規範

```css
/* 標準過渡 */
.transition-standard { transition: all 200ms ease; }

/* 頁面切換 */
.page-enter { animation: fadeSlideIn 300ms ease; }

/* 數字跳動 */
.number-update { animation: countUp 500ms ease; }

/* 卡片進入 */
.card-appear { animation: scaleIn 200ms ease; }
```

---

## 圖示系統

使用 `lucide-react`，保持一致性：

```jsx
import { TrendingUp, TrendingDown, BookOpen,
         Wallet, BarChart3, Settings } from 'lucide-react';

// 標準大小
<TrendingUp className="w-5 h-5" />   // 20px — 行內圖示
<BarChart3 className="w-6 h-6" />    // 24px — 功能圖示
<Wallet className="w-8 h-8" />       // 32px — 強調圖示
```

---

## 響應式斷點

```
手機:  375px - 767px  (主要設計對象)
平板:  768px - 1023px
桌面:  1024px+
```

---

## 無障礙規範

- 色彩對比：文字 vs 背景 ≥ 4.5:1
- 所有互動元素有 focus 樣式
- 圖片有 alt text
- 表單有 label
- 錯誤訊息用文字+圖示，不只靠顏色

---

*最後更新：2026-03-22*
