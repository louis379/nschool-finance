# 設計系統（Design System）

> nSchool Finance UI 規範

---

## 色彩系統

### 主色調（Primary）— 自訂品牌紫

使用 CSS 自訂屬性定義於 `globals.css` 的 `@theme` 區塊。**請勿使用 Tailwind 預設的 indigo 色系**，全部以 `primary-*` 語義化類別引用。

| Token | Hex | Tailwind Class | 用途 |
|-------|-----|----------------|------|
| primary-50 | `#F3F0FF` | `bg-primary-50` | 淺背景高亮 |
| primary-100 | `#E8E0FF` | `bg-primary-100` | SVG 背景環、輕量填充 |
| primary-200 | `#D1C2FE` | `text-primary-200` | 滾動條、輔助元素 |
| primary-300 | `#B9A3FD` | `text-primary-300` | 次要文字（深色底） |
| primary-400 | `#A29BFE` | `bg-primary-400` | Focus ring、漸層終點 |
| primary-500 | `#6C5CE7` | `bg-primary-500` | **主要操作、CTA 按鈕** |
| primary-600 | `#5A4BD1` | `bg-primary-600` | Hover 狀態、漸層 |
| primary-700 | `#4834B5` | `bg-primary-700` | 深色漸層中段 |
| primary-800 | `#362799` | — | 保留 |
| primary-900 | `#241A7D` | `bg-primary-900` | 深色漸層終點 |

### 金色（Gold）— 成就 / 獎勵

| Token | Hex | 用途 |
|-------|-----|------|
| gold-50 | `#FFF9E6` | 背景 |
| gold-100 | `#FFF3CC` | 淺底 |
| gold-200 | `#FFE799` | — |
| gold-300 | `#FFDB66` | — |
| gold-400 | `#FDCB6E` | 加密貨幣帳戶色 |
| gold-500 | `#F0B429` | 主要金色 |

### 功能色

| 語意 | Hex | CSS Variable / Tailwind |
|------|-----|------------------------|
| 成功 / 漲 | `#22C55E` | `text-up` / `bg-up-light` |
| 漲背景 | `#DCFCE7` | `bg-up-light` |
| 錯誤 / 跌 | `#EF4444` | `text-down` / `bg-down-light` |
| 跌背景 | `#FEE2E2` | `bg-down-light` |
| 警告 | `#F59E0B` | Tailwind `amber-500` |
| 資訊 | `#3B82F6` | Tailwind `blue-500` |

### 帳戶類型色

用於圖表和帳戶識別的語義色：

| 類型 | Hex | 說明 |
|------|-----|------|
| 銀行 | `#6C5CE7` | 同 primary-500 |
| 證券 | `#A29BFE` | 同 primary-400 |
| 加密 | `#FDCB6E` | 同 gold-400 |
| 現金 | `#00B894` | 綠松石 |

### 中性色

| 語意 | Hex | Tailwind |
|------|-----|----------|
| **頁面背景** | `#F4F2FF` | 自訂（淡紫色調） |
| 卡片 | `#FFFFFF` | `bg-white` |
| 邊框（卡片外框） | `#E5E7EB` | `border-gray-200` |
| 邊框（輸入框） | `#F3F4F6` | `border-gray-100` |
| 次要文字 | `#6B7280` | `text-gray-500` |
| 輔助文字 | `#9CA3AF` | `text-gray-400` |
| 主要文字 | `#1F2937` | `text-gray-800` |
| 強調文字 | `#111827` | `text-gray-900` |

> 注意：頁面背景不是灰色而是淡紫色 `#F4F2FF`，與品牌紫系統一致。

### 深色模式（Dark Mode — 規劃中）

- 背景：`#0F172A`（Slate-900）
- 卡片：`#1E293B`（Slate-800）
- 文字：`#F1F5F9`（Slate-100）

## 字型

- **主字型**：`"Noto Sans TC", "Inter", -apple-system, BlinkMacSystemFont, sans-serif`
  - Noto Sans TC 優先（主要用戶為中文使用者），Inter 作為 Latin fallback
