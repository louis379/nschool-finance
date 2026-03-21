import { create } from 'zustand';
import type { Portfolio, Holding, MarketQuote } from '../types/trade';

interface TradeState {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  holdings: Holding[];
  watchlistQuotes: MarketQuote[];
  setPortfolios: (portfolios: Portfolio[]) => void;
  setActivePortfolio: (id: string | null) => void;
  setHoldings: (holdings: Holding[]) => void;
  setWatchlistQuotes: (quotes: MarketQuote[]) => void;
  updateQuote: (symbol: string, quote: Partial<MarketQuote>) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  portfolios: [],
  activePortfolioId: null,
  holdings: [],
  watchlistQuotes: [],
  setPortfolios: (portfolios) => set({ portfolios }),
  setActivePortfolio: (activePortfolioId) => set({ activePortfolioId }),
  setHoldings: (holdings) => set({ holdings }),
  setWatchlistQuotes: (watchlistQuotes) => set({ watchlistQuotes }),
  updateQuote: (symbol, quote) =>
    set((state) => ({
      watchlistQuotes: state.watchlistQuotes.map((q) =>
        q.symbol === symbol ? { ...q, ...quote } : q
      ),
    })),
}));
