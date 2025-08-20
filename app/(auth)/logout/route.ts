// File: /app/(auth)/logout/route.ts
// ============================================================================
// Logout API Route - 登出处理
// ============================================================================

import { NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';

/**
 * POST /auth/logout
 * Clears the user session and redirects to home
 */
export async function POST() {
  const supabase = await createServerClient();
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Redirect to home page
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}