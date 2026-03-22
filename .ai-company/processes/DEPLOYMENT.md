# 部署流程 (Deployment)

> nSchool Finance 的完整部署流程：GitHub → Actions → Docker → Zeabur

---

## 部署架構

```
開發者/AI Push
      │
      ▼
GitHub Repository (main branch)
      │
      ▼
GitHub Actions 觸發
      │
      ├── pnpm install
      ├── TypeScript 型別檢查
      ├── ESLint 檢查
      ├── 單元測試
      └── pnpm build
            │
            ▼ (通過後)
      Docker Build
            │
            ▼
      推送到 Container Registry
            │
            ▼
      Zeabur 自動拉取新映像
            │
            ▼
      Health Check 確認
            │
            ▼
      部署完成 ✅
```

---

## GitHub Actions 設定

```yaml
# .github/workflows/deploy.yml（示意）
name: Deploy to Zeabur

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      # Zeabur 透過 GitHub 整合自動部署，不需要額外步驟
```

---

## Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 安裝 pnpm
RUN npm install -g pnpm

# 安裝依賴
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# 生產映像
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

---

## 環境設定

### GitHub Secrets（CI/CD 使用）
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Zeabur 環境變數（Runtime 使用）
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
NEWS_API_KEY
ALPHA_VANTAGE_API_KEY
NEXT_PUBLIC_APP_URL
```

---

## 部署環境

| 環境 | Branch | 用途 |
|------|--------|------|
| Production | main | 正式用戶 |
| Staging | staging | QA 測試 |
| Preview | PR | PR 預覽（Zeabur 自動） |

---

## 資料庫遷移

```bash
# 本地開發測試遷移
supabase db diff -f migration_name    # 生成 migration 檔
supabase db push                       # 推送到本地

# 生產環境遷移（需人確認）
supabase db push --linked              # 推送到 Supabase 雲端

# ⚠️ 生產遷移前必須：
# 1. 在 Staging 環境測試通過
# 2. 確認遷移可回滾
# 3. 人確認後執行
```

---

## 部署後確認清單

```
部署完成後 5 分鐘內確認：

[ ] 網站可以正常訪問
[ ] 登入流程正常
[ ] 行情 API 有回傳資料
[ ] Supabase 連線正常（查看 Dashboard）
[ ] GitHub Actions 全部綠燈
[ ] 沒有 JS 錯誤（查看 Console）
```

---

## 緊急回滾

```bash
# 方法一：Zeabur 介面回滾（推薦）
# Zeabur Dashboard → Deployments → 選擇上一個版本 → Redeploy

# 方法二：Git Revert（需部署）
git revert HEAD --no-edit
git push origin main
# 等待 GitHub Actions 完成新部署
```

---

*最後更新：2026-03-22*
