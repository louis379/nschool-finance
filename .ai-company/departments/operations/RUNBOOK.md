# 營運手冊（Runbook）

> 常見操作和問題處理的標準流程

---

## 部署流程

### 標準部署（Zeabur 自動部署）

1. 確認 `main` branch 的 CI 通過
2. Push 到 `main` → Zeabur 自動偵測並部署
3. 等待部署完成（通常 2-3 分鐘）
4. 驗證：訪問生產環境確認功能正常
5. 如果有問題，在 Zeabur dashboard 回滾到上一版

### 手動部署（緊急修復）

```bash
# 1. 確認在 main branch
git checkout main

# 2. Cherry-pick 修復 commit
git cherry-pick <commit-hash>

# 3. Push 觸發部署
git push origin main

# 4. 在 Zeabur dashboard 監控部署狀態
```

## 資料庫操作

### Supabase Migration

```bash
# 建立新的 migration
pnpm supabase migration new <migration-name>

# 編輯 migration 檔案
# supabase/migrations/<timestamp>_<name>.sql

# 推送到遠端（需要人確認）
pnpm supabase db push
```

### 資料庫備份

- Supabase 有自動每日備份（Pro plan）
- 重要操作前手動備份：Supabase Dashboard → Settings → Backups

## 環境變數

### 必要的環境變數

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase 專案 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase 匿名 Key
SUPABASE_SERVICE_ROLE_KEY=       # Supabase 服務端 Key（僅後端）
```

### 更新環境變數

1. 在 Zeabur Dashboard 更新
2. 重新部署服務使變數生效
3. ⚠️ 此操作需要人（Louis）確認

## 常見問題處理

### 問題：網站無法訪問

```
1. 檢查 Zeabur 服務狀態
2. 檢查 Supabase 是否正常（dashboard.supabase.com）
3. 檢查 DNS 解析是否正常
4. 如果是部署失敗，在 Zeabur 回滾
5. 記錄事件到本文件的「事件紀錄」區
```

### 問題：API 回應緩慢

```
1. 檢查 Supabase 資料庫負載
2. 檢查是否有未優化的查詢
3. 檢查 Zeabur 服務的資源使用率
4. 如果是突發流量，考慮暫時升級方案
```

### 問題：Build 失敗

```
1. 查看 CI 日誌確認錯誤原因
2. 常見原因：TypeScript 型別錯誤、缺少依賴、環境變數未設定
3. 在本地重現問題：pnpm build
4. 修復後推送新 commit
```

## 事件紀錄

### 格式

```markdown
#### [日期 時間] 事件標題
- **影響**：[影響範圍]
- **原因**：[根本原因]
- **處理**：[處理步驟]
- **恢復時間**：[多久恢復]
- **後續**：[防止再發的措施]
```

（從今天開始記錄事件）

---

*最後更新：2026-03-22*
