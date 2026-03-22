# AI 開發循環流程 (Development Cycle)

> nSchool Finance 的 AI 驅動開發流程，每個 Sprint 2 週。

---

## 開發循環總覽

```
Week 1                      Week 2
────────────────────────────────────────────────────
Sprint Planning             開發繼續 + Code Review
│                           │
▼                           ▼
開發 + 每日更新              整合測試
│                           │
▼                           ▼
中途 Review（Week 1 末）     Sprint Review
                            │
                            ▼
                            Sprint Retrospective
                            │
                            ▼
                            下一個 Sprint Planning
```

---

## Sprint 規劃（Sprint Planning）

**何時：** 每個 Sprint 的第一天（週一）
**參與：** 人（CEO）+ AI

### AI 在 Planning 前做：
1. 更新 BACKLOG.md（優先序排列）
2. 分析上個 Sprint 完成率
3. 識別技術依賴和風險
4. 準備 Sprint 目標草案

### Planning 討論項目：
1. 確認 Sprint 目標（人決定方向）
2. 選取本 Sprint 任務（人確認優先序）
3. 識別需人確認的事項
4. AI 評估工作量

### 產出：
- 更新 SPRINT-BOARD.md
- 確認本 Sprint 的「完成定義」（Definition of Done）

---

## 每日開發節奏

### 每次 AI 工作開始時：

```
1. 讀 DAILY-STANDUP.md（了解昨日進度）
2. 讀 SPRINT-BOARD.md（確認今日任務）
3. 讀相關部門 ROLE.md（確認自主權限）
4. 開始執行任務
```

### 每次 AI 工作結束時：

```
1. 更新 SPRINT-BOARD.md（任務狀態）
2. 更新 DAILY-STANDUP.md（完成事項 + 明日計畫）
3. 記錄決策到對應 DECISIONS.md
4. 記錄 Bug 到 BUG-TRACKER.md
5. 記錄技術債到 TECH-DEBT.md
6. 若有需人確認事項，記錄到 ESCALATION.md
```

---

## AI 任務執行流程

```
收到任務
    │
    ▼
判斷：是否在自主決策範圍內？
    │
    ├── 是 → 直接執行
    │           │
    │           ▼
    │        完成後記錄
    │
    └── 否 → 記錄到 ESCALATION.md
              │
              ▼
           等待人確認
              │
              ▼
           人確認後執行
```

---

## 程式碼開發標準流程

### 1. 功能開發
```bash
# 從 claude/* worktree 開發
# 不用手動建 branch，worktree 已有隔離

# 開發完成後
pnpm typecheck    # 確認無型別錯誤
pnpm lint         # 確認無 lint 錯誤
```

### 2. Commit 規範
```
feat: 新功能簡短描述
fix: Bug 修復簡短描述
improve: 現有功能改善
refactor: 重構（無功能變更）
docs: 文件更新
chore: 工具/設定/依賴更新
```

### 3. 完成定義（Definition of Done）

功能被視為「完成」必須滿足：
- [ ] 功能邏輯正確，符合 AC（驗收條件）
- [ ] TypeScript 無型別錯誤
- [ ] ESLint 無錯誤（警告可接受）
- [ ] 有對應的基本測試
- [ ] UI 在手機和桌面都正常顯示
- [ ] 已更新相關文件
- [ ] 已 commit 並 push

---

## Sprint Review

**何時：** 每個 Sprint 最後一天（週五）
**參與：** 人（CEO）+ AI

### AI 準備：
1. Sprint 完成度報告
2. 完成功能展示說明
3. 未完成原因分析
4. 下個 Sprint 建議

### Review 產出：
- 更新 WEEKLY-REPORT.md
- 更新 CHANGELOG.md
- 確認下個 Sprint 方向

---

## 緊急任務處理

當出現緊急情況（P1 Bug、安全漏洞）：

```
1. AI 立即停止當前任務
2. 評估影響範圍
3. 若可自主處理 → 立即修復
4. 若需人確認 → 立即通知（更新 ESCALATION.md）
5. 修復後記錄事件
```

---

*最後更新：2026-03-22*
