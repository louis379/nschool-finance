-- Watchlist price alerts (CHARTER 2026-05-01)
-- ===============================================

CREATE TABLE IF NOT EXISTS public.watchlist_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below', 'pct_change')),
  target_price NUMERIC(15, 4),
  pct_threshold NUMERIC(8, 4),
  channels TEXT[] NOT NULL DEFAULT ARRAY['line'],
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT watchlist_alerts_target_or_pct CHECK (
    (alert_type IN ('above', 'below') AND target_price IS NOT NULL AND pct_threshold IS NULL)
    OR (alert_type = 'pct_change' AND pct_threshold IS NOT NULL AND target_price IS NULL)
  ),
  CONSTRAINT watchlist_alerts_channels_nonempty CHECK (cardinality(channels) > 0)
);

ALTER TABLE public.watchlist_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_alerts" ON public.watchlist_alerts
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_watchlist_alerts_user
  ON public.watchlist_alerts(user_id, enabled);

CREATE INDEX IF NOT EXISTS idx_watchlist_alerts_symbol
  ON public.watchlist_alerts(symbol)
  WHERE enabled = TRUE;
