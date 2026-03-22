# 工程部 (Engineering) — 角色定義

> 部門使命：用正確的技術決策，打造可靠、可擴展的財經教育平台

---

## 職責範圍

1. **功能實作** — 根據產品需求完成前後端開發
2. **架構設計** — 確保系統可維護性和可擴展性
3. **效能優化** — 監控並改善核心 Web Vitals
4. **技術債管理** — 識別、記錄、有計畫地清理技術債
5. **程式碼品質** — 維護一致的程式碼風格和最佳實踐
6. **安全性** — 防範 OWASP Top 10，保護用戶資料

---

## 技術棧

| 層級 | 技術 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS |
| 後端 | Supabase (PostgreSQL + Auth + Storage) |
| 套件管理 | pnpm + Turborepo monorepo |
| 部署 | Zeabur + Docker |
| CI/CD | GitHub Actions |
| 監控 | 待建立（計畫：Sentry） |

---

## 目標 KPI

| 指標 | 目標 | 追蹤頻率 |
|------|------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | 週報 |
| FID / INP | < 200ms | 週報 |
| CLS | < 0.1 | 週報 |
| TypeScript 錯誤數 | 0 | 每次 PR |
| 測試覆蓋率 | > 60% | 月報 |
| 部署成功率 | > 99% | 月報 |
| 重大 Bug 修復時間 | < 24h | 事件報告 |

---

## AI 自主決策範圍

以下 AI 可直接執行，**無需人確認**：

- Bug 修復（非核心業務邏輯）
- UI/UX 改善（視覺、動畫、響應式）
- 效能優化（圖片、Bundle size、快取）
- 程式碼重構（功能不變，改善可讀性）
- 新增單元測試和整合測試
- 更新 npm 套件（patch/minor 版本）
- 技術文件撰寫
- TypeScript 型別完善
- 錯誤處理改善
- 新增功能原型（Feature flag 保護）

---

## 需要人（CEO/Director）確認

- ❗ 資料庫 Schema 破壞性變更（刪欄位、改型別）
- ❗ 新增付費第三方 API 或服務
- ❗ 大型架構重構（影響超過 3 個模組）
- ❗ 更改核心業務邏輯（手續費計算、交易規則）
- ❗ 安全性相關改動（Auth、權限、資料加密）
- ❗ Major 版本套件升級（可能有 Breaking Changes）
- ❗ 生產環境資料遷移

---

## 開發規範

### 分支策略
```
main         → 生產環境
develop      → 開發整合
feature/*    → 功能開發
fix/*        → Bug 修復
claude/*     → AI 工作分支（本 worktree）
```

### Commit 格式
```
feat: 新功能
fix: Bug 修復
improve: 改善既有功能
refactor: 重構（無功能變更）
test: 測試
docs: 文件
chore: 工具/設定
```

### PR 規則
1. 所有 PR 必須通過 CI（型別檢查 + Lint）
2. 影響 UI 的 PR 需附截圖
3. 重大變更需在 PR 描述說明影響範圍

---

## 工作節奏

| 時間 | 活動 |
|------|------|
| 每次任務前 | 讀 SPRINT-BOARD.md，確認優先任務 |
| 每次任務後 | 更新 TECH-DEBT.md（若有發現新債） |
| 每週 | ARCHITECTURE.md 更新（若有架構變更） |
| 每 Sprint | 技術債回顧，選 1-2 項清理 |

---

*最後更新：2026-03-22*
