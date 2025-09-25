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
      adoption_applications: {
        Row: {
          address: string
          admin_notes: string | null
          applicant_email: string
          applicant_name: string
          applicant_phone: string
          children_ages: string[] | null
          city: string
          created_at: string
          daily_schedule: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience_with_dogs: string | null
          has_children: boolean | null
          has_other_pets: boolean | null
          housing_type: string
          id: string
          other_pets_description: string | null
          puppy_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string
          veterinarian_name: string | null
          veterinarian_phone: string | null
          why_this_puppy: string
          yard_size: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          applicant_email: string
          applicant_name: string
          applicant_phone: string
          children_ages?: string[] | null
          city: string
          created_at?: string
          daily_schedule?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_with_dogs?: string | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          housing_type: string
          id?: string
          other_pets_description?: string | null
          puppy_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          veterinarian_name?: string | null
          veterinarian_phone?: string | null
          why_this_puppy: string
          yard_size?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string
          children_ages?: string[] | null
          city?: string
          created_at?: string
          daily_schedule?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_with_dogs?: string | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          housing_type?: string
          id?: string
          other_pets_description?: string | null
          puppy_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          veterinarian_name?: string | null
          veterinarian_phone?: string | null
          why_this_puppy?: string
          yard_size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adoption_applications_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      business_sponsors: {
        Row: {
          address: string | null
          business_name: string
          city: string
          contact_email: string
          contact_person: string | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          logo_url: string | null
          monthly_amount: number
          phone: string | null
          sponsorship_level: string
          started_at: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          city: string
          contact_email: string
          contact_person?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          monthly_amount?: number
          phone?: string | null
          sponsorship_level?: string
          started_at?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string
          contact_email?: string
          contact_person?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          monthly_amount?: number
          phone?: string | null
          sponsorship_level?: string
          started_at?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      contact_interactions: {
        Row: {
          contact_id: string
          created_at: string
          created_by: string | null
          id: string
          interaction_data: Json | null
          interaction_type: string
          source: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          source: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          source?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          name: string
          phone: string | null
          priority: string | null
          reply_sent: boolean | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          name: string
          phone?: string | null
          priority?: string | null
          reply_sent?: boolean | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          name?: string
          phone?: string | null
          priority?: string | null
          reply_sent?: boolean | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_tag_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          contact_id: string
          contact_source: string
          id: string
          tag_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          contact_id: string
          contact_source: string
          id?: string
          tag_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          contact_id?: string
          contact_source?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "contact_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_tags: {
        Row: {
          color: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string | null
          donor_email: string
          donor_name: string | null
          id: string
          is_anonymous: boolean | null
          is_monthly: boolean | null
          message: string | null
          status: Database["public"]["Enums"]["donation_status"] | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          donor_email: string
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_monthly?: boolean | null
          message?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          donor_email?: string
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_monthly?: boolean | null
          message?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          number_of_people: number | null
          participant_email: string
          participant_name: string
          participant_phone: string | null
          payment_status: string | null
          special_requests: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          number_of_people?: number | null
          participant_email: string
          participant_name: string
          participant_phone?: string | null
          payment_status?: string | null
          special_requests?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          number_of_people?: number | null
          participant_email?: string
          participant_name?: string
          participant_phone?: string | null
          payment_status?: string | null
          special_requests?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          current_registrations: number | null
          description_en: string
          description_es: string
          event_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          max_capacity: number | null
          registration_fee: number | null
          requires_registration: boolean | null
          title_en: string
          title_es: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_registrations?: number | null
          description_en: string
          description_es: string
          event_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          max_capacity?: number | null
          registration_fee?: number | null
          requires_registration?: boolean | null
          title_en: string
          title_es: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_registrations?: number | null
          description_en?: string
          description_es?: string
          event_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          max_capacity?: number | null
          registration_fee?: number | null
          requires_registration?: boolean | null
          title_en?: string
          title_es?: string
          updated_at?: string
        }
        Relationships: []
      }
      foster_families: {
        Row: {
          address: string
          approved_at: string | null
          approved_by: string | null
          availability_end: string | null
          availability_start: string | null
          children_ages: string[] | null
          city: string
          contact_person: string
          created_at: string
          email: string
          experience_level: string | null
          family_name: string
          has_children: boolean | null
          has_other_pets: boolean | null
          home_type: string | null
          id: string
          max_dogs: number | null
          notes: string | null
          other_pets_description: string | null
          phone: string
          preferred_dog_size: Database["public"]["Enums"]["puppy_size"][] | null
          special_needs_ok: boolean | null
          status: string | null
          updated_at: string
          yard_size: string | null
        }
        Insert: {
          address: string
          approved_at?: string | null
          approved_by?: string | null
          availability_end?: string | null
          availability_start?: string | null
          children_ages?: string[] | null
          city: string
          contact_person: string
          created_at?: string
          email: string
          experience_level?: string | null
          family_name: string
          has_children?: boolean | null
          has_other_pets?: boolean | null
          home_type?: string | null
          id?: string
          max_dogs?: number | null
          notes?: string | null
          other_pets_description?: string | null
          phone: string
          preferred_dog_size?:
            | Database["public"]["Enums"]["puppy_size"][]
            | null
          special_needs_ok?: boolean | null
          status?: string | null
          updated_at?: string
          yard_size?: string | null
        }
        Update: {
          address?: string
          approved_at?: string | null
          approved_by?: string | null
          availability_end?: string | null
          availability_start?: string | null
          children_ages?: string[] | null
          city?: string
          contact_person?: string
          created_at?: string
          email?: string
          experience_level?: string | null
          family_name?: string
          has_children?: boolean | null
          has_other_pets?: boolean | null
          home_type?: string | null
          id?: string
          max_dogs?: number | null
          notes?: string | null
          other_pets_description?: string | null
          phone?: string
          preferred_dog_size?:
            | Database["public"]["Enums"]["puppy_size"][]
            | null
          special_needs_ok?: boolean | null
          status?: string | null
          updated_at?: string
          yard_size?: string | null
        }
        Relationships: []
      }
      foster_placements: {
        Row: {
          actual_end_date: string | null
          created_at: string
          expected_end_date: string | null
          foster_family_id: string
          id: string
          placement_notes: string | null
          puppy_id: string
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          created_at?: string
          expected_end_date?: string | null
          foster_family_id: string
          id?: string
          placement_notes?: string | null
          puppy_id: string
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          created_at?: string
          expected_end_date?: string | null
          foster_family_id?: string
          id?: string
          placement_notes?: string | null
          puppy_id?: string
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "foster_placements_foster_family_id_fkey"
            columns: ["foster_family_id"]
            isOneToOne: false
            referencedRelation: "foster_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foster_placements_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      fundraising_goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          deadline: string | null
          description_en: string
          description_es: string
          id: string
          is_active: boolean | null
          target_amount: number
          title_en: string
          title_es: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          deadline?: string | null
          description_en: string
          description_es: string
          id?: string
          is_active?: boolean | null
          target_amount: number
          title_en: string
          title_es: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          deadline?: string | null
          description_en?: string
          description_es?: string
          id?: string
          is_active?: boolean | null
          target_amount?: number
          title_en?: string
          title_es?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          location: string
          name: string
          phone: string | null
          preferences: Json | null
          source: string | null
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          location: string
          name: string
          phone?: string | null
          preferences?: Json | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          location?: string
          name?: string
          phone?: string | null
          preferences?: Json | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      puppies: {
        Row: {
          additional_images: string[] | null
          adoption_fee: number | null
          age_months: number
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          breed: string
          created_at: string | null
          description_en: string
          description_es: string
          good_with_cats: boolean | null
          good_with_dogs: boolean | null
          good_with_kids: boolean | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          last_viewed_at: string | null
          location: string
          media_metadata: Json | null
          media_order: Json | null
          name: string
          publish_date: string | null
          rejection_reason: string | null
          size: Database["public"]["Enums"]["puppy_size"]
          special_needs: string | null
          status: Database["public"]["Enums"]["puppy_status"] | null
          temperament: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
          video_urls: string[] | null
          view_count: number | null
        }
        Insert: {
          additional_images?: string[] | null
          adoption_fee?: number | null
          age_months: number
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          breed: string
          created_at?: string | null
          description_en: string
          description_es: string
          good_with_cats?: boolean | null
          good_with_dogs?: boolean | null
          good_with_kids?: boolean | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          last_viewed_at?: string | null
          location: string
          media_metadata?: Json | null
          media_order?: Json | null
          name: string
          publish_date?: string | null
          rejection_reason?: string | null
          size: Database["public"]["Enums"]["puppy_size"]
          special_needs?: string | null
          status?: Database["public"]["Enums"]["puppy_status"] | null
          temperament?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          video_urls?: string[] | null
          view_count?: number | null
        }
        Update: {
          additional_images?: string[] | null
          adoption_fee?: number | null
          age_months?: number
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          breed?: string
          created_at?: string | null
          description_en?: string
          description_es?: string
          good_with_cats?: boolean | null
          good_with_dogs?: boolean | null
          good_with_kids?: boolean | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          last_viewed_at?: string | null
          location?: string
          media_metadata?: Json | null
          media_order?: Json | null
          name?: string
          publish_date?: string | null
          rejection_reason?: string | null
          size?: Database["public"]["Enums"]["puppy_size"]
          special_needs?: string | null
          status?: Database["public"]["Enums"]["puppy_status"] | null
          temperament?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          video_urls?: string[] | null
          view_count?: number | null
        }
        Relationships: []
      }
      puppy_status_history: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by: string | null
          id: string
          new_status: Database["public"]["Enums"]["puppy_status"]
          old_status: Database["public"]["Enums"]["puppy_status"] | null
          puppy_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["puppy_status"]
          old_status?: Database["public"]["Enums"]["puppy_status"] | null
          puppy_id: string
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["puppy_status"]
          old_status?: Database["public"]["Enums"]["puppy_status"] | null
          puppy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_status_history_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_tiers: {
        Row: {
          color: string
          created_at: string | null
          description_en: string
          description_es: string
          icon: string
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          monthly_amount: number
          name_en: string
          name_es: string
          perks_en: string[]
          perks_es: string[]
        }
        Insert: {
          color: string
          created_at?: string | null
          description_en: string
          description_es: string
          icon: string
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_amount: number
          name_en: string
          name_es: string
          perks_en: string[]
          perks_es: string[]
        }
        Update: {
          color?: string
          created_at?: string | null
          description_en?: string
          description_es?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_amount?: number
          name_en?: string
          name_es?: string
          perks_en?: string[]
          perks_es?: string[]
        }
        Relationships: []
      }
      sponsorships: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          id: string
          sponsor_email: string
          sponsor_name: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["donation_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          sponsor_email: string
          sponsor_name?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          sponsor_email?: string
          sponsor_name?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsorships_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "sponsorship_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_contacts: {
        Row: {
          active_status: boolean | null
          created_at: string | null
          email: string | null
          engagement_score: number | null
          id: string
          location: string | null
          name: string | null
          phone: string | null
          source: string | null
          source_data: Json | null
        }
        Insert: {
          active_status?: boolean | null
          created_at?: string | null
          email?: string | null
          engagement_score?: number | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          source_data?: Json | null
        }
        Update: {
          active_status?: boolean | null
          created_at?: string | null
          email?: string | null
          engagement_score?: number | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          source_data?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          address: string | null
          age: number | null
          availability: string[] | null
          background_check_consent: boolean | null
          can_drive: boolean | null
          city: string
          created_at: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience_with_dogs: string | null
          full_name: string
          has_transport: boolean | null
          id: string
          notes: string | null
          phone: string | null
          previous_volunteer_work: string | null
          status: string | null
          terms_accepted: boolean | null
          updated_at: string
          volunteer_areas: string[] | null
          why_volunteer: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          availability?: string[] | null
          background_check_consent?: boolean | null
          can_drive?: boolean | null
          city: string
          created_at?: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_with_dogs?: string | null
          full_name: string
          has_transport?: boolean | null
          id?: string
          notes?: string | null
          phone?: string | null
          previous_volunteer_work?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          volunteer_areas?: string[] | null
          why_volunteer: string
        }
        Update: {
          address?: string | null
          age?: number | null
          availability?: string[] | null
          background_check_consent?: boolean | null
          can_drive?: boolean | null
          city?: string
          created_at?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_with_dogs?: string | null
          full_name?: string
          has_transport?: boolean | null
          id?: string
          notes?: string | null
          phone?: string | null
          previous_volunteer_work?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          volunteer_areas?: string[] | null
          why_volunteer?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_user_admin: {
        Args: { user_email: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      donation_status: "pending" | "completed" | "failed" | "refunded"
      puppy_size: "small" | "medium" | "large"
      puppy_status:
        | "available"
        | "pending"
        | "adopted"
        | "draft"
        | "ready_for_review"
        | "pending_adoption"
        | "fostered"
        | "medical_hold"
        | "not_suitable"
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
      app_role: ["admin", "moderator", "user"],
      donation_status: ["pending", "completed", "failed", "refunded"],
      puppy_size: ["small", "medium", "large"],
      puppy_status: [
        "available",
        "pending",
        "adopted",
        "draft",
        "ready_for_review",
        "pending_adoption",
        "fostered",
        "medical_hold",
        "not_suitable",
      ],
    },
  },
} as const
