export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          brand: string
          color: string
          created_at: string
          id: string
          image_url: string
          price: number
          product_name: string
          quantity: number
          size: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          color: string
          created_at?: string
          id?: string
          image_url: string
          price: number
          product_name: string
          quantity?: number
          size: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          color?: string
          created_at?: string
          id?: string
          image_url?: string
          price?: number
          product_name?: string
          quantity?: number
          size?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          brand: string
          color: string
          created_at: string
          id: string
          image_url: string
          price: number
          product_name: string
          user_id: string
        }
        Insert: {
          brand: string
          color: string
          created_at?: string
          id?: string
          image_url: string
          price: number
          product_name: string
          user_id: string
        }
        Update: {
          brand?: string
          color?: string
          created_at?: string
          id?: string
          image_url?: string
          price?: number
          product_name?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          customer_email: string
          customer_name: string | null
          id: string
          items: Json
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          customer_email: string
          customer_name?: string | null
          id?: string
          items: Json
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          customer_email?: string
          customer_name?: string | null
          id?: string
          items?: Json
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          color: string
          created_at: string
          description: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          image_url: string
          is_active: boolean | null
          name: string
          original_price: number | null
          price: number
          rating: number | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          brand: string
          category: string
          color: string
          created_at?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
          original_price?: number | null
          price: number
          rating?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          brand?: string
          category?: string
          color?: string
          created_at?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          color_palette: Json | null
          created_at: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          skin_tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color_palette?: Json | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          skin_tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color_palette?: Json | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          skin_tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: number
          password: string
          username: string
        }
        Insert: {
          id?: number
          password: string
          username: string
        }
        Update: {
          id?: number
          password?: string
          username?: string
        }
        Relationships: []
      }
      wardrobe_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          purchase_date: string | null
          size: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          purchase_date?: string | null
          size?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          purchase_date?: string | null
          size?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      make_user_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      gender_type: "male" | "female" | "unisex"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_type: ["male", "female", "unisex"],
      user_role: ["admin", "user"],
    },
  },
} as const
