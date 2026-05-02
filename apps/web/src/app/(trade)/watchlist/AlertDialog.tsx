'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Trash2, X } from 'lucide-react';
import {
  ALERT_CHANNELS,
  type AlertChannel,
  type AlertRecord,
  type AlertType,
} from '@/lib/watchlist-alerts';

type AlertDialogProps = {
  symbol: string;
  name: string;
  market: string;
  isOpen: boolean;
  onClose: () => void;
};

type FormState = {
  alert_type: AlertType;
  target_price: string;
  pct_threshold: string;
  channels: AlertChannel[];
  enabled: boolean;
};

const INITIAL_FORM: FormState = {
  alert_type: 'above',
  target_price: '',
  pct_threshold: '',
  channels: ['line'],
  enabled: true,
};

const TYPE_OPTIONS: { value: AlertType; label: string }[] = [
  { value: 'above', label: '漲到' },
  { value: 'below', label: '跌到' },
  { value: 'pct_change', label: '漲跌幅' },
];

export default function AlertDialog({ symbol, name, market, isOpen, onClose }: AlertDialogProps) {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/watchlist/alerts', { cache: 'no-store' });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `request_failed_${res.status}`);
      }
      const json = (await res.json()) as { data: AlertRecord[] };
      setAlerts(json.data.filter((a) => a.symbol === symbol));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (!isOpen) return;
    setForm(INITIAL_FORM);
    void loadAlerts();
  }, [isOpen, loadAlerts]);

  const submitDisabled = useMemo(() => {
    if (saving) return true;
    if (form.channels.length === 0) return true;
    if (form.alert_type === 'pct_change') {
      const v = Number(form.pct_threshold);
      return !Number.isFinite(v) || v <= 0;
    }
    const v = Number(form.target_price);
    return !Number.isFinite(v) || v <= 0;
  }, [form, saving]);

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      const payload =
        form.alert_type === 'pct_change'
          ? {
              symbol,
              alert_type: 'pct_change' as const,
              pct_threshold: Number(form.pct_threshold),
              channels: form.channels,
              enabled: form.enabled,
            }
          : {
              symbol,
              alert_type: form.alert_type,
              target_price: Number(form.target_price),
              channels: form.channels,
              enabled: form.enabled,
            };

      const res = await fetch('/api/watchlist/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          limit?: number;
        };
        if (res.status === 403 && body.error === 'limit_reached') {
          throw new Error(`已達警示上限（${body.limit ?? '?'}）。請先刪除舊警示或升級方案。`);
        }
        throw new Error(body.error ?? `request_failed_${res.status}`);
      }
      setForm(INITIAL_FORM);
      await loadAlerts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    const previous = alerts;
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    const res = await fetch(`/api/watchlist/alerts/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setAlerts(previous);
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? 'delete_failed');
    }
  }

  async function handleToggle(alert: AlertRecord) {
    setError(null);
    const next = !alert.enabled;
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, enabled: next } : a)));
    const res = await fetch(`/api/watchlist/alerts/${alert.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    });
    if (!res.ok) {
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, enabled: alert.enabled } : a)));
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? 'update_failed');
    }
  }

  function toggleChannel(channel: AlertChannel) {
    setForm((prev) => {
      const has = prev.channels.includes(channel);
      const channels = has
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels };
    });
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-3 sm:px-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-500" />
            <div>
              <h2 id="alert-dialog-title" className="text-base font-bold text-gray-800">
                設警示
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {symbol} · {name} · {market}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <section className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">既有警示</p>
          {loading ? (
            <p className="text-sm text-gray-400">載入中…</p>
          ) : alerts.length === 0 ? (
            <p className="text-sm text-gray-400">尚未設定，加入第一個警示吧</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-50"
                >
                  <div className="text-sm text-gray-700">
                    {describeAlert(a)}
                    <span className="ml-2 text-xs text-gray-400">{a.channels.join('・')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => void handleToggle(a)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        a.enabled
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      aria-pressed={a.enabled}
                    >
                      {a.enabled ? '啟用中' : '停用'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(a.id)}
                      aria-label="刪除警示"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold text-gray-500">新增警示</p>
          <div className="grid grid-cols-3 gap-2">
            {TYPE_OPTIONS.map((opt) => {
              const active = form.alert_type === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, alert_type: opt.value }))}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-pressed={active}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {form.alert_type === 'pct_change' ? (
            <label className="block">
              <span className="text-xs text-gray-500">漲跌幅閾值（%）</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.pct_threshold}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pct_threshold: e.target.value }))
                }
                placeholder="例如 5"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </label>
          ) : (
            <label className="block">
              <span className="text-xs text-gray-500">目標價（TWD）</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.target_price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, target_price: e.target.value }))
                }
                placeholder="例如 1100"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </label>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-1.5">通知通道</p>
            <div className="flex flex-wrap gap-2">
              {ALERT_CHANNELS.map((c) => {
                const active = form.channels.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleChannel(c)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      active
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-50 text-gray-500 border border-transparent'
                    }`}
                  >
                    {c === 'line' ? 'LINE Bot' : 'Email'}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center justify-between text-sm text-gray-700">
            <span>立即啟用</span>
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) =>
                setForm((f) => ({ ...f, enabled: e.target.checked }))
              }
              className="w-4 h-4 accent-primary-500"
            />
          </label>

          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={submitDisabled}
            onClick={() => void handleSubmit()}
            className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            {saving ? '儲存中…' : '加入警示'}
          </button>
        </section>
      </div>
    </div>
  );
}

function describeAlert(a: AlertRecord): string {
  if (a.alert_type === 'above') return `漲到 ${a.target_price ?? '?'}`;
  if (a.alert_type === 'below') return `跌到 ${a.target_price ?? '?'}`;
  return `漲跌幅 ±${a.pct_threshold ?? '?'}%`;
}
