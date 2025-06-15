
import { supabase } from "@/integrations/supabase/client";

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('skin_tone, color_palette')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, skinTone: string, colorPalette: string[]) => {
  try {
    console.log('Attempting to save profile for user:', userId);
    console.log('Skin tone:', skinTone);
    console.log('Color palette:', colorPalette);
    
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        skin_tone: skinTone,
        color_palette: colorPalette,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase error saving user profile:', error);
      return false;
    }

    console.log('Profile saved successfully');
    return true;
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    return false;
  }
};
