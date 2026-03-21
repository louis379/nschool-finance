import {
  TW_STOCK_FEE_RATE,
  TW_STOCK_TAX_RATE,
  TW_STOCK_FEE_DISCOUNT,
  US_STOCK_FEE_PER_SHARE,
  US_STOCK_MIN_FEE,
  CRYPTO_FEE_RATE,
  type Market,
  type OrderSide,
} from '../types/trade';

/**
 * 計算交易手續費
 */
export function calculateTradeFee(
  market: Market,
  side: OrderSide,
  price: number,
  quantity: number
): number {
  const total = price * quantity;

  switch (market) {
    case 'tw': {
      const fee = Math.floor(total * TW_STOCK_FEE_RATE * TW_STOCK_FEE_DISCOUNT);
      const tax = side === 'sell' ? Math.floor(total * TW_STOCK_TAX_RATE) : 0;
      return fee + tax;
    }
    case 'us': {
      const fee = Math.max(quantity * US_STOCK_FEE_PER_SHARE, US_STOCK_MIN_FEE);
      return Math.round(fee * 100) / 100;
    }
    case 'crypto': {
      return Math.round(total * CRYPTO_FEE_RATE * 100) / 100;
    }
    default:
      return 0;
  }
}

/**
 * 複利計算
 */
export function calculateCompoundInterest(params: {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
}): { year: number; totalValue: number; totalInvested: number; totalInterest: number }[] {
  const { principal, monthlyContribution, annualRate, years } = params;
  const monthlyRate = annualRate / 12 / 100;
  const results: { year: number; totalValue: number; totalInvested: number; totalInterest: number }[] = [];

  let currentValue = principal;
  let totalInvested = principal;

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      currentValue = (currentValue + monthlyContribution) * (1 + monthlyRate);
      totalInvested += monthlyContribution;
    }

    results.push({
      year,
      totalValue: Math.round(currentValue),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(currentValue - totalInvested),
    });
  }

  return results;
}

/**
 * 目標倒推：需要每月投入多少
 */
export function calculateRequiredMonthly(params: {
  targetAmount: number;
  principal: number;
  annualRate: number;
  years: number;
}): number {
  const { targetAmount, principal, annualRate, years } = params;
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  if (monthlyRate === 0) {
    return (targetAmount - principal) / months;
  }

  // FV = PV * (1+r)^n + PMT * ((1+r)^n - 1) / r
  // PMT = (FV - PV * (1+r)^n) * r / ((1+r)^n - 1)
  const compoundFactor = Math.pow(1 + monthlyRate, months);
  const pmt = (targetAmount - principal * compoundFactor) * monthlyRate / (compoundFactor - 1);

  return Math.round(pmt);
}

/**
 * 格式化金額
 */
export function formatCurrency(amount: number, currency: string = 'TWD'): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'TWD' ? 0 : 2,
    maximumFractionDigits: currency === 'TWD' ? 0 : 2,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * 計算報酬率
 */
export function calculateReturn(current: number, cost: number): number {
  if (cost === 0) return 0;
  return ((current - cost) / cost) * 100;
}
