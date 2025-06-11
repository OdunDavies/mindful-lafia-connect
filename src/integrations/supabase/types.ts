export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      counselling_sessions: {
        Row: {
          counsellor_id: string
          created_at: string | null
          ended_at: string | null
          id: string
          notes: string | null
          scheduled_at: string | null
          started_at: string | null
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          counsellor_id: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          counsellor_id?: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "counselling_sessions_counsellor_id_fkey"
            columns: ["counsellor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counselling_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      counsellor_profiles: {
        Row: {
          availability_hours: Json | null
          bio: string | null
          experience: string
          id: string
          is_verified: boolean | null
          license_number: string
          specialization: string
          verification_date: string | null
        }
        Insert: {
          availability_hours?: Json | null
          bio?: string | null
          experience: string
          id: string
          is_verified?: boolean | null
          license_number: string
          specialization: string
          verification_date?: string | null
        }
        Update: {
          availability_hours?: Json | null
          bio?: string | null
          experience?: string
          id?: string
          is_verified?: boolean | null
          license_number?: string
          specialization?: string
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "counsellor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Lafia: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          sender_id: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          sender_id: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          sender_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "counselling_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          cancelled_sessions: number | null
          completed_sessions: number | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_online: boolean | null
          last_name: string
          last_seen: string | null
          phone: string | null
          profile_image_url: string | null
          total_sessions: number | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          bio?: string | null
          cancelled_sessions?: number | null
          completed_sessions?: number | null
          created_at?: string | null
          email: string
          first_name: string
          id: string
          is_online?: boolean | null
          last_name: string
          last_seen?: string | null
          phone?: string | null
          profile_image_url?: string | null
          total_sessions?: number | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          bio?: string | null
          cancelled_sessions?: number | null
          completed_sessions?: number | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_online?: boolean | null
          last_name?: string
          last_seen?: string | null
          phone?: string | null
          profile_image_url?: string | null
          total_sessions?: number | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      self_assessments: {
        Row: {
          created_at: string | null
          id: string
          recommendations: string | null
          responses: Json
          risk_level: string
          score: number
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recommendations?: string | null
          responses: Json
          risk_level: string
          score: number
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recommendations?: string | null
          responses?: Json
          risk_level?: string
          score?: number
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "self_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          academic_year: string | null
          department: string
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          level: string
          student_id: string
        }
        Insert: {
          academic_year?: string | null
          department: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          id: string
          level: string
          student_id: string
        }
        Update: {
          academic_year?: string | null
          department?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          level?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
