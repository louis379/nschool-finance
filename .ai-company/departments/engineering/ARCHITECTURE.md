# 系統架構文件

> nSchool Finance 技術架構

---

## 架構總覽

```
┌─────────────────────────────────────────────────────┐
│                    用戶端（Browser）                   │
│                  Next.js 15 (App Router)              │
│         React Server Components + Client Components   │
└─────────────────┬───────────────────────┬─────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────┐  ┌──────────────────────────┐
│    Next.js API Routes    │  │   Supabase Realtime      │
│    /api/*               │  │   (WebSocket)             │
│    - Auth middleware     │  │   - 即時行情              │
│    - Rate limiting      │  │   - 通知                  │
└─────────┬───────────────┘  └──────────┬───────────────┘
          │                              │
          ▼                              ▼
┌─────────────────────────────────────────────────────┐
│                  Supabase (BaaS)                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────────────┐  │
│  │ PostgreSQL│ │   Auth    │ │  Storage (Files)  │  │
│  │  Database │ │  System   │ │  - 用戶頭像        │  │
│  └───────────┘ └───────────┘ └───────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Monorepo 結構

```
nschool-finance/
├── apps/
│   └── web/                    # Next.js 主應用
│       ├── app/                # App Router 頁面
│       │   ├── (auth)/         # 認證相關頁面
│       │   ├── (dashboard)/    # 主要功能頁面
│       │   └── api/            # API 路由
│       ├── components/         # React 元件
│       ├── lib/                # 工具函數
│       └── styles/             # 全域樣式
├── packages/
│   ├── ui/                     # 共享 UI 元件庫
│   └── config/                 # 共享設定
├── supabase/
│   └── migrations/             # 資料庫遷移檔案
└── .ai-company/                # AI 管理架構（本文件所在）
```

## 核心模組

### 1. 記帳模組（Transactions）
- CRUD 操作
- 分類管理
- 點擊刪除 + 復原機制
- 記住上次使用的分類

### 2. 模擬交易模組（Trading Simulation）
- 即時行情 API 串接（WebSocket）
- 買/賣/持倉管理
- 快速選量按鈕（25%/50%/75%/100%）
- 市場情緒指標

### 3. AI 分析模組
- 財務健康分析
- 投資建議
- 支出模式分析

### 4. 學習模組（Learning）
- 課程內容
- 進度追蹤（API 已串接）
- 測驗系統

### 5. 認證模組（Auth）
- 登入 / 註冊
- 忘記密碼
- Auth middleware

## 部署架構

```
GitHub (main branch)
    │
    ▼ (自動部署)
Zeabur
    ├── Web Service (Next.js)
    └── 環境變數管理
```

## 關鍵技術決策

| 決策 | 選擇 | 原因 |
|------|------|------|
| 框架 | Next.js 15 | SSR + API Routes + App Router |
| 樣式 | TailwindCSS | 快速開發、一致性好 |
| 資料庫 | Supabase | 免費額度大、Auth 內建、Realtime |
| 部署 | Zeabur | 台灣團隊、對 Next.js 支援好 |
| 套件管理 | pnpm | 快、省硬碟、Monorepo 支援好 |

---

*最後更新：2026-03-22*
