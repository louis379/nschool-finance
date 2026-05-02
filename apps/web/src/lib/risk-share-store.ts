/**
 * 簡易 in-memory share-token store。
 * Production 上應換成 Supabase 表 + RLS read-only token。
 * 這裡用 globalThis 確保 dev HMR 不會清掉。
 */

export type RiskSnapshot = {
  summary: { totalValue: number; totalCost: number; pnl: number; pnlPct: number };
  weights: { symbol: string; name: string; value: number; weight: number }[];
  metrics: { var95: number; sharpe: number; maxDrawdown: number; annualizedVol: number };
  concentration: number;
  createdAt: number;
};

type StoreShape = {
  map: Map<string, RiskSnapshot>;
};

const STORE_KEY = '__nschool_risk_share_store__';
const TTL_MS = 24 * 60 * 60 * 1000; // 24h

function getStore(): StoreShape {
  const g = globalThis as unknown as Record<string, unknown>;
  let store = g[STORE_KEY] as StoreShape | undefined;
  if (!store) {
    store = { map: new Map<string, RiskSnapshot>() };
    g[STORE_KEY] = store;
  }
  return store;
}

function gcExpired(): void {
  const store = getStore();
  const now = Date.now();
  for (const [token, snap] of store.map.entries()) {
    if (now - snap.createdAt > TTL_MS) store.map.delete(token);
  }
}

export function saveSnapshot(token: string, snap: RiskSnapshot): void {
  gcExpired();
  getStore().map.set(token, snap);
}

export function loadSnapshot(token: string): RiskSnapshot | null {
  gcExpired();
  const snap = getStore().map.get(token);
  if (!snap) return null;
  if (Date.now() - snap.createdAt > TTL_MS) {
    getStore().map.delete(token);
    return null;
  }
  return snap;
}
