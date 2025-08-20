//File: /types/profiles.ts
// ============================================================================
// Profile Types Definition
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  organization: string | null;
  role: 'user' | 'admin' | 'moderator';
  newsletter_subscription: boolean;
  referral_code: string | null;
  terms_accepted_at: string;
  created_at: string;
  updated_at: string;
}