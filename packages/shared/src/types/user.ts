export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  google_id: string | null;
  risk_profile: RiskProfile | null;
  onboarding_completed: boolean;
  created_at: string;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface OnboardingData {
  risk_profile: RiskProfile;
  investment_experience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  monthly_income: number;
  monthly_savings: number;
  financial_goals: string[];
  investment_interests: ('tw_stock' | 'us_stock' | 'crypto' | 'etf' | 'fund')[];
}
