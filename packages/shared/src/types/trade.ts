export type Market = 'tw' | 'us' | 'crypto';
export type OrderType = 'market' | 'limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'filled' | 'cancelled';

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  initial_capital: number;
  current_value: number;
  currency: string;
  created_at: string;
}

export interface Holding {
  id: string;
  portfolio_id: string;
  symbol: string;
  name: string;
  market: Market;
  quantity: number;
  avg_cost: number;
  current_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  portfolio_id: string;
  symbol: string;
  name: string;
  market: Market;
  side: OrderSide;
  order_type: OrderType;
  quantity: number;
  price: number | null;
  filled_price: number | null;
  status: OrderStatus;
  created_at: string;
}

export interface TradeHistory {
  id: string;
  portfolio_id: string;
  symbol: string;
  name: string;
  market: Market;
  side: OrderSide;
  quantity: number;
  price: number;
  total_amount: number;
  fee: number;
  executed_at: string;
}

export interface WatchlistItem {
  id: string;
  watchlist_id: string;
  symbol: string;
  name: string;
  market: Market;
  added_at: string;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  market: Market;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  prev_close: number;
  timestamp: string;
}

export interface KlineData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 台股手續費計算
export const TW_STOCK_FEE_RATE = 0.001425; // 0.1425%
export const TW_STOCK_TAX_RATE = 0.003; // 0.3% 賣出時
export const TW_STOCK_FEE_DISCOUNT = 0.6; // 券商折扣 (6折)

// 美股
export const US_STOCK_FEE_PER_SHARE = 0.005; // $0.005/share
export const US_STOCK_MIN_FEE = 1; // 最低 $1

// 加密貨幣
export const CRYPTO_FEE_RATE = 0.001; // 0.1%
