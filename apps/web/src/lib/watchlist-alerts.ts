export const ALERT_TYPES = ['above', 'below', 'pct_change'] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_CHANNELS = ['line', 'email'] as const;
export type AlertChannel = (typeof ALERT_CHANNELS)[number];

export const PLAN_LIMITS = { free: 3, pro: 30 } as const;
export type PlanTier = keyof typeof PLAN_LIMITS;

export type AlertInput = {
  symbol: string;
  alert_type: AlertType;
  target_price: number | null;
  pct_threshold: number | null;
  channels: AlertChannel[];
  enabled: boolean;
};

export type AlertPatch = {
  target_price?: number | null;
  pct_threshold?: number | null;
  channels?: AlertChannel[];
  enabled?: boolean;
};

export type AlertRecord = AlertInput & {
  id: string;
  user_id: string;
  triggered_at: string | null;
  created_at: string;
};

export type AlertInsertRow = AlertInput & { user_id: string };

export type ValidationError = { field: string; message: string };
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationError[] };

function isPositiveFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v > 0;
}

function normalizeChannels(raw: unknown, errors: ValidationError[]): AlertChannel[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    errors.push({ field: 'channels', message: 'must have at least one channel' });
    return [];
  }
  const allowed = ALERT_CHANNELS as readonly string[];
  const out: AlertChannel[] = [];
  for (const c of raw) {
    if (typeof c !== 'string' || !allowed.includes(c)) {
      errors.push({ field: 'channels', message: `invalid channel: ${String(c)}` });
      continue;
    }
    if (!out.includes(c as AlertChannel)) out.push(c as AlertChannel);
  }
  return out;
}

export function validateAlertInput(raw: unknown): ValidationResult<AlertInput> {
  const errors: ValidationError[] = [];
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, errors: [{ field: 'body', message: 'must be an object' }] };
  }
  const r = raw as Record<string, unknown>;

  const symbol = typeof r.symbol === 'string' ? r.symbol.trim() : '';
  if (!symbol) errors.push({ field: 'symbol', message: 'symbol is required' });

  const alertType = r.alert_type;
  const isValidType =
    typeof alertType === 'string' &&
    (ALERT_TYPES as readonly string[]).includes(alertType);
  if (!isValidType) {
    errors.push({
      field: 'alert_type',
      message: `must be one of ${ALERT_TYPES.join(', ')}`,
    });
  }

  let target_price: number | null = null;
  let pct_threshold: number | null = null;

  if (alertType === 'above' || alertType === 'below') {
    if (!isPositiveFiniteNumber(r.target_price)) {
      errors.push({ field: 'target_price', message: 'must be a positive number' });
    } else {
      target_price = r.target_price;
    }
  } else if (alertType === 'pct_change') {
    if (!isPositiveFiniteNumber(r.pct_threshold)) {
      errors.push({ field: 'pct_threshold', message: 'must be a positive number' });
    } else {
      pct_threshold = r.pct_threshold;
    }
  }

  const channels = normalizeChannels(r.channels, errors);
  const enabled = typeof r.enabled === 'boolean' ? r.enabled : true;

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      symbol,
      alert_type: alertType as AlertType,
      target_price,
      pct_threshold,
      channels,
      enabled,
    },
  };
}

export function validateAlertPatch(raw: unknown): ValidationResult<AlertPatch> {
  const errors: ValidationError[] = [];
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, errors: [{ field: 'body', message: 'must be an object' }] };
  }
  const r = raw as Record<string, unknown>;
  const patch: AlertPatch = {};

  if ('target_price' in r) {
    if (r.target_price === null) {
      patch.target_price = null;
    } else if (!isPositiveFiniteNumber(r.target_price)) {
      errors.push({ field: 'target_price', message: 'must be a positive number or null' });
    } else {
      patch.target_price = r.target_price;
    }
  }

  if ('pct_threshold' in r) {
    if (r.pct_threshold === null) {
      patch.pct_threshold = null;
    } else if (!isPositiveFiniteNumber(r.pct_threshold)) {
      errors.push({ field: 'pct_threshold', message: 'must be a positive number or null' });
    } else {
      patch.pct_threshold = r.pct_threshold;
    }
  }

  if ('channels' in r) {
    const channels = normalizeChannels(r.channels, errors);
    if (channels.length > 0) patch.channels = channels;
  }

  if ('enabled' in r) {
    if (typeof r.enabled !== 'boolean') {
      errors.push({ field: 'enabled', message: 'must be a boolean' });
    } else {
      patch.enabled = r.enabled;
    }
  }

  if (Object.keys(patch).length === 0 && errors.length === 0) {
    return { ok: false, errors: [{ field: 'body', message: 'no updatable fields provided' }] };
  }
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: patch };
}

export function alertLimitForTier(tier: PlanTier): number {
  return PLAN_LIMITS[tier];
}

export function canCreateAlert(currentCount: number, tier: PlanTier): boolean {
  return currentCount < alertLimitForTier(tier);
}

export function toInsertRow(input: AlertInput, userId: string): AlertInsertRow {
  return { ...input, user_id: userId };
}
