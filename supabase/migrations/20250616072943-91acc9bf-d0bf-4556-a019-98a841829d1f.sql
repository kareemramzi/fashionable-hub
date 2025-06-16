
-- Create orders table to track purchases
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending', -- pending, paid, failed, cancelled
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  items JSONB NOT NULL, -- Store cart items as JSON
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own orders
CREATE POLICY "select_own_orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policy for edge functions to insert and update orders
CREATE POLICY "insert_order" ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_order" ON public.orders
  FOR UPDATE
  USING (true);
