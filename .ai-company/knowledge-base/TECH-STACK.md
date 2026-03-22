# 技術棧說明 (Tech Stack)

> AI 在開發前必讀：了解我們用什麼技術、為什麼這樣選。

---

## 核心技術棧

### 前端框架：Next.js 15
- **為什麼：** React 最成熟的全端框架，App Router 支援 Server Components
- **版本：** 15.x（最新穩定版）
- **Router：** App Router（不用 Pages Router）
- **渲染策略：** 混合使用 SSR/SSG/CSR

### 語言：TypeScript
- **為什麼：** 型別安全，AI 更容易理解程式碼意圖
- **嚴格度：** `strict: true`，不允許 `any`
- **版本：** 5.x

### 樣式：Tailwind CSS
- **為什麼：** 開發速度快，設計系統一致性好
- **版本：** 4.x
- **規範：** 優先使用 utility class，避免自訂 CSS

### 後端：Supabase
- **服務：**
  - **PostgreSQL** — 主要資料庫
  - **Auth** — 用戶認證（Email/Google OAuth）
  - **Storage** — 圖片、課程素材上傳
  - **Realtime** — 即時訂閱（用戶通知）
  - **Edge Functions** — 複雜後端邏輯（視需要）
- **客戶端：** `@supabase/supabase-js`
- **RLS：** 所有表格啟用 Row Level Security

### 套件管理：pnpm + Turborepo
- **pnpm：** 比 npm/yarn 快，磁碟空間省
- **Turborepo：** Monorepo 建構快取，多套件管理
- **工作區：** `pnpm-workspace.yaml`

### 部署：Zeabur + Docker
- **Zeabur：** 台灣雲端平台，支援 Docker
- **Docker：** 確保環境一致性
- **CI/CD：** GitHub Actions → Docker Build → Zeabur

---

## 第三方 API

| API | 用途 | 免費額度 | 文件 |
|-----|------|---------|------|
| Yahoo Finance | 即時行情（主要） | 有限制 | yfinance |
| Alpha Vantage | 行情（備用） | 25 req/day | alphavantage.co |
| Claude API | AI 分析和個人化 | Pay-as-go | anthropic.com |
| NewsAPI | 財經新聞 | 100 req/day（開發） | newsapi.org |

---

## 開發工具

| 工具 | 用途 |
|------|------|
| ESLint | 程式碼風格檢查 |
| Prettier | 格式化 |
| Vitest | 單元測試 |
| Playwright | E2E 測試 |
| Husky | Git hooks（commit 前檢查） |
| lint-staged | 只 lint 有改動的檔案 |

---

## 重要套件

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@supabase/supabase-js": "^2.x",
    "lucide-react": "最新",
    "recharts": "圖表",
    "date-fns": "日期處理",
    "zod": "資料驗證",
    "react-hook-form": "表單",
    "@anthropic-ai/sdk": "Claude API"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "vitest": "測試",
    "playwright": "E2E 測試"
  }
}
```

---

## 環境設定

```
開發環境：localhost:3000
測試環境：Supabase 本地實例（supabase start）
生產環境：Zeabur + Supabase 雲端
```

### 本地開發啟動

```bash
# 安裝依賴
pnpm install

# 啟動 Supabase 本地實例（需安裝 Supabase CLI）
supabase start

# 設定環境變數
cp apps/web/.env.example apps/web/.env.local
# 填入本地 Supabase 的 URL 和 Key

# 啟動開發伺服器
pnpm dev
```

---

## 決策日誌（為什麼不用 X）

| 放棄的選項 | 理由 |
|-----------|------|
| Prisma | 已用 Supabase，ORM 重複；Supabase 客戶端夠用 |
| Redux | 狀態管理過重；優先 Server State + React Query |
| Expo（Native） | 初期 Web 優先，有需求再用 Capacitor 打包 |
| Firebase | Supabase 開源，PostgreSQL 更熟悉，避免廠商鎖定 |
| Vercel | 選 Zeabur 因為台灣本地化更好，費用相對低 |

---

*最後更新：2026-03-22*
