import { NextResponse } from 'next/server';

type NewsItem = {
  id: string;
  title: string;
  category: 'tw' | 'us' | 'crypto' | 'expert';
  source: string;
  time: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  readingTime: number;
  url?: string;
};

// Fetch RSS from CNYES (鉅亨網) / other free finance RSS
async function fetchCnyesNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://news.cnyes.com/api/v3/news/category/headline?limit=10', {
      next: { revalidate: 300 }, // 5 min cache
      headers: { 'User-Agent': 'nSchool-Finance/1.0' },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items = data?.items?.data || [];

    return items.slice(0, 10).map((item: {
      newsId: number;
      title: string;
      summary: string;
      publishAt: number;
      categoryName?: string;
    }, idx: number) => {
      // Categorize based on title/content
      let category: NewsItem['category'] = 'tw';
      const title = item.title || '';
      if (/美股|Fed|S&P|Nasdaq|道瓊|華爾街/.test(title)) category = 'us';
      else if (/比特幣|BTC|ETH|加密|幣圈|區塊鏈/.test(title)) category = 'crypto';

      // Determine impact
      let impact: NewsItem['impact'] = 'neutral';
      if (/上漲|大漲|利多|突破|創新高|看好|樂觀|買超/.test(title)) impact = 'positive';
      else if (/下跌|大跌|利空|暴跌|崩盤|看壞|賣超/.test(title)) impact = 'negative';

      const publishDate = new Date(item.publishAt * 1000);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - publishDate.getTime()) / 3600000);
      const timeStr = diffHours < 1 ? '剛剛' : diffHours < 24 ? `${diffHours} 小時前` : `${Math.floor(diffHours / 24)} 天前`;

      return {
        id: `cnyes-${item.newsId || idx}`,
        title: item.title,
        category,
        source: '鉅亨網',
        time: timeStr,
        summary: item.summary || '',
        impact,
        readingTime: Math.max(2, Math.ceil((item.summary || '').length / 150)),
        url: `https://news.cnyes.com/news/id/${item.newsId}`,
      };
    });
  } catch {
    return [];
  }
}

// Fallback to Google News RSS for Taiwan finance
async function fetchGoogleFinanceRSS(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      'https://news.google.com/rss/search?q=台股+投資&hl=zh-TW&gl=TW&ceid=TW:zh-Hant',
      { next: { revalidate: 600 } }
    );

    if (!res.ok) return [];

    const xml = await res.text();
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let idx = 0;

    while ((match = itemRegex.exec(xml)) !== null && idx < 8) {
      const itemXml = match[1];
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const source = itemXml.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || 'Google News';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';

      if (!title) continue;

      let category: NewsItem['category'] = 'tw';
      if (/美股|Fed|S&P|Nasdaq/.test(title)) category = 'us';
      else if (/比特幣|BTC|ETH|加密/.test(title)) category = 'crypto';

      let impact: NewsItem['impact'] = 'neutral';
      if (/上漲|大漲|利多|突破|創新高|看好/.test(title)) impact = 'positive';
      else if (/下跌|大跌|利空|暴跌|崩盤/.test(title)) impact = 'negative';

      const publishDate = new Date(pubDate);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - publishDate.getTime()) / 3600000);
      const timeStr = diffHours < 1 ? '剛剛' : diffHours < 24 ? `${diffHours} 小時前` : `${Math.floor(diffHours / 24)} 天前`;

      items.push({
        id: `gn-${idx}`,
        title: title.replace(/ - .*$/, ''),
        category,
        source,
        time: timeStr,
        summary: '',
        impact,
        readingTime: 3,
        url: link,
      });

      idx++;
    }

    return items;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    // Try CNYES first, fallback to Google News RSS
    let news = await fetchCnyesNews();

    if (news.length === 0) {
      news = await fetchGoogleFinanceRSS();
    }

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json(
      { success: false, data: [], error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
