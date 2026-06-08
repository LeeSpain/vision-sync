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
      pricing_industries: {
        Row: {
          id: string
          slug: string
          name: string
          core_service_line: string | null
          color: string | null
          voice_native: boolean
          sort_order: number
          is_published: boolean
          has_draft_changes: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          core_service_line?: string | null
          color?: string | null
          voice_native?: boolean
          sort_order?: number
          is_published?: boolean
          has_draft_changes?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          core_service_line?: string | null
          color?: string | null
          voice_native?: boolean
          sort_order?: number
          is_published?: boolean
          has_draft_changes?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_packages: {
        Row: {
          id: string
          industry_id: string
          tier: string
          name: string
          ex_vat_price: number
          inc_vat_price: number
          voice_minutes: number
          tagline: string | null
          includes: Json
          draft_name: string | null
          draft_ex_vat_price: number | null
          draft_inc_vat_price: number | null
          draft_voice_minutes: number | null
          draft_tagline: string | null
          draft_includes: Json | null
          has_draft: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          industry_id: string
          tier: string
          name: string
          ex_vat_price: number
          inc_vat_price: number
          voice_minutes?: number
          tagline?: string | null
          includes?: Json
          draft_name?: string | null
          draft_ex_vat_price?: number | null
          draft_inc_vat_price?: number | null
          draft_voice_minutes?: number | null
          draft_tagline?: string | null
          draft_includes?: Json | null
          has_draft?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          industry_id?: string
          tier?: string
          name?: string
          ex_vat_price?: number
          inc_vat_price?: number
          voice_minutes?: number
          tagline?: string | null
          includes?: Json
          draft_name?: string | null
          draft_ex_vat_price?: number | null
          draft_inc_vat_price?: number | null
          draft_voice_minutes?: number | null
          draft_tagline?: string | null
          draft_includes?: Json | null
          has_draft?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_packages_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "pricing_industries"
            referencedColumns: ["id"]
          }
        ]
      }
      plans: {
        Row: {
          id: string
          name: string
          slug: string
          monthly_price: number | null
          yearly_price: number | null
          setup_fee: number | null
          custom_price_label: string | null
          description: string | null
          features: Json | null
          cta_label: string | null
          cta_link: string | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          monthly_price?: number | null
          yearly_price?: number | null
          setup_fee?: number | null
          custom_price_label?: string | null
          description?: string | null
          features?: Json | null
          cta_label?: string | null
          cta_link?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          monthly_price?: number | null
          yearly_price?: number | null
          setup_fee?: number | null
          custom_price_label?: string | null
          description?: string | null
          features?: Json | null
          cta_label?: string | null
          cta_link?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          long_description: string | null
          monthly_addon_price: number | null
          setup_fee: number | null
          internal_cost: number | null
          ex_vat_price: number | null
          iva_amount: number | null
          total_inc_vat: number | null
          is_voice_module: boolean | null
          voice_minutes: number | null
          industry_slugs: Json | null
          features: Json | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string | null
          long_description?: string | null
          monthly_addon_price?: number | null
          setup_fee?: number | null
          internal_cost?: number | null
          ex_vat_price?: number | null
          iva_amount?: number | null
          total_inc_vat?: number | null
          is_voice_module?: boolean | null
          voice_minutes?: number | null
          industry_slugs?: Json | null
          features?: Json | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string | null
          long_description?: string | null
          monthly_addon_price?: number | null
          setup_fee?: number | null
          internal_cost?: number | null
          ex_vat_price?: number | null
          iva_amount?: number | null
          total_inc_vat?: number | null
          is_voice_module?: boolean | null
          voice_minutes?: number | null
          industry_slugs?: Json | null
          features?: Json | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      solutions: {
        Row: {
          id: string
          name: string
          slug: string
          summary: string | null
          description: string | null
          industry_slug: string | null
          internal_cost: number | null
          ex_vat_price: number | null
          iva_amount: number | null
          total_inc_vat: number | null
          voice_included: boolean | null
          voice_minutes_included: number | null
          pain_statement: string | null
          base_includes: Json | null
          icon_name: string | null
          industries: Json | null
          included_modules: Json | null
          cta_label: string | null
          cta_link: string | null
          is_featured: boolean | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          summary?: string | null
          description?: string | null
          industry_slug?: string | null
          internal_cost?: number | null
          ex_vat_price?: number | null
          iva_amount?: number | null
          total_inc_vat?: number | null
          voice_included?: boolean | null
          voice_minutes_included?: number | null
          pain_statement?: string | null
          base_includes?: Json | null
          icon_name?: string | null
          industries?: Json | null
          included_modules?: Json | null
          cta_label?: string | null
          cta_link?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          summary?: string | null
          description?: string | null
          industry_slug?: string | null
          internal_cost?: number | null
          ex_vat_price?: number | null
          iva_amount?: number | null
          total_inc_vat?: number | null
          voice_included?: boolean | null
          voice_minutes_included?: number | null
          pain_statement?: string | null
          base_includes?: Json | null
          icon_name?: string | null
          industries?: Json | null
          included_modules?: Json | null
          cta_label?: string | null
          cta_link?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          id: string
          page_key: string
          section_key: string
          title: string | null
          subtitle: string | null
          content: string | null
          cta_label: string | null
          cta_link: string | null
          image_url: string | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_key: string
          section_key: string
          title?: string | null
          subtitle?: string | null
          content?: string | null
          cta_label?: string | null
          cta_link?: string | null
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_key?: string
          section_key?: string
          title?: string | null
          subtitle?: string | null
          content?: string | null
          cta_label?: string | null
          cta_link?: string | null
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          id: string
          quote_reference: string
          client_first_name: string
          client_last_name: string
          business_name: string
          email: string
          phone: string | null
          industry_slug: string
          industry_name: string
          base_package_name: string
          selected_tier: string | null
          base_ex_vat: number
          base_iva: number
          base_inc_vat: number
          modules_selected: Json
          modules_ex_vat_total: number
          modules_iva_total: number
          modules_inc_vat_total: number
          total_ex_vat: number
          total_iva: number
          total_inc_vat: number
          client_notes: string | null
          status: string
          sent_at: string | null
          viewed_at: string | null
          contacted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_reference?: string
          client_first_name: string
          client_last_name: string
          business_name: string
          email: string
          phone?: string | null
          industry_slug: string
          industry_name: string
          base_package_name: string
          selected_tier?: string | null
          base_ex_vat: number
          base_iva: number
          base_inc_vat: number
          modules_selected?: Json
          modules_ex_vat_total?: number
          modules_iva_total?: number
          modules_inc_vat_total?: number
          total_ex_vat: number
          total_iva: number
          total_inc_vat: number
          client_notes?: string | null
          status?: string
          sent_at?: string | null
          viewed_at?: string | null
          contacted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_reference?: string
          client_first_name?: string
          client_last_name?: string
          business_name?: string
          email?: string
          phone?: string | null
          industry_slug?: string
          industry_name?: string
          base_package_name?: string
          selected_tier?: string | null
          base_ex_vat?: number
          base_iva?: number
          base_inc_vat?: number
          modules_selected?: Json
          modules_ex_vat_total?: number
          modules_iva_total?: number
          modules_inc_vat_total?: number
          total_ex_vat?: number
          total_iva?: number
          total_inc_vat?: number
          client_notes?: string | null
          status?: string
          sent_at?: string | null
          viewed_at?: string | null
          contacted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          company_name: string
          site_title: string | null
          meta_title: string | null
          meta_description: string | null
          contact_email: string | null
          phone: string | null
          address: string | null
          footer_text: string | null
          primary_cta_label: string | null
          primary_cta_link: string | null
          secondary_cta_label: string | null
          secondary_cta_link: string | null
          social_links: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name?: string
          site_title?: string | null
          meta_title?: string | null
          meta_description?: string | null
          contact_email?: string | null
          phone?: string | null
          address?: string | null
          footer_text?: string | null
          primary_cta_label?: string | null
          primary_cta_link?: string | null
          secondary_cta_label?: string | null
          secondary_cta_link?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          site_title?: string | null
          meta_title?: string | null
          meta_description?: string | null
          contact_email?: string | null
          phone?: string | null
          address?: string | null
          footer_text?: string | null
          primary_cta_label?: string | null
          primary_cta_link?: string | null
          secondary_cta_label?: string | null
          secondary_cta_link?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      agent_conversations: {
        Row: {
          agent_id: string | null
          conversation_id: string | null
          ended_at: string | null
          handoff_from: string | null
          handoff_reason: string | null
          id: string
          messages_handled: number | null
          outcome: string | null
          started_at: string | null
        }
        Insert: {
          agent_id?: string | null
          conversation_id?: string | null
          ended_at?: string | null
          handoff_from?: string | null
          handoff_reason?: string | null
          id?: string
          messages_handled?: number | null
          outcome?: string | null
          started_at?: string | null
        }
        Update: {
          agent_id?: string | null
          conversation_id?: string | null
          ended_at?: string | null
          handoff_from?: string | null
          handoff_reason?: string | null
          id?: string
          messages_handled?: number | null
          outcome?: string | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_conversations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_conversations_handoff_from_fkey"
            columns: ["handoff_from"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_routing_rules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          source_agent_id: string | null
          target_agent_id: string | null
          trigger_type: string
          trigger_value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          source_agent_id?: string | null
          target_agent_id?: string | null
          trigger_type: string
          trigger_value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          source_agent_id?: string | null
          target_agent_id?: string | null
          trigger_type?: string
          trigger_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_routing_rules_source_agent_id_fkey"
            columns: ["source_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_routing_rules_target_agent_id_fkey"
            columns: ["target_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
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
          access_level: string | null
          agent_type: string
          avatar_url: string | null
          category: string | null
          created_at: string | null
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_master: boolean | null
          knowledge_scope: string[] | null
          max_tokens: number | null
          name: string
          parent_agent_id: string | null
          personality: string | null
          role: string | null
          specializations: string[] | null
          temperature: number | null
          updated_at: string | null
          voice_id: string | null
        }
        Insert: {
          access_level?: string | null
          agent_type?: string
          avatar_url?: string | null
          category?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_master?: boolean | null
          knowledge_scope?: string[] | null
          max_tokens?: number | null
          name: string
          parent_agent_id?: string | null
          personality?: string | null
          role?: string | null
          specializations?: string[] | null
          temperature?: number | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Update: {
          access_level?: string | null
          agent_type?: string
          avatar_url?: string | null
          category?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_master?: boolean | null
          knowledge_scope?: string[] | null
          max_tokens?: number | null
          name?: string
          parent_agent_id?: string | null
          personality?: string | null
          role?: string | null
          specializations?: string[] | null
          temperature?: number | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_parent_agent_id_fkey"
            columns: ["parent_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          agent_history: Json | null
          agent_id: string | null
          ai_response: string | null
          context: Json | null
          conversation_data: Json | null
          conversion_score: number | null
          created_at: string | null
          current_agent_id: string | null
          id: string
          intent: string | null
          is_escalated: boolean | null
          lead_id: string | null
          lead_qualified: boolean | null
          resolution_status: string | null
          sentiment: number | null
          session_id: string | null
          status: string | null
          topics: string[] | null
          user_message: string
          visitor_id: string | null
        }
        Insert: {
          agent_history?: Json | null
          agent_id?: string | null
          ai_response?: string | null
          context?: Json | null
          conversation_data?: Json | null
          conversion_score?: number | null
          created_at?: string | null
          current_agent_id?: string | null
          id?: string
          intent?: string | null
          is_escalated?: boolean | null
          lead_id?: string | null
          lead_qualified?: boolean | null
          resolution_status?: string | null
          sentiment?: number | null
          session_id?: string | null
          status?: string | null
          topics?: string[] | null
          user_message: string
          visitor_id?: string | null
        }
        Update: {
          agent_history?: Json | null
          agent_id?: string | null
          ai_response?: string | null
          context?: Json | null
          conversation_data?: Json | null
          conversion_score?: number | null
          created_at?: string | null
          current_agent_id?: string | null
          id?: string
          intent?: string | null
          is_escalated?: boolean | null
          lead_id?: string | null
          lead_qualified?: boolean | null
          resolution_status?: string | null
          sentiment?: number | null
          session_id?: string | null
          status?: string | null
          topics?: string[] | null
          user_message?: string
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
            foreignKeyName: "ai_conversations_current_agent_id_fkey"
            columns: ["current_agent_id"]
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
      brain_reports: {
        Row: {
          generated_at: string | null
          id: string
          priority: string | null
          report_data: Json
          report_type: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          priority?: string | null
          report_data: Json
          report_type: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          priority?: string | null
          report_data?: Json
          report_type?: string
        }
        Relationships: []
      }
      conversion_tracking: {
        Row: {
          conversion_value: number | null
          created_at: string
          event_name: string
          event_type: string
          funnel_stage: string
          id: string
          lead_id: string | null
          metadata: Json | null
          page_path: string | null
          project_id: string | null
          quote_id: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          conversion_value?: number | null
          created_at?: string
          event_name: string
          event_type: string
          funnel_stage: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          page_path?: string | null
          project_id?: string | null
          quote_id?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          conversion_value?: number | null
          created_at?: string
          event_name?: string
          event_type?: string
          funnel_stage?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          page_path?: string | null
          project_id?: string | null
          quote_id?: string | null
          session_id?: string
          user_id?: string | null
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
      human_escalations: {
        Row: {
          assigned_to: string | null
          conversation_id: string | null
          created_at: string | null
          escalated_by_agent: string | null
          id: string
          priority: string | null
          reason: string
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          conversation_id?: string | null
          created_at?: string | null
          escalated_by_agent?: string | null
          id?: string
          priority?: string | null
          reason: string
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          conversation_id?: string | null
          created_at?: string | null
          escalated_by_agent?: string | null
          id?: string
          priority?: string | null
          reason?: string
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "human_escalations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "human_escalations_escalated_by_agent_fkey"
            columns: ["escalated_by_agent"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
          notes: string | null
          phone: string | null
          pipeline_stage: string | null
          preferred_start_date: string | null
          priority: string | null
          project_id: string | null
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
          notes?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          preferred_start_date?: string | null
          priority?: string | null
          project_id?: string | null
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
          notes?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          preferred_start_date?: string | null
          priority?: string | null
          project_id?: string | null
          project_type?: string | null
          qualification_status?: string | null
          source?: string | null
          status?: string | null
          technical_requirements?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      page_analytics: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          duration_seconds: number | null
          exited_at: string | null
          id: string
          interactions_count: number | null
          page_path: string
          page_title: string | null
          referrer: string | null
          scroll_depth: number | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          exited_at?: string | null
          id?: string
          interactions_count?: number | null
          page_path: string
          page_title?: string | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          exited_at?: string | null
          id?: string
          interactions_count?: number | null
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          aggregation_period: string | null
          dimensions: Json | null
          id: string
          metric_name: string
          metric_type: string
          metric_unit: string | null
          metric_value: number
          timestamp: string
        }
        Insert: {
          aggregation_period?: string | null
          dimensions?: Json | null
          id?: string
          metric_name: string
          metric_type: string
          metric_unit?: string | null
          metric_value: number
          timestamp?: string
        }
        Update: {
          aggregation_period?: string | null
          dimensions?: Json | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_unit?: string | null
          metric_value?: number
          timestamp?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      // Deprecated: legacy table - kept for data retention
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
          investment_percentage: number | null
          investor_count: number | null
          is_featured: boolean | null
          is_public: boolean | null
          maintenance_fee: number | null
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
          investment_percentage?: number | null
          investor_count?: number | null
          is_featured?: boolean | null
          is_public?: boolean | null
          maintenance_fee?: number | null
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
          investment_percentage?: number | null
          investor_count?: number | null
          is_featured?: boolean | null
          is_public?: boolean | null
          maintenance_fee?: number | null
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
      routing_rule_analytics: {
        Row: {
          confidence_score: number | null
          id: string
          message_preview: string | null
          result_agent_id: string | null
          rule_id: string | null
          session_id: string | null
          triggered_at: string
        }
        Insert: {
          confidence_score?: number | null
          id?: string
          message_preview?: string | null
          result_agent_id?: string | null
          rule_id?: string | null
          session_id?: string | null
          triggered_at?: string
        }
        Update: {
          confidence_score?: number | null
          id?: string
          message_preview?: string | null
          result_agent_id?: string | null
          rule_id?: string | null
          session_id?: string | null
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routing_rule_analytics_result_agent_id_fkey"
            columns: ["result_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routing_rule_analytics_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "agent_routing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      // Deprecated: legacy table - kept for data retention
      legacy_site_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
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
      deals: {
        Row: {
          id: string
          lead_id: string | null
          business_name: string
          industry: string | null
          location: string | null
          website: string | null
          current_stage: string
          estimated_value: number | null
          priority: string | null
          next_action: string | null
          follow_up_date: string | null
          contact_name: string | null
          contact_title: string | null
          contact_email: string | null
          contact_phone: string | null
          ai_summary: string | null
          quote_status: string | null
          contract_status: string | null
          payment_status: string | null
          demo_id: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          business_name: string
          industry?: string | null
          location?: string | null
          website?: string | null
          current_stage?: string
          estimated_value?: number | null
          priority?: string | null
          next_action?: string | null
          follow_up_date?: string | null
          contact_name?: string | null
          contact_title?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          ai_summary?: string | null
          quote_status?: string | null
          contract_status?: string | null
          payment_status?: string | null
          demo_id?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          business_name?: string
          industry?: string | null
          location?: string | null
          website?: string | null
          current_stage?: string
          estimated_value?: number | null
          priority?: string | null
          next_action?: string | null
          follow_up_date?: string | null
          contact_name?: string | null
          contact_title?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          ai_summary?: string | null
          quote_status?: string | null
          contract_status?: string | null
          payment_status?: string | null
          demo_id?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deal_activities: {
        Row: {
          id: string
          deal_id: string
          activity_type: string
          message: string
          actor: string
          created_at: string
        }
        Insert: {
          id?: string
          deal_id: string
          activity_type: string
          message: string
          actor: string
          created_at?: string
        }
        Update: {
          id?: string
          deal_id?: string
          activity_type?: string
          message?: string
          actor?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_payments: {
        Row: {
          id: string
          deal_id: string | null
          payment_type: string
          amount: number
          currency: string | null
          status: string | null
          reference: string | null
          due_date: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_id?: string | null
          payment_type?: string
          amount?: number
          currency?: string | null
          status?: string | null
          reference?: string | null
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_id?: string | null
          payment_type?: string
          amount?: number
          currency?: string | null
          status?: string | null
          reference?: string | null
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_payments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_templates: {
        Row: {
          id: string
          name: string
          category: string
          thumbnail_class: string | null
          description: string | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string
          thumbnail_class?: string | null
          description?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          thumbnail_class?: string | null
          description?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
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
      publish_pricing_industry: {
        Args: {
          p_industry_id: string
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
