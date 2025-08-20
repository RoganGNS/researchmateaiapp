//File: /lib/supabase/browser.ts
// ============================================================================
// Enhanced Browser Supabase Client with Security Features
// ============================================================================

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import type { Database } from '../../types/database';

let browserClient: ReturnType<typeof createSupabaseBrowserClient<Database>> | null = null;

/**
 * Creates a Supabase client for browser-side operations
 * Singleton pattern with enhanced security and monitoring
 */
export function createBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'researchmate-auth',
        flowType: 'pkce', // Use PKCE flow for enhanced security
      },
      global: {
        headers: {
          'x-application-name': 'ResearchMateAI',
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  );

  // Add auth state change listener for monitoring
  if (typeof window !== 'undefined') {
    browserClient.auth.onAuthStateChange((event, session) => {
      // Track auth events for security monitoring
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated:', session?.user?.email);
      }
    });
  }

  return browserClient;
}

/**
 * Clear the browser client instance
 * Useful for testing or when switching environments
 */
export function clearBrowserClient() {
  browserClient = null;
}