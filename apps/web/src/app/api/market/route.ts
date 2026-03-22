import { NextResponse } from 'next/server';

// TWSE (Taiwan Stock Exchange) open data for indices
async function fetchTWSEIndex(): Promise<{ symbol: string; name: string; price: number; change: number; changePercent: number }[]> {
  try {
    const res = await fetch('https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    // TWSE BWIBBU provides P/E and dividend data, not ideal for index
    // Use MI_INDEX for market index
    const indexRes = await fetch('https://openapi.twse.com.tw/v1/exchangeReport/MI_INDEX', {
      next: { revalidate: 300 },
    });
    if (!indexRes.ok) return [];
    const indexData = await indexRes.json();

    const results: { symbol: string; name: string; price: number; change: number; changePercent: number }[] = [];
    for (const item of indexData) {
      if (item['指數'] === '發行量加權股價指數') {
        const price = parseFloat(item['收盤指數']?.replace(/,/g, '') || '0');
        const change = parseFloat(item['漲跌點數']?.replace(/,/g, '') || '0');
        if (price > 0) {
          results.push({
            symbol: '加權指數',
            name: '台灣加權指數',
            price,
            change,
            changePercent: price > 0 ? (change / (price - change)) * 100 : 0,
          });
        }
      }
    }
    return results;
  } catch {
    return [];
  }
}

// Fetch top Taiwan stocks from TWSE
async function fetchTWSEStocks(): Promise<{ symbol: string; name: string; price: number; change: number; changePercent: number; volume: number }[]> {
  try {
    // Popular TW stocks
    const symbols = ['2330', '2317', '2454', '0050', '2603', '2881'];
    const results: { symbol: string; name: string; price: number; change: number; changePercent: number; volume: number }[] = [];

    // Use TWSE stock day API
    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    const res = await fetch(`https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL`, {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const nameMap: Record<string, string> = {
        '2330': '台積電', '2317': '鴻海', '2454': '聯發科',
        '0050': '元大台灣50', '2603': '長榮', '2881': '富邦金',
      };

      for (const sym of symbols) {
        const item = data.find((d: { Code: string }) => d.Code === sym);
        if (item) {
          const close = parseFloat(item.ClosingPrice?.replace(/,/g, '') || '0');
          const change = parseFloat(item.Change?.replace(/,/g, '') || '0');
          const volume = parseInt(item.TradeVolume?.replace(/,/g, '') || '0');
          if (close > 0) {
            results.push({
              symbol: sym,
              name: nameMap[sym] || item.Name || sym,
              price: close,
              change,
              changePercent: close > 0 ? (change / (close - change)) * 100 : 0,
              volume: Math.round(volume / 1000), // Convert to lots
            });
          }
        }
      }
    }

    return results;
  } catch {
    return [];
  }
}

// CoinGecko free API for crypto
async function fetchCryptoData(): Promise<{ symbol: string; name: string; price: number; change: number; changePercent: number; volume: number }[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin&order=market_cap_desc&sparkline=false',
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return [];
    const data = await res.json();

    const symbolMap: Record<string, string> = {
      bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL', binancecoin: 'BNB',
    };

    return data.map((coin: {
      id: string; name: string; current_price: number;
      price_change_24h: number; price_change_percentage_24h: number;
      total_volume: number;
    }) => ({
      symbol: symbolMap[coin.id] || coin.id.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      volume: Math.round(coin.total_volume / 1000000),
    }));
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const market = url.searchParams.get('market') || 'all';

  try {
    const result: Record<string, unknown[]> = {};

    if (market === 'all' || market === 'tw') {
      const [indices, stocks] = await Promise.all([fetchTWSEIndex(), fetchTWSEStocks()]);
      result.tw_indices = indices;
      result.tw_stocks = stocks;
    }

    if (market === 'all' || market === 'crypto') {
      result.crypto = await fetchCryptoData();
    }

    // For dashboard MarketOverview, combine key data
    if (market === 'overview') {
      const [indices, crypto] = await Promise.all([fetchTWSEIndex(), fetchCryptoData()]);
      const overview = [
        ...(indices.length > 0 ? indices : []),
        ...(crypto.length > 0 ? crypto.slice(0, 2) : []),
      ];
      return NextResponse.json({ success: true, data: overview });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Market data error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
