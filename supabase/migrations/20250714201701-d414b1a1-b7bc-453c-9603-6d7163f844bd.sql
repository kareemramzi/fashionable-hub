-- Create sample products for testing
INSERT INTO public.products (name, brand, description, category, color, price, original_price, image_url, gender, is_active, stock_quantity, rating) VALUES
  ('Classic White T-Shirt', 'Urban Basics', 'Comfortable cotton t-shirt perfect for everyday wear', 'Tops', 'White', 25.99, 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'unisex', true, 50, 4.5),
  ('Denim Jeans', 'BlueWave', 'Classic fit denim jeans with modern styling', 'Bottoms', 'Blue', 79.99, 89.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'unisex', true, 30, 4.2),
  ('Elegant Black Dress', 'Feminine Edge', 'Sophisticated black dress perfect for evening events', 'Dresses', 'Black', 120.00, 140.00, 'https://images.unsplash.com/photo-1566479179817-c0b60b4a4b44?w=400', 'female', true, 20, 4.8),
  ('Casual Sneakers', 'ComfortStep', 'Versatile sneakers for daily activities', 'Shoes', 'White', 65.99, 75.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 'unisex', true, 40, 4.3),
  ('Summer Floral Blouse', 'Garden Chic', 'Light and airy blouse with beautiful floral patterns', 'Tops', 'Pink', 45.00, 55.00, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', 'female', true, 25, 4.6),
  ('Navy Blue Blazer', 'Professional', 'Tailored blazer perfect for business occasions', 'Outerwear', 'Navy', 150.00, 180.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'unisex', true, 15, 4.4),
  ('Beige Trench Coat', 'Classic Style', 'Timeless trench coat for sophisticated looks', 'Outerwear', 'Beige', 199.99, 249.99, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400', 'unisex', true, 12, 4.7),
  ('Red Midi Skirt', 'Bold Fashion', 'Vibrant red midi skirt to make a statement', 'Bottoms', 'Red', 55.00, 65.00, 'https://images.unsplash.com/photo-1583496661160-fb5886a13804?w=400', 'female', true, 18, 4.1);

-- Create user profile for the existing user if it doesn't exist
INSERT INTO public.user_profiles (user_id, role) 
SELECT id, 'user'::user_role 
FROM auth.users 
WHERE email = 'amr.a.ramzi@gmail.com' 
AND NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = auth.users.id);