# 系統架構文件 (Architecture)

> nSchool Finance 技術架構概覽，供 AI 在開發時參考。

---

## 系統架構圖

```
┌─────────────────────────────────────────────────┐
│                   用戶裝置                        │
│  iOS App  /  Android App  /  Web Browser          │
└────────────────────┬────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────┐
│              Next.js Application                  │
│              (Zeabur / Docker)                    │
│                                                   │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │  App Router  │  │  API Routes (/api/*)      │  │
│  │  (Pages)     │  │  - /api/stock/quote       │  │
│  │             │  │  - /api/news               │  │
│  │  - /        │  │  - /api/ai/analyze         │  │
│  │  - /trade   │  │  - /api/portfolio          │  │
│  │  - /learn   │  └──────────────────────────┘  │
│  │  - /news    │                                  │
│  │  - /profile │                                  │
│  └─────────────┘                                  │
└──────────┬──────────────────┬────────────────────┘
           │                  │
┌──────────▼──────┐  ┌────────▼──────────────────┐
│   Supabase       │  │  外部 API                  │
│                  │  │                            │
│  - PostgreSQL    │  │  - Yahoo Finance (行情)    │
│  - Auth          │  │  - Alpha Vantage (備用)    │
│  - Storage       │  │  - Claude API (AI分析)     │
│  - Realtime      │  │  - NewsAPI (新聞)           │
└─────────────────┘  └────────────────────────────┘
```

---

## Monorepo 結構

```
nschool-finance/
├── apps/
│   └── web/                    # Next.js 主應用
│       ├── app/                # App Router 頁面
│       │   ├── (auth)/         # 認證頁面群組
│       │   ├── (app)/          # 主要功能頁面群組
│       │   └── api/            # API Routes
│       ├── components/         # React 組件
│       ├── lib/                # 工具函式、hooks
│       └── styles/             # 全域樣式
├── packages/
│   ├── ui/                     # 共用 UI 組件庫
│   ├── database/               # Supabase 型別定義
│   └── config/                 # 共用設定（ESLint、TS等）
├── supabase/
│   ├── migrations/             # 資料庫遷移檔
│   └── seed.sql                # 測試資料
└── .ai-company/                # AI 公司管理架構
```

---

## 資料庫 Schema 概覽

```sql
-- 用戶表（Supabase Auth 管理）
auth.users

-- 用戶個人檔案
public.profiles (
  id uuid references auth.users,
  display_name text,
  avatar_url text,
  investment_level text,  -- beginner/intermediate/advanced
  created_at timestamptz
)

-- 模擬帳戶
public.paper_accounts (
  id uuid,
  user_id uuid references profiles,
  name text,
  initial_balance decimal,
  current_balance decimal,
  created_at timestamptz
)

-- 模擬持倉
public.paper_positions (
  id uuid,
  account_id uuid references paper_accounts,
  symbol text,             -- 股票代號
  shares decimal,          -- 持股數
  avg_cost decimal,        -- 平均成本
  created_at timestamptz,
  updated_at timestamptz
)

-- 模擬交易紀錄
public.paper_trades (
  id uuid,
  account_id uuid references paper_accounts,
  symbol text,
  action text,             -- buy/sell
  shares decimal,
  price decimal,
  fee decimal,
  executed_at timestamptz
)

-- 學習進度
public.learning_progress (
  user_id uuid references profiles,
  course_id text,
  lesson_id text,
  completed_at timestamptz,
  score int
)

-- 財務記帳
public.transactions (
  id uuid,
  user_id uuid references profiles,
  amount decimal,
  category text,
  description text,
  date date,
  created_at timestamptz
)
```

---

## 關鍵設計決策

### 1. Next.js App Router
選用 App Router 而非 Pages Router，利用 Server Components 減少 client JS bundle size，提升 SEO 和首次載入效能。

### 2. Supabase 作為 BaaS
避免自建後端，利用 Supabase 的 Auth、Realtime、RLS 功能，加快開發速度。後續若有需要可遷移到自建後端。

### 3. API Routes 作為代理層
外部 API key 不暴露在前端，所有第三方 API 呼叫透過 Next.js API Routes 代理，保護 API 憑證。

### 4. pnpm Monorepo
使用 Turborepo 管理 monorepo，未來可以輕鬆拆分成多個子應用（Web、Native、Admin）。

---

## 效能考量

- **圖片：** 使用 `next/image` 自動優化
- **字型：** 使用 `next/font` 消除 CLS
- **程式碼分割：** `dynamic()` 懶加載重型組件（圖表、OCR）
- **快取：** API Route 回應適當設定 Cache-Control
- **狀態管理：** 優先使用 Server State（React Query/SWR），避免過度使用 Client State

---

## 安全性設計

- **RLS：** 所有 Supabase 表格啟用 Row Level Security
- **環境變數：** 敏感 key 存在 Zeabur 環境變數，不進版控
- **CORS：** API Routes 只允許同源
- **輸入驗證：** 所有 API 輸入用 Zod 驗證
- **Auth：** Supabase JWT，有效期 1 小時 + Refresh Token

---

*最後更新：2026-03-22*
