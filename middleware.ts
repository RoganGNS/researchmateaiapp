// File: /middleware.ts
// ============================================================================
// Next 15 + Supabase SSR Middleware (final)
// - Correct cookie adapter (response-only)
// - Centralized auth + profile completeness checks
// - Anti "onboarding <-> dashboard" redirect loop
// - Basic in-memory rate limiting
// - Security headers on both pass-through and redirects
// ============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// In-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function middleware(request: NextRequest) {
  // Create a writable response and forward original request headers
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ---------------- Rate limiting ----------------
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const rateLimitWindow = 60_000; // 1 minute
  const maxRequests = 100; // per window

  const entry = rateLimitMap.get(ip);
  if (entry) {
    if (now < entry.resetTime) {
      if (entry.count >= maxRequests) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
      entry.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + rateLimitWindow });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + rateLimitWindow });
  }

  // ---------------- Supabase client ----------------
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          // IMPORTANT: write only to the RESPONSE cookies
          for (const { name, value, options } of cookies) {
            response.cookies.set(name, value, {
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
            });
          }
        },
      },
    }
  );

  // ---------------- User session ----------------
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // ---------------- Path flags ----------------
  const pathname = request.nextUrl.pathname;

  const isAuthPath =
    pathname.startsWith('/login') || pathname.startsWith('/register');

  const isOnboardingPath = pathname === '/onboarding';

  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/library') ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/profile');

  // ---------------- Helpers ----------------
  const withSecurityHeaders = (res: NextResponse) => {
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
      res.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';"
      );
      res.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      );
    }
    return res;
  };

  const redirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return withSecurityHeaders(redirectResponse);
  };

  // ---------------- Session error handling ----------------
  if (error && typeof error.message === 'string') {
    // Most common: refresh_token_not_found → force login
    if (error.message.includes('refresh_token_not_found')) {
      const url = new URL('/login', request.url);
      url.searchParams.set('expired', 'true');
      url.searchParams.set('redirectTo', pathname);
      return redirectWithCookies(url);
    }
  }

  // ---------------- Unauthenticated flow ----------------
  if (!user) {
    // Allow auth pages without redirect
    if (isAuthPath) return withSecurityHeaders(response);

    // Gate protected + onboarding pages
    if (isProtectedPath || isOnboardingPath) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirectTo', pathname);
      return redirectWithCookies(url);
    }

    // Public pages pass through
    return withSecurityHeaders(response);
  }

  // ---------------- Authenticated flow ----------------

  // Avoid ping-pong: only check profile status for protected routes or onboarding
  if (isProtectedPath || isOnboardingPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', user.id)
      .maybeSingle();

    const hasCompleteProfile =
      !!profile && !!profile.full_name && profile.full_name.trim() !== '';

    // 1) If user is on /onboarding:
    //    - Incomplete → ALWAYS allow staying on onboarding (no redirect)
    //    - Complete   → send to /dashboard
    if (isOnboardingPath) {
      if (!hasCompleteProfile) {
        // IMPORTANT: Let onboarding render, do not redirect.
        return withSecurityHeaders(response);
      }
      // Complete profile but still on onboarding → go dashboard
      return redirectWithCookies(new URL('/dashboard', request.url));
    }

    // 2) If user is on a protected path but profile is incomplete → send to onboarding
    if (isProtectedPath && !hasCompleteProfile) {
      return redirectWithCookies(new URL('/onboarding', request.url));
    }
  }

  // Authenticated user visiting /login or /register → go dashboard
  if (isAuthPath) {
    return redirectWithCookies(new URL('/dashboard', request.url));
  }

  // ---------------- Pass-through ----------------
  return withSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Skip Next.js internals, images and static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
