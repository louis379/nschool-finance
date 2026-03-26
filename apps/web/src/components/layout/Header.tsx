'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  onSidebarToggle?: () => void;
};

const quickLinks = [
  { label: '模擬交易', path: '/trade', keywords: ['交易', '股票', '買', '賣', 'trade'] },
  { label: '記帳', path: '/transactions', keywords: ['記帳', '支出', '收入', '帳'] },
  { label: '學習路徑', path: '/learn', keywords: ['學習', '課程', 'learn'] },
  { label: '財經資訊', path: '/news', keywords: ['新聞', '資訊', 'news'] },
  { label: '帳戶管理', path: '/accounts', keywords: ['帳戶', 'account'] },
  { label: '觀察名單', path: '/watchlist', keywords: ['觀察', '追蹤', 'watch'] },
  { label: '複利計算器', path: '/calculator', keywords: ['複利', '計算', 'calc'] },
  { label: '個人頁面', path: '/profile', keywords: ['個人', '設定', 'profile'] },
];

export default function Header({ onSidebarToggle: _onSidebarToggle }: HeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? quickLinks.filter((link) =>
        link.label.includes(query) || link.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : quickLinks;

  function handleSelect(path: string) {
    setQuery('');
    setShowResults(false);
    router.push(path);
  }

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 md:px-6 gap-3">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">n</span>
          </div>
          <span className="font-bold text-primary-800">Finance</span>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filtered.length > 0) {
                  handleSelect(filtered[0].path);
                }
              }}
              placeholder="搜尋功能..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
              {filtered.length > 0 ? (
                filtered.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleSelect(link.path)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">找不到相關功能</div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="通知">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
            aria-label="個人頁面"
          >
            <span className="text-white text-sm font-semibold">U</span>
          </button>
        </div>
      </div>
    </header>
  );
}
