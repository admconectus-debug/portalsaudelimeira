export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      clinic_professionals: {
        Row: {
          clinic_id: string
          created_at: string
          id: string
          professional_id: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          id?: string
          professional_id: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          id?: string
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_professionals_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_professionals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string | null
          banners: string[] | null
          category: string | null
          city: string
          created_at: string
          description: string | null
          email: string | null
          facebook: string | null
          id: string
          image_url: string | null
          instagram: string | null
          is_active: boolean
          is_featured: boolean
          linkedin: string | null
          name: string
          phone: string | null
          schedule: string | null
          slug: string
          state: string | null
          updated_at: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          address?: string | null
          banners?: string[] | null
          category?: string | null
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          is_active?: boolean
          is_featured?: boolean
          linkedin?: string | null
          name: string
          phone?: string | null
          schedule?: string | null
          slug: string
          state?: string | null
          updated_at?: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          banners?: string[] | null
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          is_active?: boolean
          is_featured?: boolean
          linkedin?: string | null
          name?: string
          phone?: string | null
          schedule?: string | null
          slug?: string
          state?: string | null
          updated_at?: string
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          published_at?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          business_area: string
          company_name: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          business_area: string
          company_name: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          business_area?: string
          company_name?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          banners: string[] | null
          created_at: string
          description: string | null
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          linkedin: string | null
          location: string
          name: string
          phone: string | null
          photo_url: string | null
          specialty_id: string | null
          updated_at: string
          whatsapp: string | null
          youtube: string | null
        }
        Insert: {
          banners?: string[] | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          location: string
          name: string
          phone?: string | null
          photo_url?: string | null
          specialty_id?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Update: {
          banners?: string[] | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          location?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          specialty_id?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_professional_contact: {
        Args: { professional_id: string }
        Returns: {
          email: string
          id: string
          phone: string
          whatsapp: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