- **數字字型**：`JetBrains Mono`（用於金額、報價等數字顯示）
  - 搭配 `tabular-nums` 確保數字等寬對齊
- **大小規範**：

| 層級 | Tailwind | 大小 | 用途 |
|------|----------|------|------|
| H1 | `text-2xl font-bold` | 24px | 頁面標題 |
| H2 | `text-xl font-semibold` | 20px | 區塊標題 |
| 正文 | `text-base` | 16px | 主要內文 |
| 小字 | `text-sm` | 14px | 卡片標題、列表項 |
| 極小字 | `text-xs` | 12px | 標籤、輔助 |
| 微小字 | `text-[11px]` | 11px | 帳戶名、次級標籤 |
| 微字 | `text-[10px]` | 10px | 市場標籤 |

## 間距與圓角

採用 Tailwind 的 4px 基準，使用 CSS 自訂屬性統一管理圓角：

### 圓角（CSS Variables）

| Token | 值 | CSS Variable | 用途 |
|-------|------|-------------|------|
| 卡片圓角 | 16px | `--radius-card` | 所有卡片容器 |
| 按鈕圓角 | 12px | `--radius-button` | 按鈕、輸入框 |

**引用方式**：`rounded-[var(--radius-card)]` / `rounded-[var(--radius-button)]` 或 `rounded-2xl` / `rounded-xl`

### 間距規範

- 儀表板卡片內部間距：`p-5`（20px）— 白底卡片標準
- 緊湊型卡片（如摘要格）：`p-4`（16px）— 用於 3 欄 grid 等空間受限場景
- 特殊卡片（漸層底）：`p-6`（24px）— 如總資產卡
- 元件之間間距：`gap-4` 或 `space-y-4`
- 頁面邊距：`px-4`（手機）/ `px-6`（平板）/ `px-8`（桌面）
- 列表項間距：`space-y-0.5` + 每項 `py-2.5 px-2`

## 元件規範

### 按鈕

```html
<!-- 主要按鈕（實色） -->
<button class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
  主要操作
</button>

<!-- 主要按鈕（漸層） -->
<button class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all">
  漸層操作
</button>

<!-- 次要按鈕（淺底） -->
<button class="bg-primary-50 text-primary-600 px-4 py-2 rounded-xl font-medium hover:bg-primary-100 transition-colors">
  次要操作
</button>

<!-- 危險按鈕 -->
<button class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
  刪除
</button>
```

### 卡片

```html
<!-- 標準白底卡片 -->
<div class="bg-white rounded-[var(--radius-card)] p-5 card-hover">
  <!-- 卡片內容 -->
</div>

<!-- 漸層特色卡片（如總資產） -->
<div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-[var(--radius-card)] p-6 text-white shadow-lg shadow-primary-500/20">
  <!-- 卡片內容 -->
</div>
```

### 輸入框

```html
<!-- 標準輸入框（帶背景） -->
<input class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all" />

<!-- 透明輸入框（用於重點數值輸入，如金額） -->
<input class="text-4xl font-extrabold text-center outline-none bg-transparent tabular-nums placeholder:text-gray-200" />
```

> **注意**：所有輸入框統一使用 `bg-gray-50 border-gray-100` 淺灰底 + `focus:ring-primary-300` 聚焦環。

### 模態框（Modal）

App 內有兩種 Modal 形態，依場景選擇：

```html
<!-- A. 頂部滑入（Top Sheet）— 用於一般表單（帳戶新增、設定等） -->
<div class="modal-content rounded-b-3xl md:rounded-2xl max-w-sm p-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
  <!-- 內容 -->
</div>

<!-- B. 底部滑入（Bottom Sheet）— 用於快速操作（記帳、確認等） -->
<div class="modal-content rounded-t-3xl md:rounded-2xl max-w-md pb-[env(safe-area-inset-bottom,16px)]">
  <!-- 手機拖曳把手 -->
  <div class="flex justify-center pt-3 pb-1 md:hidden">
    <div class="w-10 h-1 rounded-full bg-gray-200" />
  </div>
  <!-- 內容 -->
</div>

<!-- 共用背景遮罩 -->
<div class="absolute inset-0 bg-black/40 backdrop-blur-sm modal-backdrop" />
```

