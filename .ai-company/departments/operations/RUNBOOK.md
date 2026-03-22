# 運維手冊 (Runbook)

> 常見操作和緊急處理的標準步驟。

---

## 每日例行檢查

```bash
# 1. 確認 Zeabur 部署狀態
# 前往 Zeabur Dashboard 確認服務健康

# 2. 檢查 Supabase 連線
# 前往 Supabase Dashboard > API > Health

# 3. 查看 GitHub Actions 最新執行
gh run list --limit 5

# 4. 確認環境變數完整
# Zeabur Dashboard > Environment Variables
```

---

## 部署操作

### 標準部署
```bash
# 1. 確認 main branch 是最新的
git checkout main
git pull origin main

# 2. 確認測試通過
pnpm typecheck
pnpm lint

# 3. Push 觸發自動部署
git push origin main

# 4. 監控部署日誌
gh run watch
```

### 緊急回滾
```bash
# 找到上一個正常的 commit
git log --oneline -10

# 建立回滾 PR（不要直接 force push）
git checkout -b fix/rollback-to-XXXXXX
git revert HEAD --no-edit
git push origin fix/rollback-to-XXXXXX

# 建立 PR 並緊急合併
gh pr create --title "緊急回滾" --body "回滾原因：[描述]"
```

---

## 常見問題處理

### 問題：Supabase 連線失敗
```bash
# 症狀：API 回傳 503 或 connection refused
# 檢查：
# 1. Supabase Dashboard 確認服務狀態
# 2. 確認 NEXT_PUBLIC_SUPABASE_URL 環境變數正確
# 3. 確認 Supabase 未超過免費方案限制（50K 月活）

# 短期處理：
# 在 Zeabur 重啟服務（不重新部署）
```

### 問題：行情 API 回傳空資料
```bash
# 症狀：股票頁面顯示 -- 或載入失敗
# 檢查：
# 1. 確認 API key 未過期
# 2. 確認未超過免費方案請求限制（Yahoo Finance）
# 3. 嘗試備用 API（Alpha Vantage）

# 短期處理：
# 顯示「行情暫時無法取得」提示，不讓頁面崩潰
```

### 問題：部署失敗
```bash
# 查看失敗原因
gh run view --log-failed

# 常見原因：
# 1. TypeScript 錯誤 → 修復型別錯誤再 push
# 2. 環境變數缺失 → Zeabur 補上對應 key
# 3. pnpm 套件衝突 → 刪除 node_modules 重裝
# 4. Docker build 失敗 → 確認 Dockerfile 語法

pnpm clean && pnpm install
```

### 問題：JWT 認證失效（用戶大量登出）
```bash
# 症狀：用戶回報突然被登出，refresh token 無法使用
# 緊急處理：
# 1. 確認 Supabase JWT secret 未被更改
# 2. 確認 SUPABASE_SERVICE_ROLE_KEY 環境變數正確
# 3. 若非技術問題，可能是 Supabase 服務異常
# 4. 告知用戶重新登入（透過 App 公告）

# ⚠️ 不要重設 JWT secret，這會讓所有用戶登出
```

---

## 安全事件處理

### API Key 洩漏
```bash
# 1. 立即在對應服務 Rotate Key
# 2. 在 Zeabur 更新新的 Key
# 3. 確認 git history 沒有殘留（用 git secrets 掃描）
# 4. 記錄事件到 ESCALATION.md
# 5. 通知 CEO（人）
```

### 疑似資料洩漏
```bash
# 1. 立即通知 CEO（人）
# 2. 不要自行處理，等待指示
# 3. 記錄發現時間、可能的影響範圍
```

---

## 監控看板（待建立）

- Sentry：前端錯誤追蹤
- Zeabur Metrics：CPU、記憶體、流量
- Supabase Dashboard：資料庫效能、連線數

---

*最後更新：2026-03-22*
