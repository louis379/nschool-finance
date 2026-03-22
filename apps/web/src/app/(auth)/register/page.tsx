'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('請輸入信箱和密碼');
      return;
    }
    if (password.length < 6) {
      setError('密碼至少需要 6 個字元');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: name.trim() || '投資新手',
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setError('此信箱已註冊，請直接登入');
        } else {
          setError(error.message);
        }
        return;
      }

      // Save name to localStorage for immediate use
      try {
        const profile = { displayName: name.trim() || '投資新手', riskType: '穩健型', notifications: { push: true, trading: true, price: true, learning: false }, darkMode: false };
        localStorage.setItem('nschool-profile', JSON.stringify(profile));
      } catch {}

      setSuccess(true);
    } catch {
      setError('註冊失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">註冊成功！</h2>
          <p className="text-sm text-gray-500 mb-6">
            我們已發送驗證信到 <strong className="text-gray-700">{email}</strong>，
            請到信箱點擊驗證連結完成註冊。
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-sm shadow-lg shadow-primary-500/25"
            >
              前往登入
            </Link>
            <button
              onClick={() => router.push('/')}
              className="w-full py-2.5 rounded-xl border border-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              先逛逛（訪客模式）
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-2xl">n</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">建立帳號</h1>
          <p className="text-sm text-gray-500 mt-1">加入 nSchool Finance，開始學習投資</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-primary-500/5 p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">暱稱</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的暱稱"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">電子信箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">密碼</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 個字元"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="text-xs text-amber-500 mt-1">密碼至少需要 6 個字元</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-sm hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  註冊中...
                </>
              ) : '建立帳號'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            註冊即代表你同意我們的{' '}
            <Link href="/terms" className="text-primary-500 hover:underline">服務條款</Link>{' '}
            和{' '}
            <Link href="/privacy" className="text-primary-500 hover:underline">隱私政策</Link>
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          已有帳號？{' '}
          <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600">
            立即登入
          </Link>
        </p>
      </div>
    </div>
  );
}
