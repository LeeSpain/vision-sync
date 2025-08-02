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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_agent_settings: {
        Row: {
          agent_id: string | null
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_settings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_templates: {
        Row: {
          business_knowledge: Json | null
          category: string
          conversation_rules: Json | null
          created_at: string
          default_settings: Json | null
          department: string
          description: string | null
          id: string
          name: string
          personality: string
          role: string
          training_data: Json | null
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          business_knowledge?: Json | null
          category: string
          conversation_rules?: Json | null
          created_at?: string
          default_settings?: Json | null
          department: string
          description?: string | null
          id?: string
          name: string
          personality: string
          role: string
          training_data?: Json | null
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          business_knowledge?: Json | null
          category?: string
          conversation_rules?: Json | null
          created_at?: string
          default_settings?: Json | null
          department?: string
          description?: string | null
          id?: string
          name?: string
          personality?: string
          role?: string
          training_data?: Json | null
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      ai_agents: {
        Row: {
          avatar_config: Json | null
          business_knowledge: Json | null
          category: string | null
          conversation_rules: Json | null
          created_at: string
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          personality: string | null
          role: string | null
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          avatar_config?: Json | null
          business_knowledge?: Json | null
          category?: string | null
          conversation_rules?: Json | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          personality?: string | null
          role?: string | null
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          avatar_config?: Json | null
          business_knowledge?: Json | null
          category?: string | null
          conversation_rules?: Json | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          personality?: string | null
          role?: string | null
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          agent_id: string | null
          conversation_data: Json | null
          conversion_score: number | null
          created_at: string
          ended_at: string | null
          id: string
          lead_id: string | null
          lead_qualified: boolean | null
          session_id: string
          started_at: string
          status: string | null
          updated_at: string
          visitor_id: string | null
        }
        Insert: {
          agent_id?: string | null
          conversation_data?: Json | null
          conversion_score?: number | null
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          lead_qualified?: boolean | null
          session_id: string
          started_at?: string
          status?: string | null
          updated_at?: string
          visitor_id?: string | null
        }
        Update: {
          agent_id?: string | null
          conversation_data?: Json | null
          conversion_score?: number | null
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          lead_qualified?: boolean | null
          session_id?: string
          started_at?: string
          status?: string | null
          updated_at?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_training_data: {
        Row: {
          agent_id: string | null
          answer: string
          category: string
          context: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          priority: number | null
          question: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          answer: string
          category: string
          context?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          answer?: string
          category?: string
          context?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_training_data_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      app_templates: {
        Row: {
          ai_generated_content: Json | null
          category: string
          created_at: string
          description: string | null
          detailed_description: string | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          industry: string | null
          is_active: boolean | null
          is_popular: boolean | null
          key_features: Json | null
          pricing: Json | null
          questionnaire_weight: Json | null
          template_config: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated_content?: Json | null
          category: string
          created_at?: string
          description?: string | null
          detailed_description?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          key_features?: Json | null
          pricing?: Json | null
          questionnaire_weight?: Json | null
          template_config?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated_content?: Json | null
          category?: string
          created_at?: string
          description?: string | null
          detailed_description?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          key_features?: Json | null
          pricing?: Json | null
          questionnaire_weight?: Json | null
          template_config?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          form_data: Json | null
          id: string
          last_contact: string | null
          name: string
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          priority: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          form_data?: Json | null
          id?: string
          last_contact?: string | null
          name: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          priority?: string
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          form_data?: Json | null
          id?: string
          last_contact?: string | null
          name?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          priority?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          billing_type: string | null
          category: string
          content: Json | null
          created_at: string
          deposit_amount: number | null
          description: string | null
          domain_url: string | null
          expected_roi: number | null
          featured: boolean
          features: Json | null
          funding_progress: number | null
          gallery_images: string[] | null
          hero_image_url: string | null
          id: string
          image_url: string | null
          industry: string | null
          installment_plans: Json | null
          investment_amount: number | null
          investment_deadline: string | null
          investor_count: number | null
          key_features: Json | null
          leads_count: number
          name: string
          ownership_options: Json | null
          payment_methods: Json | null
          price: number | null
          purchase_info: Json | null
          route: string | null
          service_monthly: number | null
          social_proof: string | null
          stats: Json | null
          status: string
          subscription_period: string | null
          subscription_price: number | null
          updated_at: string
          use_cases: Json | null
          visibility: string
        }
        Insert: {
          billing_type?: string | null
          category?: string
          content?: Json | null
          created_at?: string
          deposit_amount?: number | null
          description?: string | null
          domain_url?: string | null
          expected_roi?: number | null
          featured?: boolean
          features?: Json | null
          funding_progress?: number | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          installment_plans?: Json | null
          investment_amount?: number | null
          investment_deadline?: string | null
          investor_count?: number | null
          key_features?: Json | null
          leads_count?: number
          name: string
          ownership_options?: Json | null
          payment_methods?: Json | null
          price?: number | null
          purchase_info?: Json | null
          route?: string | null
          service_monthly?: number | null
          social_proof?: string | null
          stats?: Json | null
          status?: string
          subscription_period?: string | null
          subscription_price?: number | null
          updated_at?: string
          use_cases?: Json | null
          visibility?: string
        }
        Update: {
          billing_type?: string | null
          category?: string
          content?: Json | null
          created_at?: string
          deposit_amount?: number | null
          description?: string | null
          domain_url?: string | null
          expected_roi?: number | null
          featured?: boolean
          features?: Json | null
          funding_progress?: number | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          installment_plans?: Json | null
          investment_amount?: number | null
          investment_deadline?: string | null
          investor_count?: number | null
          key_features?: Json | null
          leads_count?: number
          name?: string
          ownership_options?: Json | null
          payment_methods?: Json | null
          price?: number | null
          purchase_info?: Json | null
          route?: string | null
          service_monthly?: number | null
          social_proof?: string | null
          stats?: Json | null
          status?: string
          subscription_period?: string | null
          subscription_price?: number | null
          updated_at?: string
          use_cases?: Json | null
          visibility?: string
        }
        Relationships: []
      }
      template_questionnaire_responses: {
        Row: {
          created_at: string
          id: string
          recommended_templates: Json | null
          responses: Json
          selected_template_id: string | null
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recommended_templates?: Json | null
          responses?: Json
          selected_template_id?: string | null
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recommended_templates?: Json | null
          responses?: Json
          selected_template_id?: string | null
          session_id?: string
          updated_at?: string
        }
        Relationships: []
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
