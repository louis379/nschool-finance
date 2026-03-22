# AI 驅動公司管理架構

> 墨宇集團 — nSchool Finance 專案
> 最後更新：2026-03-22

## 概述

這是一套 **AI 驅動的公司管理架構**，用於管理 nSchool Finance 的產品開發與營運。核心理念是將 AI 視為「員工」，建立類似公司組織的架構，讓 AI Agent 能自主迭代開發，人類負責方向指引與品質把關。

## 架構設計理念

### 三層架構（參考墨宇 AI 創業生態系白皮書）

```
母公司（墨宇集團）
  └── 投資公司 / 產品線
       └── 生態系（各 AI Agent 協作）
```

### 人與 AI 的分工

| 角色 | 職責 | 頻率 |
|------|------|------|
| **人（Louis）** | 設定方向、Review 進度、決策商業邏輯、對外溝通 | 每日 15-30 分鐘 |
| **AI Agent** | 開發、測試、優化、產生報告、追蹤指標 | 持續自動運作 |

### AI 自主決策權限

**可自主執行（不需人確認）：**
- UX/UI 微調與優化
- Bug 修復（不涉及商業邏輯）
- 效能改善與程式碼重構
- 新功能原型製作
- 測試撰寫與執行
- 文件更新

**需要人確認：**
- 商業邏輯變更（定價、訂閱方案等）
- 大型架構重構
- 新的第三方服務整合
- 對外溝通內容
- 資料庫 schema 重大變更
- 部署到 production

## 每日工作流程

```
06:00  排程任務自動啟動
       ├── 讀取 DAILY-STANDUP.md 了解昨日方向
       ├── 讀取 SPRINT-BOARD.md 了解當前任務
       ├── 掃描各部門文件取得上下文
       └── 開始自主開發循環

09:00  人（Louis）早上 Review
       ├── 查看 AI 昨晚的工作成果
       ├── 在 DAILY-STANDUP.md 寫下今日方向
       ├── 更新 SPRINT-BOARD.md 優先順序
       └── 回覆 AI 的升級請求（ESCALATION）

12:00  AI 午間報告
       └── 更新進度到 SPRINT-BOARD.md

18:00  AI 日報生成
       ├── 更新 CHANGELOG.md
       └── 產生進度摘要

22:00  AI 夜間自主開發
       ├── 處理低風險的優化任務
       ├── 執行測試套件
       └── 準備隔天的工作計畫
```

## 資料夾結構

```
.ai-company/
├── README.md                    ← 你在這裡
├── DAILY-STANDUP.md             # 每日站會紀錄
├── SPRINT-BOARD.md              # Sprint 任務看板
├── departments/                 # 各部門定義
│   ├── product/                 # 產品部
│   ├── engineering/             # 工程部
│   ├── design/                  # 設計部
│   ├── qa/                      # 品質部
│   ├── growth/                  # 成長部
│   └── operations/              # 營運部
├── knowledge-base/              # 公司知識庫
├── processes/                   # 流程定義
└── reports/                     # 自動生成報告
```

## 如何使用

### 對 AI Agent（排程任務）

每次執行前，請按以下順序讀取文件：

1. `DAILY-STANDUP.md` — 了解人給的最新方向
2. `SPRINT-BOARD.md` — 了解當前任務與優先級
3. 對應部門的 `ROLE.md` — 了解自己的職責範圍
4. `knowledge-base/` 下的相關文件 — 了解產品上下文
5. `processes/DEVELOPMENT-CYCLE.md` — 遵循開發流程

### 對人（Louis）

1. 每天花 15 分鐘更新 `DAILY-STANDUP.md`
2. 每週 Review `SPRINT-BOARD.md` 並調整優先級
3. 遇到 AI 的升級請求時，在對應文件中回覆決策
4. 定期檢視 `reports/WEEKLY-REPORT.md` 了解整體進度
