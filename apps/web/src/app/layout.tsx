import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_TC } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto',
});

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
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#6C5CE7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSansTC.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
