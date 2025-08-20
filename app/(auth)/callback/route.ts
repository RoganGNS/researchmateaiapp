//File: /app/(auth)/callback/route.ts
// ============================================================================
// Auth Callback Route Handler - 只检查profile，不创建
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';
import { ROUTES } from '../../../lib/routes';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || ROUTES.DASHBOARD;
  const error = requestUrl.searchParams.get('error');
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(
      new URL(`${ROUTES.LOGIN}?error=${encodeURIComponent(error)}`, request.url)
    );
  }
  
  if (code) {
    const supabase = await createServerClient();
    
    try {
      // Exchange code for session
      const { data: { session }, error: sessionError } = 
        await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        return NextResponse.redirect(
          new URL(`${ROUTES.LOGIN}?error=auth_failed`, request.url)
        );
      }
      
      if (session?.user) {
        // 只检查profile是否存在，不创建
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .maybeSingle();
        
        // 如果没有profile或profile不完整，重定向到onboarding
        if (!profile || !profile.full_name || profile.full_name.trim() === '') {
          return NextResponse.redirect(new URL(ROUTES.ONBOARDING, request.url));
        }
        
        // Profile完整，重定向到目标页面
        return NextResponse.redirect(new URL(next, request.url));
      }
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect(
        new URL(`${ROUTES.LOGIN}?error=unexpected`, request.url)
      );
    }
  }
  
  // No code present, redirect to login
  return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
}