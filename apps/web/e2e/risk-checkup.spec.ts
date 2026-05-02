import { expect, test } from '@playwright/test';

/**
 * E2E: 登入 → 進 risk-checkup → 看到 KPI cards
 *
 * 因為 Supabase auth 需要實體用戶，這裡走「跳過 onboarding + 注入 localStorage 持倉」的路徑，
 * 模擬一個已用過模擬交易、有 5+ 筆持倉的用戶（CHARTER 第 1 段定義的目標用戶）。
 */
test.describe('risk-checkup', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('nschool-onboarded', '1');
      window.localStorage.setItem(
        'nschool-holdings',
        JSON.stringify([
          { symbol: '2330', name: '台積電',  qty: 10, avgCost: 600,  currentPrice: 700, pnlPercent: 16.7 },
          { symbol: '2317', name: '鴻海',     qty: 50, avgCost: 100,  currentPrice: 110, pnlPercent: 10.0 },
          { symbol: '2454', name: '聯發科',   qty:  5, avgCost: 900,  currentPrice: 950, pnlPercent:  5.6 },
          { symbol: 'NVDA', name: 'NVIDIA',   qty:  2, avgCost: 800,  currentPrice: 900, pnlPercent: 12.5 },
          { symbol: 'AAPL', name: 'Apple',    qty:  3, avgCost: 170,  currentPrice: 180, pnlPercent:  5.9 },
        ])
      );
    });
  });

  test('logged-in user sees KPI cards on /risk-checkup', async ({ page }) => {
    await page.goto('/risk-checkup');
    await expect(page.getByRole('heading', { name: /投資組合風險體檢/ })).toBeVisible();
    await expect(page.getByTestId('kpi-cards')).toBeVisible();
    await expect(page.getByTestId('risk-tiles')).toBeVisible();
  });

  test('mobile viewport renders the same essentials', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => {
      window.localStorage.setItem('nschool-onboarded', '1');
      window.localStorage.setItem(
        'nschool-holdings',
        JSON.stringify([
          { symbol: '2330', name: '台積電', qty: 10, avgCost: 600, currentPrice: 700, pnlPercent: 16.7 },
          { symbol: '2317', name: '鴻海',    qty: 50, avgCost: 100, currentPrice: 110, pnlPercent: 10.0 },
        ])
      );
    });
    const page = await context.newPage();
    await page.goto('/risk-checkup');
    await expect(page.getByTestId('kpi-cards')).toBeVisible();
    await context.close();
  });
});
