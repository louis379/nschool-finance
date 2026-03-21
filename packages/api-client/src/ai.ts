import { apiClient } from './index';

interface AiAnalysisResult {
  summary: string;
  analysis: string;
  suggestions: string[];
  risk_note: string;
  score: number;
}

export const aiApi = {
  async analyzePortfolio(data: {
    holdings: unknown[];
    totalValue: number;
    initialCapital: number;
  }): Promise<AiAnalysisResult> {
    const res = await apiClient<{ data: AiAnalysisResult }>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ type: 'portfolio', data }),
    });
    return res.data;
  },

  async analyzeFinancialHealth(data: {
    income: number;
    expense: number;
    totalAssets: number;
    totalDebt: number;
    emergencyFund: number;
  }): Promise<AiAnalysisResult> {
    const res = await apiClient<{ data: AiAnalysisResult }>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ type: 'financial_health', data }),
    });
    return res.data;
  },

  async getInvestmentStrategy(data: {
    riskProfile: string;
    goals: string;
    investableAmount: number;
    timeHorizon: string;
  }): Promise<AiAnalysisResult> {
    const res = await apiClient<{ data: AiAnalysisResult }>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ type: 'strategy', data }),
    });
    return res.data;
  },

  async reviewTrades(data: {
    trades: unknown[];
    winRate: number;
    avgReturn: number;
  }): Promise<AiAnalysisResult> {
    const res = await apiClient<{ data: AiAnalysisResult }>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ type: 'trade_review', data }),
    });
    return res.data;
  },
};
