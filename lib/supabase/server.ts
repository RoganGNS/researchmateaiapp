//File: /lib/supabase/server.ts
// ============================================================================
// Enhanced Server Supabase Client with Security Features
// ============================================================================

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../../types/database';

/**
 * Creates a Supabase client for server-side operations
 * Enhanced with security features and proper cookie handling
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
              });
            });
          } catch (error) {
            // Handle cookie setting errors in Server Components
            console.error('Error setting cookies:', error);
          }
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // Disabled for server-side
      },
      global: {
        headers: {
          'x-application-name': 'ResearchMateAI-Server',
        },
      },
    }
  );
}

/**
 * Creates an admin Supabase client with service role key
 * Use with caution - only for server-side admin operations
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
              });
            });
          } catch (error) {
            console.error('Error setting cookies:', error);
          }
        },
      },
      auth: {
        persistSession: false, // Admin client doesn't need session persistence
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'x-application-name': 'ResearchMateAI-Admin',
        },
      },
    }
  );
}