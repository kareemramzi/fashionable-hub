
-- Create a table for favorites
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own favorites
CREATE POLICY "Users can create their own favorites" 
  ON public.favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON public.favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);
