# 營運部 (Operations) — 角色定義

> 部門使命：確保 nSchool Finance 24/7 穩定運行，故障快速恢復

---

## 職責範圍

1. **部署管理** — 執行和監控生產環境部署
2. **監控與警報** — 設定並追蹤系統健康指標
3. **事件處理** — 快速識別、診斷、修復生產環境問題
4. **環境管理** — 維護開發、測試、生產三個環境
5. **安全運維** — 憑證管理、存取控制、安全掃描
6. **成本控制** — 追蹤並優化雲服務費用

---

## 基礎架構

```
環境        平台          URL
─────────────────────────────────────────────
Production  Zeabur       nschool.finance（待設定）
Staging     Zeabur       staging.nschool.finance（待設定）
Development 本機          localhost:3000
Database    Supabase     supabase.com（託管）
```

---

## 目標 KPI（SLA）

| 指標 | 目標 | 警報閾值 |
|------|------|---------|
| 可用性（Uptime） | > 99.9% | < 99.5% |
| API 回應時間（P95） | < 500ms | > 1000ms |
| 部署成功率 | > 99% | < 95% |
| 平均修復時間（MTTR） | < 30 分鐘 | > 60 分鐘 |
| 月雲服務費用 | < NT$3,000 | > NT$5,000 |

---

## AI 自主決策範圍

以下 AI 可直接執行，**無需人確認**：

- 監控部署日誌，識別錯誤
- 在 Staging 環境執行部署
- 更新環境設定文件（RUNBOOK.md）
- 撰寫部署腳本和 CI/CD 設定
- 優化 Docker 映像大小
- 設定 GitHub Actions 工作流程
- 回應並診斷系統警報（記錄結果）

---

## 需要人（CEO/Director）確認

- ❗ 生產環境部署（首次或重大版本）
- ❗ 資料庫生產環境遷移
- ❗ 更換雲服務供應商
- ❗ 增加雲服務費用（超過 NT$1,000/月）
- ❗ 修改安全設定（防火牆、存取控制）
- ❗ 資料備份/還原操作

---

## 環境變數清單

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # 僅 Server-side

# AI
ANTHROPIC_API_KEY=

# 行情 API
YAHOO_FINANCE_API_KEY=          # 備用
ALPHA_VANTAGE_API_KEY=

# 新聞
NEWS_API_KEY=

# 其他
NEXT_PUBLIC_APP_URL=
```

⚠️ 所有 key 存放在 Zeabur 環境變數，**絕不**進入版控。

---

## 部署流程（簡述）

```
1. Push to main branch
2. GitHub Actions 觸發
3. pnpm build + type check + lint
4. Docker build
5. Push to registry
6. Zeabur 自動部署
7. Health check 確認
```

詳細流程見：`processes/DEPLOYMENT.md`

---

## 費用追蹤

| 服務 | 計畫 | 月費 |
|------|------|------|
| Supabase | Free（50K MAU 限制） | $0 |
| Zeabur | Developer | ~$5-20 USD |
| Anthropic API | Pay-as-go | 依使用量 |
| GitHub | Free | $0 |
| 網域 | 年繳 | ~$15 USD/年 |

---

*最後更新：2026-03-22*
