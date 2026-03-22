# 技術棧說明

> nSchool Finance 使用的技術和工具

---

## 核心技術

### 前端

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15 | React 全端框架（App Router） |
| **React** | 19 | UI 框架 |
| **TypeScript** | 5.x | 型別安全 |
| **TailwindCSS** | 3.x | 樣式框架 |
| **lucide-react** | - | 圖示庫 |

### 後端

| 技術 | 用途 |
|------|------|
| **Next.js API Routes** | 後端 API |
| **Supabase** | 資料庫 + Auth + Storage + Realtime |
| **PostgreSQL** | 關聯式資料庫（Supabase 提供） |

### 開發工具

| 工具 | 用途 |
|------|------|
| **pnpm** | 套件管理（Monorepo） |
| **Turbo** | Monorepo 建構工具 |
| **ESLint** | 程式碼品質 |
| **Prettier** | 程式碼格式化 |

### 部署與基礎設施

| 服務 | 用途 |
|------|------|
| **Zeabur** | 應用程式部署和託管 |
| **GitHub** | 程式碼版控 |
| **GitHub Actions** | CI/CD |

## 架構選擇理由

### 為什麼 Next.js？
- SSR 和 SSG 支援，利於 SEO
- App Router 提供更好的伺服器端能力
- API Routes 讓前後端可以在同一個專案
- 社群大、資源多

### 為什麼 Supabase？
- 開源的 Firebase 替代方案
- PostgreSQL 比 NoSQL 更適合財務數據
- 內建 Auth 系統省去自建的時間
- Realtime 功能支援即時行情推送
- 免費額度足夠 MVP 階段

### 為什麼 pnpm Monorepo？
- 共享元件庫（`packages/ui`）
- 共享設定（`packages/config`）
- 快速安裝、節省硬碟空間
- 未來可能加入更多 App（如管理後台）

### 為什麼 Zeabur？
- 台灣團隊，中文支援好
- 對 Next.js 的支援優秀
- 自動偵測框架、零設定部署
- 價格合理

## 開發環境設定

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建構
pnpm build

# 型別檢查
pnpm typecheck

# 程式碼檢查
pnpm lint
```

## 環境變數

參考 `.env.example`：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 未來技術規劃

| 項目 | 時機 | 理由 |
|------|------|------|
| Sentry | 近期 | 錯誤監控和追蹤 |
| PostHog / Mixpanel | 近期 | 用戶行為分析 |
| Redis | 中期 | 快取、Rate limiting |
| E2E Testing（Playwright） | 中期 | 自動化端到端測試 |
| i18n | 遠期 | 多語系支援 |

---

*最後更新：2026-03-22*
