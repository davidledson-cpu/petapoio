// Auto-generated types from Supabase schema
// Run: npm run db:generate to regenerate after schema changes

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'patient' | 'professional' | 'admin'
export type SubscriptionPlan = 'free' | 'basic' | 'premium'
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type ProfessionalTier = 'basic' | 'pro' | 'premium'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          is_active: boolean
          subscription_plan: SubscriptionPlan
          gamification_points: number
          gamification_level: number
          streak_days: number
          last_check_in: string | null
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at' | 'gamification_points' | 'gamification_level' | 'streak_days'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      professional_profiles: {
        Row: {
          id: string
          crp_number: string | null
          specialty: string[]
          bio: string | null
          short_bio: string | null
          session_price: number
          session_duration: number
          calendar_id: string | null
          stripe_account_id: string | null
          is_verified: boolean
          subscription_tier: ProfessionalTier
          rating_avg: number
          total_sessions: number
          accepts_emergency: boolean
          video_intro_url: string | null
          languages: string[]
          approach: string[]
        }
        Insert: Omit<Database['public']['Tables']['professional_profiles']['Row'], 'rating_avg' | 'total_sessions'>
        Update: Partial<Database['public']['Tables']['professional_profiles']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          professional_id: string
          scheduled_at: string
          duration_min: number
          status: AppointmentStatus
          video_room_url: string | null
          video_room_id: string | null
          payment_intent_id: string | null
          amount_paid: number
          platform_fee: number
          professional_amount: number
          notes_patient: string | null
          notes_professional: string | null
          rating: number | null
          review_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      patient_badges: {
        Row: {
          id: string
          patient_id: string
          badge_key: string
          earned_at: string
        }
        Insert: Omit<Database['public']['Tables']['patient_badges']['Row'], 'id' | 'earned_at'>
        Update: never
      }
      check_ins: {
        Row: {
          id: string
          patient_id: string
          mood_score: number
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['check_ins']['Row'], 'id' | 'created_at'>
        Update: never
      }
      reviews: {
        Row: {
          id: string
          appointment_id: string
          patient_id: string
          professional_id: string
          rating: number
          text: string | null
          is_public: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
    }
      platform_settings: {
        Row: {
          id: string
          key: string
          value: string | null
          description: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['platform_settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['platform_settings']['Insert']>
      }
    Views: {}
    Functions: {}
    Enums: {
      user_role: UserRole
      subscription_plan: SubscriptionPlan
      appointment_status: AppointmentStatus
      professional_tier: ProfessionalTier
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type ProfessionalProfile = Database['public']['Tables']['professional_profiles']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type CheckIn = Database['public']['Tables']['check_ins']['Row']

export type ProfessionalWithProfile = User & { professional_profiles: ProfessionalProfile }