> **選擇指南**：高頻且需快速完成的操作用 Bottom Sheet（如記帳），一般表單用 Top Sheet。
> 桌面版自動透過 `@media (min-width: 768px)` 切換為 `scaleIn` 置中動畫。

### 分類選擇器（Pill Selector）

用於單選分類場景（如記帳分類），採用 pill 標籤風格，適合單手操作：

```html
<button class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all
  {selected ? 'bg-primary-500 text-white shadow-md shadow-primary-400/30 scale-105'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:scale-95'}">
  <Icon class="w-3.5 h-3.5" />
  分類名稱
</button>
```

### 快速操作圖標

```html
<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-{color}-400 to-{color}-600 flex items-center justify-center shadow-md shadow-{color}-400/40">
  <Icon class="w-5 h-5 text-white" />
</div>
```

## 動畫

所有動畫定義於 `globals.css`：

| 名稱 | 動畫 | 用途 |
|------|------|------|
| `fadeInUp` | 淡入 + 上移 10px / 250ms | 頁面進入 `.page-enter` |
| `fadeIn` | 淡入 / 200ms | 通用淡入 `.animate-fade-in` |
| `slideDown` | 淡入 + 下移 20px / 250ms | 手機版 modal |
| `scaleIn` | 淡入 + 縮放 0.95→1 / 200ms | 桌面版 modal |
| `card-hover` | box-shadow + translateY(-1px) | 卡片懸停效果 |

- **轉場**：`transition-all duration-200 ease-in-out` 或 `transition-colors`
- **載入狀態**：pulse skeleton
- **數字變化**：tabular-nums 搭配 count-up
- **手勢回饋**：`active:scale-95`（按鈕）、`group-hover:scale-110`（圖標）

### 無障礙動畫

已實作 `prefers-reduced-motion: reduce` 媒體查詢，自動禁用所有動畫。

## 響應式斷點

| 斷點 | 寬度 | 用途 |
|------|------|------|
| 預設 | < 640px | 手機（主要開發目標） |
| `sm` | ≥ 640px | 大螢幕手機 |
| `md` | ≥ 768px | 平板 |
| `lg` | ≥ 1024px | 桌面 |

**設計原則：Mobile First**，所有設計先從手機版開始。

## 圖示

- 使用 `lucide-react` 圖示庫
- 圖示大小：`w-5 h-5`（20px）為預設
- 導航圖示：`w-6 h-6`（24px）
- 小型狀態圖示：`w-3.5 h-3.5`（14px）
- 卡片內圖示：`w-4 h-4`（16px）

## 設計趨勢參考（2026）

根據最新 FinTech UI 設計趨勢，以下方向可持續優化：

- **AI 個人化儀表板**：根據用戶行為動態調整卡片排序和內容（65% 用戶期待 AI 財務建議）
- **微互動強化信任**：金錢流動時加入安撫性動畫（已實作 card-hover、fadeInUp）
- **數據視覺化**：82% 用戶因視覺化數據更信任 FinTech App（已實作圓環圖、比例條）
- **漸層 + 柔和陰影**：現代 FinTech 趨勢，取代硬邊框（已採用）
- **即時回饋**：交易和行情需要即時狀態指示器（已實作 up/down 色系）
- **簡化操作流程**：Progressive disclosure 模式，核心路徑 ≤ 3 步完成（已實作記帳 Bottom Sheet）
- **跨裝置一致性**：用戶頻繁切換裝置，響應式設計需保持體驗連貫（已實作 Mobile First + md 斷點切換）
- **被動安全設計**：超越登入生物辨識，融入行為式安全偵測（規劃中）
- **遊戲化元素**：學習進度、連續記帳 streak、成就系統提升用戶黏性（部分實作：學習 streak）

---

*最後更新：2026-03-26*
