
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  description?: string;
  category: string;
  color: string;
  image_url: string;
  rating?: number;
  stock_quantity?: number;
  is_active?: boolean;
  gender: 'male' | 'female' | 'unisex';
  created_at: string;
  updated_at: string;
}

export const fetchProducts = async (category?: string, userGender?: 'male' | 'female'): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Filter products based on user gender
    if (userGender) {
      query = query.in('gender', [userGender, 'unisex']);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return [];
  }
};

export const addProductToWardrobe = async (userId: string, productId: string, size?: string) => {
  try {
    const { error } = await supabase
      .from('wardrobe_items')
      .insert({
        user_id: userId,
        product_id: productId,
        size: size || 'M'
      });

    if (error) {
      console.error('Error adding to wardrobe:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addProductToWardrobe:', error);
    return false;
  }
};

export const fetchWardrobeItems = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wardrobe items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchWardrobeItems:', error);
    return [];
  }
};

export const getUserRole = async (userId: string): Promise<'admin' | 'user'> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }

    return data?.role || 'user';
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return 'user';
  }
};
