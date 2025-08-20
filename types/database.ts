//File: /types/database.ts
// ============================================================================
// Database Types Definition for Type Safety
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          organization: string | null
          role: 'user' | 'admin' | 'moderator'
          newsletter_subscription: boolean
          referral_code: string | null
          terms_accepted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          organization?: string | null
          role?: 'user' | 'admin' | 'moderator'
          newsletter_subscription?: boolean
          referral_code?: string | null
          terms_accepted_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          organization?: string | null
          role?: 'user' | 'admin' | 'moderator'
          newsletter_subscription?: boolean
          referral_code?: string | null
          terms_accepted_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      login_events: {
        Row: {
          id: string
          user_id: string
          source: 'direct' | 'redirect' | 'session-expired'
          ip_address: string | null
          user_agent: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          source: 'direct' | 'redirect' | 'session-expired'
          ip_address?: string | null
          user_agent?: string | null
          timestamp: string
        }
        Update: {
          id?: string
          user_id?: string
          source?: 'direct' | 'redirect' | 'session-expired'
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string
        }
      }
      mfa_settings: {
        Row: {
          id: string
          user_id: string
          enabled: boolean
          secret: string | null
          backup_codes: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          enabled?: boolean
          secret?: string | null
          backup_codes?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          enabled?: boolean
          secret?: string | null
          backup_codes?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referral_code: string
          referrer_id: string | null
          referred_email: string
          status: 'pending' | 'completed' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          referral_code: string
          referrer_id?: string | null
          referred_email: string
          status?: 'pending' | 'completed' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          referral_code?: string
          referrer_id?: string | null
          referred_email?: string
          status?: 'pending' | 'completed' | 'expired'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin' | 'moderator'
      login_source: 'direct' | 'redirect' | 'session-expired'
      referral_status: 'pending' | 'completed' | 'expired'
    }
  }
}
