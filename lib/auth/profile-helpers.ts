//File: /lib/auth/profile-helpers.ts
// ============================================================================
// Profile Helper Functions for Consistent Profile Management
// ============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import type { UserProfile } from '../../types/profiles';

/**
 * User metadata type from Supabase auth
 */
interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  preferred_language?: string;
  [key: string]: string | undefined;
}

/**
 * Profile update input type
 */
interface ProfileUpdateInput {
  full_name?: string | null;
  avatar_url?: string | null;
  organization?: string | null;
  role?: 'user' | 'admin' | 'moderator';
  newsletter_subscription?: boolean;
}

/**
 * Generate a unique referral code
 */
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RM-';
  
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return code;
}

/**
 * Safely fetch user profile with error handling
 */
export async function fetchUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserProfile | null> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1);
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return profiles && profiles.length > 0 ? (profiles[0] as UserProfile) : null;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

/**
 * Create initial user profile with retry for race conditions
 */
export async function createInitialProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  email: string,
  metadata?: UserMetadata
): Promise<UserProfile | null> {
  try {
    const initialProfile = {
      id: userId,
      email: email || '',
      full_name: metadata?.full_name || null,
      avatar_url: metadata?.avatar_url || null,
      organization: null,
      role: 'user' as const,
      newsletter_subscription: false,
      referral_code: generateReferralCode(),
      terms_accepted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(initialProfile)
      .select()
      .limit(1);
    
    if (error) {
      // Handle duplicate key error (profile already exists)
      if (error.code === '23505') {
        return fetchUserProfile(supabase, userId);
      }
      console.error('Error creating profile:', error);
      return null;
    }
    
    return data && data.length > 0 ? (data[0] as UserProfile) : null;
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return null;
  }
}

/**
 * Ensure user has a profile (fetch or create)
 */
export async function ensureUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  email: string,
  metadata?: UserMetadata
): Promise<UserProfile | null> {
  // Try to fetch existing profile first
  const existingProfile = await fetchUserProfile(supabase, userId);
  if (existingProfile) {
    return existingProfile;
  }
  
  // Create new profile if doesn't exist
  return createInitialProfile(supabase, userId, email, metadata);
}

/**
 * Check if profile is complete
 */
export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;
  
  return !!(
    profile.full_name && 
    profile.full_name.trim() !== '' &&
    profile.terms_accepted_at
  );
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .limit(1);
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data && data.length > 0 ? (data[0] as UserProfile) : null;
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return null;
  }
}

/**
 * Sanitize profile data for security
 */
export function sanitizeProfile(profile: ProfileUpdateInput): Partial<UserProfile> {
  const sanitized: Partial<UserProfile> = {};
  
  // Only copy allowed fields with proper type checking
  if (typeof profile.full_name === 'string' || profile.full_name === null) {
    sanitized.full_name = profile.full_name ? profile.full_name.trim().slice(0, 100) : null;
  }
  
  if (typeof profile.organization === 'string' || profile.organization === null) {
    sanitized.organization = profile.organization ? profile.organization.trim().slice(0, 100) : null;
  }
  
  if (profile.role === 'user' || profile.role === 'admin' || profile.role === 'moderator') {
    sanitized.role = profile.role;
  }
  
  if (typeof profile.newsletter_subscription === 'boolean') {
    sanitized.newsletter_subscription = profile.newsletter_subscription;
  }
  
  if (typeof profile.avatar_url === 'string' || profile.avatar_url === null) {
    if (profile.avatar_url) {
      // Validate URL
      try {
        const url = new URL(profile.avatar_url);
        if (['http:', 'https:'].includes(url.protocol)) {
          sanitized.avatar_url = profile.avatar_url;
        }
      } catch {
        // Invalid URL, don't include
      }
    } else {
      sanitized.avatar_url = null;
    }
  }
  
  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get display name from profile
 */
export function getDisplayName(profile: UserProfile | null, email?: string): string {
  if (profile?.full_name) {
    return profile.full_name;
  }
  if (email) {
    return email.split('@')[0];
  }
  return 'User';
}