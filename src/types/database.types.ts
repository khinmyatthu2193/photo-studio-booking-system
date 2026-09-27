export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      addons: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          is_active: boolean;
          name: string;
          price: number;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          price: number;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          price?: number;
        };
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      availability: {
        Row: {
          day_of_week: number;
          end_time: string | null;
          id: string;
          is_available: boolean;
          start_time: string | null;
        };
        Insert: {
          day_of_week: number;
          end_time?: string | null;
          id?: string;
          is_available?: boolean;
          start_time?: string | null;
        };
        Update: {
          day_of_week?: number;
          end_time?: string | null;
          id?: string;
          is_available?: boolean;
          start_time?: string | null;
        };
        Relationships: [];
      };
      blocked_dates: {
        Row: {
          blocked_date: string;
          created_at: string;
          id: string;
          reason: string;
        };
        Insert: {
          blocked_date: string;
          created_at?: string;
          id?: string;
          reason?: string;
        };
        Update: {
          blocked_date?: string;
          created_at?: string;
          id?: string;
          reason?: string;
        };
        Relationships: [];
      };
      booking_addons: {
        Row: {
          addon_id: string;
          booking_id: string;
          id: string;
          price: number;
        };
        Insert: {
          addon_id: string;
          booking_id: string;
          id?: string;
          price: number;
        };
        Update: {
          addon_id?: string;
          booking_id?: string;
          id?: string;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "booking_addons_addon_id_fkey";
            columns: ["addon_id"];
            isOneToOne: false;
            referencedRelation: "addons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_addons_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          booking_date: string;
          booking_number: string;
          created_at: string;
          customer_name: string;
          duration_minutes: number;
          email: string | null;
          id: string;
          package_id: string;
          package_price: number;
          people_count: number | null;
          phone: string;
          social_contact: string | null;
          special_request: string | null;
          status: Database["public"]["Enums"]["booking_status"];
          time_slot: string;
          total_price: number;
          updated_at: string;
        };
        Insert: {
          booking_date: string;
          booking_number: string;
          created_at?: string;
          customer_name: string;
          duration_minutes: number;
          email?: string | null;
          id?: string;
          package_id: string;
          package_price: number;
          people_count?: number | null;
          phone: string;
          social_contact?: string | null;
          special_request?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          time_slot: string;
          total_price: number;
          updated_at?: string;
        };
        Update: {
          booking_date?: string;
          booking_number?: string;
          created_at?: string;
          customer_name?: string;
          duration_minutes?: number;
          email?: string | null;
          id?: string;
          package_id?: string;
          package_price?: number;
          people_count?: number | null;
          phone?: string;
          social_contact?: string | null;
          special_request?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          time_slot?: string;
          total_price?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
        ];
      };
      packages: {
        Row: {
          created_at: string;
          description: string;
          display_order: number;
          duration_minutes: number;
          id: string;
          image_url: string | null;
          included_locations: number;
          included_outfits: number;
          included_photos: number;
          is_active: boolean;
          name: string;
          price: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          display_order?: number;
          duration_minutes: number;
          id?: string;
          image_url?: string | null;
          included_locations?: number;
          included_outfits?: number;
          included_photos?: number;
          is_active?: boolean;
          name: string;
          price: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          display_order?: number;
          duration_minutes?: number;
          id?: string;
          image_url?: string | null;
          included_locations?: number;
          included_outfits?: number;
          included_photos?: number;
          is_active?: boolean;
          name?: string;
          price?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio: {
        Row: {
          category: Database["public"]["Enums"]["portfolio_category"];
          created_at: string;
          description: string;
          display_order: number;
          id: string;
          image_path: string;
          is_featured: boolean;
          is_published: boolean;
          title: string;
        };
        Insert: {
          category?: Database["public"]["Enums"]["portfolio_category"];
          created_at?: string;
          description?: string;
          display_order?: number;
          id?: string;
          image_path: string;
          is_featured?: boolean;
          is_published?: boolean;
          title: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["portfolio_category"];
          created_at?: string;
          description?: string;
          display_order?: number;
          id?: string;
          image_path?: string;
          is_featured?: boolean;
          is_published?: boolean;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_booking_request: {
        Args: {
          p_addon_ids?: string[];
          p_booking_date: string;
          p_customer_name: string;
          p_email?: string;
          p_package_id: string;
          p_people_count?: number;
          p_phone: string;
          p_social_contact?: string;
          p_special_request?: string;
          p_time_slot: string;
        };
        Returns: {
          booking_date: string;
          booking_id: string;
          booking_number: string;
          package_name: string;
          status: Database["public"]["Enums"]["booking_status"];
          time_slot: string;
          total_price: number;
        }[];
      };
    };
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled";
      portfolio_category:
        | "portrait"
        | "graduation"
        | "couple"
        | "family"
        | "wedding"
        | "birthday"
        | "product"
        | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      portfolio_category: [
        "portrait",
        "graduation",
        "couple",
        "family",
        "wedding",
        "birthday",
        "product",
        "other",
      ],
    },
  },
} as const;
