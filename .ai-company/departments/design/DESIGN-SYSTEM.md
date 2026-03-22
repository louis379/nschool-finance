# 設計系統（Design System）

> nSchool Finance UI 規範

---

## 色彩系統

### 主色調（Primary）
- **Primary**: `#6366F1`（Indigo-500）— 主要操作、CTA 按鈕
- **Primary Hover**: `#4F46E5`（Indigo-600）
- **Primary Light**: `#EEF2FF`（Indigo-50）— 背景高亮

### 功能色
- **成功 / 漲**：`#22C55E`（Green-500）
- **警告**：`#F59E0B`（Amber-500）
- **錯誤 / 跌**：`#EF4444`（Red-500）
- **資訊**：`#3B82F6`（Blue-500）

### 中性色
- **背景**：`#F9FAFB`（Gray-50）
- **卡片**：`#FFFFFF`
- **邊框**：`#E5E7EB`（Gray-200）
- **次要文字**：`#6B7280`（Gray-500）
- **主要文字**：`#111827`（Gray-900）

### 深色模式（Dark Mode — 規劃中）
- 背景：`#0F172A`（Slate-900）
- 卡片：`#1E293B`（Slate-800）
- 文字：`#F1F5F9`（Slate-100）

## 字型

- **主字型**：`Inter`（Latin）+ `Noto Sans TC`（中文）
- **數字字型**：`JetBrains Mono`（用於金額、報價等數字顯示）
- **大小規範**：
  - 標題（H1）：`text-2xl font-bold`（24px）
  - 副標題（H2）：`text-xl font-semibold`（20px）
  - 正文：`text-base`（16px）
  - 小字：`text-sm`（14px）
  - 極小字：`text-xs`（12px）

## 間距

採用 Tailwind 的 4px 基準：
- 元件內部間距：`p-4`（16px）
- 元件之間間距：`gap-4` 或 `space-y-4`
- 頁面邊距：`px-4`（手機）/ `px-6`（平板）/ `px-8`（桌面）
- 卡片圓角：`rounded-xl`（12px）
- 按鈕圓角：`rounded-lg`（8px）

## 元件規範

### 按鈕

```html
<!-- 主要按鈕 -->
<button class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  主要操作
</button>

<!-- 次要按鈕 -->
<button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
  次要操作
</button>

<!-- 危險按鈕 -->
<button class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  刪除
</button>
```

### 卡片

```html
<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <!-- 卡片內容 -->
</div>
```

### 輸入框

```html
<input class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors" />
```

## 動畫

- **轉場**：`transition-all duration-200 ease-in-out`
- **頁面切換**：fade + slide（200ms）
- **載入狀態**：pulse skeleton
- **數字變化**：count-up animation
- **手勢回饋**：scale on press（`active:scale-95`）

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

---

*最後更新：2026-03-22*
