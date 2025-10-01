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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_agent_settings: {
        Row: {
          agent_id: string | null
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
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
          category: string | null
          created_at: string | null
          default_settings: Json | null
          description: string | null
          id: string
          name: string
          personality: string | null
          role: string | null
          voice_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          default_settings?: Json | null
          description?: string | null
          id?: string
          name: string
          personality?: string | null
          role?: string | null
          voice_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          default_settings?: Json | null
          description?: string | null
          id?: string
          name?: string
          personality?: string | null
          role?: string | null
          voice_id?: string | null
        }
        Relationships: []
      }
      ai_agents: {
        Row: {
          category: string | null
          created_at: string | null
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          personality: string | null
          role: string | null
          updated_at: string | null
          voice_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          personality?: string | null
          role?: string | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          personality?: string | null
          role?: string | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          agent_id: string | null
          ai_response: string | null
          context: Json | null
          created_at: string | null
          id: string
          session_id: string | null
          user_message: string
        }
        Insert: {
          agent_id?: string | null
          ai_response?: string | null
          context?: Json | null
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_message: string
        }
        Update: {
          agent_id?: string | null
          ai_response?: string | null
          context?: Json | null
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_training_data: {
        Row: {
          agent_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          training_type: string
        }
        Insert: {
          agent_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          training_type: string
        }
        Update: {
          agent_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          training_type?: string
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
          category: string | null
          complexity_level: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          estimated_hours: number | null
          features: string[] | null
          id: string
          image_url: string | null
          industry: string | null
          is_active: boolean | null
          is_popular: boolean | null
          pricing: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          complexity_level?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          estimated_hours?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          pricing?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          complexity_level?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          estimated_hours?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          pricing?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_interactions: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          interaction_date: string | null
          interaction_type: string
          lead_id: string | null
          metadata: Json | null
          subject: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type: string
          lead_id?: string | null
          metadata?: Json | null
          subject?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string
          lead_id?: string | null
          metadata?: Json | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          company: string | null
          created_at: string | null
          email: string
          form_data: Json | null
          id: string
          industry: string | null
          last_contact_date: string | null
          lead_score: number | null
          message: string | null
          name: string
          next_follow_up: string | null
          phone: string | null
          pipeline_stage: string | null
          preferred_start_date: string | null
          project_type: string | null
          qualification_status: string | null
          source: string | null
          status: string | null
          technical_requirements: string | null
          timeline: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          form_data?: Json | null
          id?: string
          industry?: string | null
          last_contact_date?: string | null
          lead_score?: number | null
          message?: string | null
          name: string
          next_follow_up?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          preferred_start_date?: string | null
          project_type?: string | null
          qualification_status?: string | null
          source?: string | null
          status?: string | null
          technical_requirements?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          form_data?: Json | null
          id?: string
          industry?: string | null
          last_contact_date?: string | null
          lead_score?: number | null
          message?: string | null
          name?: string
          next_follow_up?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          preferred_start_date?: string | null
          project_type?: string | null
          qualification_status?: string | null
          source?: string | null
          status?: string | null
          technical_requirements?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          billing_type: string | null
          category: string | null
          content_section: string[] | null
          created_at: string | null
          demo_url: string | null
          deposit_amount: number | null
          description: string | null
          expected_roi: number | null
          funding_progress: number | null
          github_url: string | null
          id: string
          image_url: string | null
          investment_amount: number | null
          investment_deadline: string | null
          investor_count: number | null
          is_featured: boolean | null
          is_public: boolean | null
          price: number | null
          pricing: Json | null
          priority_order: number | null
          route: string | null
          social_proof: Json | null
          status: string | null
          subscription_period: string | null
          subscription_price: number | null
          technologies: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          billing_type?: string | null
          category?: string | null
          content_section?: string[] | null
          created_at?: string | null
          demo_url?: string | null
          deposit_amount?: number | null
          description?: string | null
          expected_roi?: number | null
          funding_progress?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          investment_amount?: number | null
          investment_deadline?: string | null
          investor_count?: number | null
          is_featured?: boolean | null
          is_public?: boolean | null
          price?: number | null
          pricing?: Json | null
          priority_order?: number | null
          route?: string | null
          social_proof?: Json | null
          status?: string | null
          subscription_period?: string | null
          subscription_price?: number | null
          technologies?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          billing_type?: string | null
          category?: string | null
          content_section?: string[] | null
          created_at?: string | null
          demo_url?: string | null
          deposit_amount?: number | null
          description?: string | null
          expected_roi?: number | null
          funding_progress?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          investment_amount?: number | null
          investment_deadline?: string | null
          investor_count?: number | null
          is_featured?: boolean | null
          is_public?: boolean | null
          price?: number | null
          pricing?: Json | null
          priority_order?: number | null
          route?: string | null
          social_proof?: Json | null
          status?: string | null
          subscription_period?: string | null
          subscription_price?: number | null
          technologies?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          discount_amount: number | null
          id: string
          lead_id: string | null
          line_items: Json | null
          notes: string | null
          project_description: string | null
          project_name: string
          quote_number: string
          sent_at: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          terms_and_conditions: string | null
          total: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          lead_id?: string | null
          line_items?: Json | null
          notes?: string | null
          project_description?: string | null
          project_name: string
          quote_number: string
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          terms_and_conditions?: string | null
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          lead_id?: string | null
          line_items?: Json | null
          notes?: string | null
          project_description?: string | null
          project_name?: string
          quote_number?: string
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          terms_and_conditions?: string | null
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      template_questionnaire_responses: {
        Row: {
          budget_range: string | null
          business_type: string | null
          contact_info: Json | null
          created_at: string | null
          design_preferences: Json | null
          features_needed: string[] | null
          id: string
          industry: string | null
          recommended_templates: string[] | null
          timeline: string | null
        }
        Insert: {
          budget_range?: string | null
          business_type?: string | null
          contact_info?: Json | null
          created_at?: string | null
          design_preferences?: Json | null
          features_needed?: string[] | null
          id?: string
          industry?: string | null
          recommended_templates?: string[] | null
          timeline?: string | null
        }
        Update: {
          budget_range?: string | null
          business_type?: string | null
          contact_info?: Json | null
          created_at?: string | null
          design_preferences?: Json | null
          features_needed?: string[] | null
          id?: string
          industry?: string | null
          recommended_templates?: string[] | null
          timeline?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_lead_score: {
        Args: {
          p_budget_range: string
          p_company: string
          p_inquiry_type: string
          p_timeline: string
        }
        Returns: number
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
