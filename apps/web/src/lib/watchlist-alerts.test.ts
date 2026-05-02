import { describe, expect, it } from 'vitest';
import {
  ALERT_CHANNELS,
  PLAN_LIMITS,
  alertLimitForTier,
  canCreateAlert,
  toInsertRow,
  validateAlertInput,
  validateAlertPatch,
} from './watchlist-alerts';

describe('validateAlertInput', () => {
  it('accepts a valid "above" alert and normalizes defaults', () => {
    const result = validateAlertInput({
      symbol: '2330',
      alert_type: 'above',
      target_price: 1100,
      channels: ['line'],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({
      symbol: '2330',
      alert_type: 'above',
      target_price: 1100,
      pct_threshold: null,
      channels: ['line'],
      enabled: true,
    });
  });

  it('rejects unknown alert_type', () => {
    const result = validateAlertInput({
      symbol: '2330',
      alert_type: 'sideways',
      target_price: 100,
      channels: ['line'],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'alert_type')).toBe(true);
  });

  it('requires positive target_price for "below"', () => {
    const result = validateAlertInput({
      symbol: 'AAPL',
      alert_type: 'below',
      target_price: 0,
      channels: ['email'],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'target_price')).toBe(true);
  });

  it('requires pct_threshold for "pct_change"', () => {
    const result = validateAlertInput({
      symbol: 'NVDA',
      alert_type: 'pct_change',
      channels: ['line'],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'pct_threshold')).toBe(true);
  });

  it('rejects empty or unknown channels and dedupes', () => {
    const empty = validateAlertInput({
      symbol: '2330',
      alert_type: 'above',
      target_price: 100,
      channels: [],
    });
    expect(empty.ok).toBe(false);

    const unknown = validateAlertInput({
      symbol: '2330',
      alert_type: 'above',
      target_price: 100,
      channels: ['sms'],
    });
    expect(unknown.ok).toBe(false);

    const dup = validateAlertInput({
      symbol: '2330',
      alert_type: 'above',
      target_price: 100,
      channels: ['line', 'line', 'email'],
    });
    expect(dup.ok).toBe(true);
    if (!dup.ok) return;
    expect(dup.value.channels).toEqual(['line', 'email']);
  });

  it('rejects non-object body', () => {
    const result = validateAlertInput(null);
    expect(result.ok).toBe(false);
  });
});

describe('validateAlertPatch', () => {
  it('accepts a partial enabled toggle', () => {
    const result = validateAlertPatch({ enabled: false });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({ enabled: false });
  });

  it('rejects when no recognised fields supplied', () => {
    const result = validateAlertPatch({ unknown: 1 });
    expect(result.ok).toBe(false);
  });

  it('validates target_price within patch', () => {
    const bad = validateAlertPatch({ target_price: -1 });
    expect(bad.ok).toBe(false);

    const good = validateAlertPatch({ target_price: 50 });
    expect(good.ok).toBe(true);
  });
});

describe('plan limits', () => {
  it('exposes the documented free/pro caps', () => {
    expect(PLAN_LIMITS.free).toBe(3);
    expect(PLAN_LIMITS.pro).toBe(30);
    expect(alertLimitForTier('free')).toBe(3);
  });

  it('canCreateAlert blocks at and above the cap', () => {
    expect(canCreateAlert(0, 'free')).toBe(true);
    expect(canCreateAlert(2, 'free')).toBe(true);
    expect(canCreateAlert(3, 'free')).toBe(false);
    expect(canCreateAlert(29, 'pro')).toBe(true);
    expect(canCreateAlert(30, 'pro')).toBe(false);
  });
});

describe('toInsertRow', () => {
  it('attaches user_id to a validated input', () => {
    const validated = validateAlertInput({
      symbol: '0050',
      alert_type: 'above',
      target_price: 200,
      channels: ['line'],
      enabled: false,
    });
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;
    const row = toInsertRow(validated.value, 'user-uuid');
    expect(row.user_id).toBe('user-uuid');
    expect(row.enabled).toBe(false);
    expect(row.symbol).toBe('0050');
  });
});

describe('ALERT_CHANNELS constant', () => {
  it('contains the documented channels', () => {
    expect(ALERT_CHANNELS).toContain('line');
    expect(ALERT_CHANNELS).toContain('email');
  });
});
