# AI 驅動公司管理架構

> 墨宇集團 × nSchool Finance — AI 時代的公司運作模式

---

## 這是什麼？

`.ai-company/` 是 nSchool Finance 的 **AI 公司大腦**。
所有部門角色、流程、決策紀錄、知識庫都存放在這裡，讓 AI 員工能在每次對話中快速理解公司背景、自主執行任務、並留下可追溯的工作紀錄。

---

## 公司基本資訊

| 項目 | 內容 |
|------|------|
| 集團 | 墨宇集團（年營收 3 億） |
| 產品 | nSchool Finance — 財經教育 APP |
| 目標 | 讓每個人輕鬆學會投資理財 |
| 主要用戶 | 20–35 歲投資新手 |
| 技術棧 | Next.js + Supabase + pnpm monorepo + Zeabur |

---

## 人與 AI 的分工

### AI 可以自主執行（無需確認）

- UX 優化與介面改善
- Bug 修復（非核心業務邏輯）
- 效能改善與程式碼重構
- 新功能原型開發
- 搜尋市場趨勢與競品資訊
- 文件撰寫與更新
- 測試覆蓋率提升
- 技術債清理

### 需要人（CEO/Director）確認後才能執行

- 商業邏輯變更（定價、付費功能設計）
- 對外溝通（新聞稿、社群貼文、用戶通知）
- 大型架構重構（影響超過 3 個模組）
- 資料庫 Schema 破壞性變更
- 第三方服務整合（涉及費用或合約）
- 隱私政策、法律條款相關變更

---

## 組織架構

```
CEO / Director（人）
│
├── 產品部 (Product)          → 功能方向、路線圖、用戶需求
├── 工程部 (Engineering)      → 技術實作、架構設計、效能
├── 設計部 (Design)           → UI/UX、設計系統、用戶體驗
├── 品質部 (QA)               → 測試、Bug 追蹤、品質保證
├── 成長部 (Growth)           → 指標追蹤、用戶增長、留存
└── 營運部 (Operations)       → 部署、監控、事件處理
```

每個部門都有對應的 `ROLE.md`，詳細定義：
- 職責範圍
- 目標 KPI
- AI 自主決策權限
- 需要人確認的事項

---

## 每天的工作流程

### 早晨（AI 自動）
1. 讀取 `DAILY-STANDUP.md` 了解昨日進度
2. 讀取 `SPRINT-BOARD.md` 確認當前任務優先序
3. 讀取相關部門 `ROLE.md` 了解今日角色
4. 開始執行任務，過程中更新任務狀態

### 執行中（AI 自動）
1. 完成任務後更新 `SPRINT-BOARD.md` 狀態
2. 重大決策記錄到對應部門的 `DECISIONS.md`
3. Bug 記錄到 `qa/BUG-TRACKER.md`
4. 技術債記錄到 `engineering/TECH-DEBT.md`

### 收工前（AI 自動）
1. 在 `DAILY-STANDUP.md` 新增今日完成事項
2. 更新 `CHANGELOG.md`
3. 需要人確認的事項列在 `ESCALATION.md`

---

## 檔案結構說明

```
.ai-company/
├── README.md                    # 本文件：架構總覽
├── DAILY-STANDUP.md             # 每日站會紀錄
├── SPRINT-BOARD.md              # Sprint 任務看板
├── departments/                 # 各部門文件
│   ├── product/                 # 產品部
│   ├── engineering/             # 工程部
│   ├── design/                  # 設計部
│   ├── qa/                      # 品質部
│   ├── growth/                  # 成長部
│   └── operations/              # 營運部
├── knowledge-base/              # 公司知識庫
│   ├── COMPANY-VISION.md        # 願景與使命
│   ├── USER-PERSONAS.md         # 用戶人物誌
│   ├── COMPETITIVE-ANALYSIS.md  # 競品分析
│   └── TECH-STACK.md            # 技術棧說明
├── processes/                   # 流程文件
│   ├── DEVELOPMENT-CYCLE.md     # 開發循環
│   ├── REVIEW-CHECKLIST.md      # Review 清單
│   ├── DEPLOYMENT.md            # 部署流程
│   └── ESCALATION.md            # 問題升級
└── reports/                     # 報告
    ├── WEEKLY-REPORT.md         # 週報
    └── CHANGELOG.md             # 變更日誌
```

---

## 給 AI 的行動準則

1. **先讀再做** — 執行任務前先確認相關 ROLE.md 和 SPRINT-BOARD.md
2. **留下紀錄** — 所有決策和變更都要記錄
3. **小步快跑** — 優先完成小而確定的任務，再處理大型需求
4. **遇到不確定就問** — 超出自主權限時，記錄在 ESCALATION.md 並通知人
5. **用戶優先** — 所有決策最終回歸：對 20-35 歲投資新手有沒有幫助？

---

*最後更新：2026-03-22 | 版本：v1.0*
