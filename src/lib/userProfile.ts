
import { supabase } from "@/integrations/supabase/client";

export type GenderType = 'male' | 'female' | 'unisex';

export const getUserProfile = async (userId: string) => {
  try {
    console.log('getUserProfile - Fetching profile for user:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('skin_tone, color_palette, gender')
      .eq('user_id', userId)
      .single();

    console.log('getUserProfile - Query result:', { data, error });

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      console.log('getUserProfile - No profile data found for user:', userId);
      return null;
    }

    console.log('getUserProfile - Profile data found:', data);
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, skinTone: string, colorPalette: string[], gender?: GenderType) => {
  try {
    console.log('saveUserProfile - Attempting to save profile for user:', userId);
    console.log('saveUserProfile - Skin tone:', skinTone);
    console.log('saveUserProfile - Color palette:', colorPalette);
    console.log('saveUserProfile - Gender:', gender);
    
    // First, check if user profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, user_id')
      .eq('user_id', userId)
      .maybeSingle();
    
    console.log('saveUserProfile - Existing profile check:', { existingProfile, fetchError });
    
    if (fetchError) {
      console.error('saveUserProfile - Error checking existing profile:', fetchError);
    }
    
    const profileData: any = {
      user_id: userId,
      skin_tone: skinTone,
      color_palette: colorPalette,
      updated_at: new Date().toISOString()
    };

    if (gender) {
      profileData.gender = gender;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData, {
        onConflict: 'user_id'
      })
      .select();

    console.log('saveUserProfile - Upsert result:', { data, error });

    if (error) {
      console.error('Supabase error saving user profile:', error);
      return false;
    }

    console.log('saveUserProfile - Profile saved successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    return false;
  }
};
