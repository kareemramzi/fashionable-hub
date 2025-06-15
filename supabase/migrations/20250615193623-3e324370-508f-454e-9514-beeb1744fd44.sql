
-- Add gender enum type
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'unisex');

-- Add gender column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN gender public.gender_type;

-- Add gender column to products table
ALTER TABLE public.products 
ADD COLUMN gender public.gender_type DEFAULT 'unisex' NOT NULL;

-- Update existing products to have a gender (you can modify these as needed)
UPDATE public.products SET gender = 'female' WHERE category IN ('dresses');
UPDATE public.products SET gender = 'unisex' WHERE category IN ('tops', 'bottoms', 'outerwear', 'shoes');
