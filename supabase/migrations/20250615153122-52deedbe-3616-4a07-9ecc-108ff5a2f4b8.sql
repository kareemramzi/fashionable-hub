
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Add role column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN role public.user_role DEFAULT 'user' NOT NULL;

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  description TEXT,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wardrobe_items table to store user's purchased items
CREATE TABLE public.wardrobe_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  size TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, size)
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are visible to everyone (for shopping)
CREATE POLICY "Products are visible to everyone" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update products
CREATE POLICY "Admins can update products" 
  ON public.products 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete products
CREATE POLICY "Admins can delete products" 
  ON public.products 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS on wardrobe_items table
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wardrobe items
CREATE POLICY "Users can view their own wardrobe items" 
  ON public.wardrobe_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own wardrobe items
CREATE POLICY "Users can insert their own wardrobe items" 
  ON public.wardrobe_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wardrobe items
CREATE POLICY "Users can delete their own wardrobe items" 
  ON public.wardrobe_items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Insert some sample products
INSERT INTO public.products (name, brand, price, original_price, description, category, color, image_url, rating, stock_quantity) VALUES
('Silk Blouse', 'Elegant Essentials', 89.99, 120.00, 'Luxurious silk blouse perfect for professional settings', 'tops', '#E8F4F8', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop', 4.5, 15),
('Tailored Blazer', 'Professional Plus', 159.99, 200.00, 'Classic tailored blazer for business occasions', 'outerwear', '#D1E7DD', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop', 4.8, 8),
('Midi Dress', 'Grace & Style', 129.99, 170.00, 'Elegant midi dress for special occasions', 'dresses', '#F8E8FF', 'https://images.unsplash.com/photo-1566479179817-c3e6fba5dde4?w=300&h=400&fit=crop', 4.6, 12),
('High-Waist Trousers', 'Modern Fit', 79.99, 100.00, 'Comfortable high-waist trousers for everyday wear', 'bottoms', '#E1F5FE', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=400&fit=crop', 4.4, 20),
('Cashmere Sweater', 'Luxury Knits', 199.99, 280.00, 'Premium cashmere sweater for ultimate comfort', 'tops', '#E8F4F8', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop', 4.9, 5),
('A-Line Skirt', 'Chic Collection', 69.99, 90.00, 'Versatile A-line skirt for various occasions', 'bottoms', '#D1E7DD', 'https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=300&h=400&fit=crop', 4.3, 18);
