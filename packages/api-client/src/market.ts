import type { MarketQuote, KlineData, Market } from '@nschool/shared';

export const marketApi = {
  async getQuote(symbol: string, market: Market): Promise<MarketQuote> {
    // TODO: Connect to real APIs (TWSE, Alpha Vantage, CoinGecko)
    // For now, return mock data
    return {
      symbol,
      name: symbol,
      market,
      price: 0,
      change: 0,
      change_percent: 0,
      volume: 0,
      high: 0,
      low: 0,
      open: 0,
      prev_close: 0,
      timestamp: new Date().toISOString(),
    };
  },

  async getKlineData(
    symbol: string,
    market: Market,
    interval: '1d' | '1w' | '1m' = '1d',
    limit: number = 60
  ): Promise<KlineData[]> {
    // TODO: Connect to real APIs
    return [];
  },

  async searchSymbol(
    query: string,
    market?: Market
  ): Promise<{ symbol: string; name: string; market: Market }[]> {
    // TODO: Implement symbol search
    return [];
  },
};
