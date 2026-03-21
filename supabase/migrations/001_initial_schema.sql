-- nSchool Finance - Initial Database Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  google_id TEXT,
  risk_profile TEXT CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Accounts
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank', 'broker', 'crypto', 'cash')),
  balance NUMERIC(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'TWD',
  icon TEXT DEFAULT '💰',
  color TEXT DEFAULT '#6C5CE7',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📌',
  color TEXT NOT NULL DEFAULT '#AEB6BF',
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions (記帳)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category_id UUID REFERENCES public.categories(id),
  amount NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'TWD',
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ocr', 'import')),
  ocr_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OCR Records
CREATE TABLE public.ocr_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('bank', 'broker', 'accounting')),
  raw_result JSONB,
  parsed_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios (模擬投資組合)
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '我的投資組合',
  initial_capital NUMERIC(15,2) NOT NULL DEFAULT 1000000,
  current_value NUMERIC(15,2) NOT NULL DEFAULT 1000000,
  currency TEXT DEFAULT 'TWD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Holdings (模擬持股)
CREATE TABLE public.holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('tw', 'us', 'crypto')),
  quantity NUMERIC(15,6) NOT NULL DEFAULT 0,
  avg_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
  current_price NUMERIC(15,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (模擬交易訂單)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('tw', 'us', 'crypto')),
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type IN ('market', 'limit')),
  quantity NUMERIC(15,6) NOT NULL,
  price NUMERIC(15,4),
  filled_price NUMERIC(15,4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trade History
CREATE TABLE public.trade_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('tw', 'us', 'crypto')),
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity NUMERIC(15,6) NOT NULL,
  price NUMERIC(15,4) NOT NULL,
  total_amount NUMERIC(15,2) NOT NULL,
  fee NUMERIC(15,2) DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlists
CREATE TABLE public.watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '我的觀察名單',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.watchlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  watchlist_id UUID NOT NULL REFERENCES public.watchlists(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('tw', 'us', 'crypto')),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(watchlist_id, symbol, market)
);

-- Financial Goals
CREATE TABLE public.financial_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(15,2) NOT NULL,
  current_amount NUMERIC(15,2) DEFAULT 0,
  target_date DATE,
  category TEXT DEFAULT 'general',
  icon TEXT DEFAULT '🎯',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Progress
CREATE TABLE public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id, lesson_id)
);

-- AI Analysis Records
CREATE TABLE public.ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('portfolio', 'market', 'strategy', 'financial_health', 'trade_review')),
  input_data JSONB,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own accounts" ON public.accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own or default categories" ON public.categories FOR ALL USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own ocr records" ON public.ocr_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own portfolios" ON public.portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own holdings" ON public.holdings FOR ALL USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own orders" ON public.orders FOR ALL USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own trade history" ON public.trade_history FOR ALL USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own watchlists" ON public.watchlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist items" ON public.watchlist_items FOR ALL USING (watchlist_id IN (SELECT id FROM public.watchlists WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own goals" ON public.financial_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own learning" ON public.learning_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own analyses" ON public.ai_analyses FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- Auto-create profile on signup
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create default portfolio
  INSERT INTO public.portfolios (user_id, name, initial_capital, current_value)
  VALUES (NEW.id, '我的投資組合', 1000000, 1000000);

  -- Create default watchlist
  INSERT INTO public.watchlists (user_id, name)
  VALUES (NEW.id, '我的觀察名單');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- Default Categories (Seed)
-- ==========================================

INSERT INTO public.categories (name, icon, color, type, is_default) VALUES
  ('餐飲', '🍽️', '#FF6B6B', 'expense', true),
  ('交通', '🚗', '#4ECDC4', 'expense', true),
  ('購物', '🛍️', '#45B7D1', 'expense', true),
  ('娛樂', '🎬', '#96CEB4', 'expense', true),
  ('居住', '🏠', '#FFEAA7', 'expense', true),
  ('醫療', '🏥', '#DDA0DD', 'expense', true),
  ('教育', '📚', '#98D8C8', 'expense', true),
  ('通訊', '📱', '#F7DC6F', 'expense', true),
  ('保險', '🛡️', '#BB8FCE', 'expense', true),
  ('其他', '📌', '#AEB6BF', 'expense', true),
  ('薪資', '💰', '#27AE60', 'income', true),
  ('獎金', '🎁', '#F39C12', 'income', true),
  ('投資收入', '📈', '#3498DB', 'income', true),
  ('兼職', '💼', '#1ABC9C', 'income', true),
  ('其他收入', '💵', '#95A5A6', 'income', true);

-- ==========================================
-- Indexes
-- ==========================================

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX idx_transactions_account ON public.transactions(account_id);
CREATE INDEX idx_holdings_portfolio ON public.holdings(portfolio_id);
CREATE INDEX idx_orders_portfolio ON public.orders(portfolio_id, created_at DESC);
CREATE INDEX idx_trade_history_portfolio ON public.trade_history(portfolio_id, executed_at DESC);
CREATE INDEX idx_learning_progress_user ON public.learning_progress(user_id);
