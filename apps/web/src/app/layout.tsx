import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'nSchool Finance | 先認知，再投資',
  description: '專屬投資新手的全方位理財工具 - 智能記帳、模擬交易、AI 投資分析',
  keywords: ['理財', '投資', '記帳', '模擬交易', '台股', '美股', '加密貨幣', 'nSchool'],
  openGraph: {
    title: 'nSchool Finance',
    description: '專屬投資新手的全方位理財工具',
    siteName: 'nSchool Finance',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6C5CE7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
