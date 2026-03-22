'use client';

import { useState, useEffect } from 'react';
import { Send, Bell, History, Settings, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';

type HistoryEntry = {
  id: string;
  message: string;
  target: string;
  status: 'success' | 'error';
  timestamp: string;
  error?: string;
};

export default function AdminNotificationsPage() {
  const [webhookToken, setWebhookToken] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'send' | 'settings' | 'history'>('send');

  useEffect(() => {
    // Load saved token
    const saved = localStorage.getItem('nschool-line-admin-token');
    if (saved) setWebhookToken(saved);

    // Load history
    const h = localStorage.getItem('nschool-line-history');
    if (h) setHistory(JSON.parse(h));
  }, []);

  function saveToken() {
    localStorage.setItem('nschool-line-admin-token', webhookToken.trim());
    setResult({ ok: true, msg: 'Token 已儲存' });
    setTimeout(() => setResult(null), 2000);
  }

  async function sendNotification(testMode = false) {
    const token = webhookToken.trim() || localStorage.getItem('nschool-line-token') || '';
    if (!token) {
      setResult({ ok: false, msg: '請先設定 LINE Notify Token' });
      return;
    }

    const msg = testMode
      ? `🔔 nSchool Finance 測試通知\n這是一則測試訊息，發送時間：${new Date().toLocaleString('zh-TW')}`
      : message.trim();

    if (!msg) {
      setResult({ ok: false, msg: '請輸入訊息內容' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/line/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, message: msg }),
      });

      const data = await res.json();
      const ok = data.success;

      setResult({ ok, msg: ok ? '發送成功！' : `發送失敗：${data.error}` });

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        message: msg,
        target: testMode ? '測試' : target,
        status: ok ? 'success' : 'error',
        timestamp: new Date().toLocaleString('zh-TW'),
        error: ok ? undefined : data.error,
      };
      const newHistory = [entry, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem('nschool-line-history', JSON.stringify(newHistory));

      if (ok && !testMode) setMessage('');
    } catch (e) {
      setResult({ ok: false, msg: `網路錯誤：${String(e)}` });
    } finally {
      setSending(false);
    }
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('nschool-line-history');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-md shadow-green-500/30">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">LINE 推播管理</h1>
          </div>
          <p className="text-sm text-gray-400 ml-[52px]">後台通知管理介面</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1 rounded-2xl shadow-sm mb-6">
          {([
            ['send', '發送訊息', Send],
            ['settings', '設定', Settings],
            ['history', '歷史紀錄', History],
          ] as const).map(([tab, label, Icon]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab: Send */}
        {activeTab === 'send' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">訊息內容</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                placeholder="輸入要推播的訊息內容..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{message.length} 字</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">推播對象</label>
              <select
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                <option value="all">所有用戶</option>
                <option value="active">活躍用戶（7 天內登入）</option>
                <option value="new">新用戶（7 天內註冊）</option>
              </select>
            </div>

            {result && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {result.ok
                  ? <CheckCircle className="w-4 h-4 shrink-0" />
                  : <XCircle className="w-4 h-4 shrink-0" />
                }
                {result.msg}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => sendNotification(true)}
                disabled={sending}
                className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 flex items-center gap-2"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                測試發送
              </button>
              <button
                onClick={() => sendNotification(false)}
                disabled={sending || !message.trim()}
                className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                發送給 {target === 'all' ? '所有用戶' : target === 'active' ? '活躍用戶' : '新用戶'}
              </button>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LINE Notify Webhook Token</label>
              <p className="text-xs text-gray-400 mb-2">
                前往{' '}
                <a
                  href="https://notify-bot.line.me/my/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  LINE Notify 後台
                </a>
                {' '}申請個人存取權杖
              </p>
              <input
                value={webhookToken}
                onChange={e => setWebhookToken(e.target.value)}
                type="password"
                placeholder="貼上 LINE Notify Token"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent mb-3"
              />
              <button
                onClick={saveToken}
                disabled={!webhookToken.trim()}
                className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-40"
              >
                儲存 Token
              </button>
            </div>

            {result && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {result.ok ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {result.msg}
              </div>
            )}

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-700 leading-relaxed">
                ⚠️ Token 儲存在 localStorage，僅供開發測試使用。
                正式環境建議使用環境變數 <code className="bg-amber-100 px-1 rounded">LINE_NOTIFY_TOKEN</code>。
              </p>
            </div>
          </div>
        )}

        {/* Tab: History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-700">發送紀錄（{history.length} 筆）</p>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 清除
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center">
                <History className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">尚無發送紀錄</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.map(entry => (
                  <div key={entry.id} className="p-3.5 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 shrink-0">
                        {entry.status === 'success'
                          ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        }
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          entry.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                        }`}>
                          {entry.target}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed line-clamp-2">{entry.message}</p>
                    {entry.error && (
                      <p className="text-xs text-red-400 mt-1">❌ {entry.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
