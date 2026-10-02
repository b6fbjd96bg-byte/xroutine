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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          published: boolean
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_lessons: {
        Row: {
          body: string
          created_at: string
          date: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          date?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          date?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_logins: {
        Row: {
          created_at: string
          id: string
          login_date: string
          streak_count: number
          user_id: string
          xp_claimed: number
        }
        Insert: {
          created_at?: string
          id?: string
          login_date?: string
          streak_count?: number
          user_id: string
          xp_claimed?: number
        }
        Update: {
          created_at?: string
          id?: string
          login_date?: string
          streak_count?: number
          user_id?: string
          xp_claimed?: number
        }
        Relationships: []
      }
      email_preferences: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          weekly_report_enabled: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          weekly_report_enabled?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          weekly_report_enabled?: boolean
        }
        Relationships: []
      }
      habits: {
        Row: {
          completed_days: number[]
          created_at: string
          goal: number
          id: string
          linked_to: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_days?: number[]
          created_at?: string
          goal?: number
          id?: string
          linked_to?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_days?: number[]
          created_at?: string
          goal?: number
          id?: string
          linked_to?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_linked_to_fkey"
            columns: ["linked_to"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_checkins: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: number
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          mood: number
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: number
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          note: string | null
          plan: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          note?: string | null
          plan?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          note?: string | null
          plan?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          account_holder: string
          account_number: string
          admin_note: string | null
          amount: number
          created_at: string
          id: string
          ifsc: string
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          account_holder: string
          account_number: string
          admin_note?: string | null
          amount: number
          created_at?: string
          id?: string
          ifsc: string
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          account_holder?: string
          account_number?: string
          admin_note?: string | null
          amount?: number
          created_at?: string
          id?: string
          ifsc?: string
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_waitlist: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          referral_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          referral_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          referral_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referral_earnings: {
        Row: {
          amount: number
          available_at: string
          created_at: string
          id: string
          level: number
          payment_id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          amount: number
          available_at?: string
          created_at?: string
          id?: string
          level?: number
          payment_id: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          amount?: number
          available_at?: string
          created_at?: string
          id?: string
          level?: number
          payment_id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_earnings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      routine_checks: {
        Row: {
          created_at: string
          date: string
          done_steps: string[]
          id: string
          routine_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          done_steps?: string[]
          id?: string
          routine_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          done_steps?: string[]
          id?: string
          routine_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_checks_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string
          id: string
          name: string
          steps: Json
          time_of_day: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          steps?: Json
          time_of_day?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          steps?: Json
          time_of_day?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_requests: {
        Row: {
          admin_note: string | null
          created_at: string
          id: string
          processed_at: string | null
          school: string
          status: string
          student_id: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          school: string
          status?: string
          student_id?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          school?: string
          status?: string
          student_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          priority?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_commitments: {
        Row: {
          commitment_text: string
          created_at: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          commitment_text: string
          created_at?: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          commitment_text?: string
          created_at?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: []
      }
      user_gamification: {
        Row: {
          created_at: string
          emergency_skips_remaining: number
          emergency_skips_used: number
          id: string
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_skips_remaining?: number
          emergency_skips_used?: number
          id?: string
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_skips_remaining?: number
          emergency_skips_used?: number
          id?: string
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean
          id: string
          is_student: boolean
          plan: string | null
          premium_until: string | null
          razorpay_subscription_id: string | null
          started_at: string
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          id?: string
          is_student?: boolean
          plan?: string | null
          premium_until?: string | null
          razorpay_subscription_id?: string | null
          started_at?: string
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          id?: string
          is_student?: boolean
          plan?: string | null
          premium_until?: string | null
          razorpay_subscription_id?: string | null
          started_at?: string
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_habits: {
        Row: {
          completed_weeks: number[]
          created_at: string
          goal: number
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_weeks?: number[]
          created_at?: string
          goal?: number
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_weeks?: number[]
          created_at?: string
          goal?: number
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_referral: { Args: { _code: string }; Returns: string }
      get_referral_wallet: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lifetime_spots_left: { Args: never; Returns: number }
      request_payout: {
        Args: {
          _account: string
          _amount: number
          _holder: string
          _ifsc: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
