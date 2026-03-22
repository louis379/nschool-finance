'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F2FF]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header onSidebarToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 page-enter">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
