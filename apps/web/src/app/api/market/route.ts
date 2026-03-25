import { NextResponse } from 'next/server';

type TwStock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
};

// Fetch ALL TWSE listed stocks via STOCK_DAY_ALL
async function fetchTWSEAllStocks(): Promise<TwStock[]> {
  try {
    const res = await fetch('https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL', {
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return [];
    const data: { Code: string; Name: string; ClosingPrice: string; Change: string; TradeVolume: string }[] = await res.json();

    const results: TwStock[] = [];
    for (const item of data) {
      const code = item.Code?.trim();
      const name = item.Name?.trim();
      if (!code || !name) continue;
      const price = parseFloat(item.ClosingPrice?.replace(/,/g, '') || '0');
      if (price <= 0) continue; // skip suspended/no-trade stocks
      const change = parseFloat(item.Change?.replace(/,/g, '') || '0');
      const volume = parseInt(item.TradeVolume?.replace(/,/g, '') || '0');
      results.push({
        symbol: code,
        name,
        price,
        change,
        changePercent: price > 0 ? (change / (price - change)) * 100 : 0,
        volume: Math.round(volume / 1000), // convert shares to lots (張)
      });
    }
    return results;
  } catch {
    return [];
  }
}

// Fetch TPEx (上櫃) stocks
async function fetchTPExAllStocks(): Promise<TwStock[]> {
  try {
    const res = await fetch('https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes', {
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return [];
    const data: { SecuritiesCompanyCode: string; CompanyName: string; Close: string; Change: string; TradingShares: string }[] = await res.json();

    const results: TwStock[] = [];
    for (const item of data) {
      const code = item.SecuritiesCompanyCode?.trim();
      const name = item.CompanyName?.trim();
      if (!code || !name) continue;
      const price = parseFloat(item.Close?.replace(/,/g, '') || '0');
      if (price <= 0) continue;
      const change = parseFloat(item.Change?.replace(/,/g, '') || '0');
      const volume = parseInt(item.TradingShares?.replace(/,/g, '') || '0');
      results.push({
        symbol: code,
        name,
        price,
        change,
        changePercent: price > 0 ? (change / (price - change)) * 100 : 0,
        volume: Math.round(volume / 1000),
      });
    }
    return results;
  } catch {
    return [];
  }
}

// TWSE market index
async function fetchTWSEIndex(): Promise<{ symbol: string; name: string; price: number; change: number; changePercent: number }[]> {
  try {
    const res = await fetch('https://openapi.twse.com.tw/v1/exchangeReport/MI_INDEX', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data: { 指數: string; 收盤指數: string; 漲跌點數: string }[] = await res.json();
    const results: { symbol: string; name: string; price: number; change: number; changePercent: number }[] = [];
    for (const item of data) {
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

// CoinGecko free API — top 20 coins
async function fetchCryptoData() {
  try {
    const ids = [
      'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple',
      'cardano', 'dogecoin', 'avalanche-2', 'polkadot', 'chainlink',
      'uniswap', 'matic-network', 'litecoin', 'cosmos', 'arbitrum',
      'sui', 'the-open-network', 'optimism', 'render-token', 'injective-protocol',
    ].join(',');
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return [];
    const data: {
      id: string; symbol: string; name: string; current_price: number;
      price_change_24h: number; price_change_percentage_24h: number; total_volume: number;
    }[] = await res.json();
    return data.map((coin) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      volume: Math.round(coin.total_volume / 1_000_000),
    }));
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const market = url.searchParams.get('market') || 'all';
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '100');

  try {
    if (market === 'overview') {
      const [indices, crypto] = await Promise.all([fetchTWSEIndex(), fetchCryptoData()]);
      return NextResponse.json({
        success: true,
        data: [
          ...(indices.length > 0 ? indices : []),
          ...(crypto.length > 0 ? crypto.slice(0, 2) : []),
        ],
      });
    }

    const result: Record<string, unknown> = {};

    if (market === 'all' || market === 'tw') {
      const [twse, tpex, indices] = await Promise.all([
        fetchTWSEAllStocks(),
        fetchTPExAllStocks(),
        fetchTWSEIndex(),
      ]);
      let allTw = [...twse, ...tpex];
      if (search) {
        allTw = allTw.filter(
          (s) => s.symbol.includes(search) || s.name.toLowerCase().includes(search)
        );
      }
      const total = allTw.length;
      const start = (page - 1) * limit;
      result.tw_stocks = allTw.slice(start, start + limit);
      result.tw_total = total;
      result.tw_indices = indices;
    }

    if (market === 'all' || market === 'crypto') {
      result.crypto = await fetchCryptoData();
    }

    const response = NextResponse.json({ success: true, data: result });
    // Cache market data for 5 minutes on CDN, 60s on browser
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    console.error('Market data error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
