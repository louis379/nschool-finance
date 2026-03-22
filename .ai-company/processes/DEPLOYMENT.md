# 部署流程

> 從程式碼提交到上線的完整流程

---

## 部署架構

```
開發者（人 / AI）
    │
    ▼ git push
GitHub (main branch)
    │
    ▼ 自動觸發
GitHub Actions (CI)
    ├── pnpm install
    ├── pnpm lint
    ├── pnpm build
    └── pnpm test
    │
    ▼ CI 通過
Zeabur（自動部署）
    └── Production 環境
```

## 部署前檢查清單

### AI Agent 自動檢查

- [ ] TypeScript 編譯無錯誤
- [ ] ESLint 規則全部通過
- [ ] 現有測試全部通過
- [ ] Build 成功

### 需要人確認

- [ ] 確認改動內容符合預期
- [ ] 確認不涉及資料庫 schema 變更
- [ ] 確認不涉及環境變數變更
- [ ] 確認不影響現有用戶數據

## 部署類型

### 1. 自動部署（常規更新）

適用：UX 優化、Bug 修復、效能改善

```
AI 完成改動 → CI 通過 → 人確認 → Push 到 main → Zeabur 自動部署
```

### 2. 手動部署（需要額外步驟）

適用：資料庫變更、環境變數變更

```
AI 準備改動 → 人確認 → 執行 DB migration → 更新環境變數 → Push 到 main
```

### 3. 緊急修復（Hotfix）

適用：Production bug

```
AI 修復 → 快速測試 → 人確認 → Cherry-pick 到 main → 立即部署
```

## 回滾流程

如果部署後發現問題：

1. **立即回滾**：在 Zeabur Dashboard 選擇上一個成功的部署版本
2. **分析問題**：查看錯誤日誌，找出問題原因
3. **修復**：在新的 branch 修復問題
4. **重新部署**：通過正常流程再次部署
5. **記錄**：在 `departments/operations/RUNBOOK.md` 記錄事件

## Git 分支策略

```
main ─────────────────────────── 生產環境
  └── claude/xxx ──── AI 的工作分支（完成後合併到 main）
```

- `main`：永遠是可部署的狀態
- `claude/*`：AI Agent 的工作分支，完成後 merge 到 main
- 不需要 Pull Request（因為只有 AI + Louis 兩個「人」）

---

*最後更新：2026-03-22*
