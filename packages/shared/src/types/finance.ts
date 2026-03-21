export type AccountType = 'bank' | 'broker' | 'crypto' | 'cash';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionSource = 'manual' | 'ocr' | 'import';
export type Currency = 'TWD' | 'USD';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  icon: string;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  type: TransactionType;
  category_id: string;
  amount: number;
  currency: Currency;
  description: string;
  date: string;
  source: TransactionSource;
  ocr_image_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  is_default: boolean;
  parent_id: string | null;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
  icon: string;
  created_at: string;
}

export interface OcrRecord {
  id: string;
  user_id: string;
  image_url: string;
  source_type: 'bank' | 'broker' | 'accounting';
  raw_result: string | null;
  parsed_data: OcrParsedData | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface OcrParsedData {
  transactions: {
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
    category_suggestion: string;
  }[];
  account_balance?: number;
  account_name?: string;
}
