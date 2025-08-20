// File: /app/(auth)/login/page.tsx
// ============================================================================
// Enterprise Login Page with MFA and Enhanced Security
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { createBrowserClient } from '../../../lib/supabase/browser';
import { AuthForm, LoginFormData } from '../../../components/auth/AuthForm';
import { Alert } from '../../../components/ui/Alert';

// Enhanced validation schema with MFA support
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
  mfaCode: z.string().optional(),
  loginSource: z.enum(['direct', 'redirect', 'session-expired']).optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requireMFA, setRequireMFA] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const sessionExpired = searchParams.get('expired') === 'true';

  // Redirect if already logged in
  useEffect(() => {
    const supabase = createBrowserClient();
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(redirectTo);
      }
    };
    checkAuth();
  }, [router, redirectTo]);
  
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setFormErrors({});

    try {
      const validatedData = loginSchema.parse(data);
      const supabase = createBrowserClient();
      
      if (requireMFA && !validatedData.mfaCode) {
        setFormErrors({ mfaCode: 'MFA code is required' });
        setIsLoading(false);
        return;
      }
      
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email address before logging in. Check your inbox for the verification link.');
        } else if (signInError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes before trying again.');
        } else if (signInError.message.includes('MFA')) {
          setRequireMFA(true);
          setError('Please enter your two-factor authentication code');
          setIsLoading(false);
          return;
        } else {
          setError('An error occurred during login. Please try again.');
          console.error('Login error:', signInError);
        }
        setIsLoading(false);
        return;
      }

      if (requireMFA && validatedData.mfaCode) {
        const { error: mfaError } = await supabase.auth.verifyOtp({
          email: validatedData.email,
          token: validatedData.mfaCode,
          type: 'email',
        });

        if (mfaError) {
          setFormErrors({ mfaCode: 'Invalid authentication code' });
          setIsLoading(false);
          return;
        }
      }

      if (validatedData.rememberMe) {
        document.cookie = `rememberMe=true; max-age=${30 * 24 * 60 * 60}; path=/; secure; samesite=strict`;
      }

      if (validatedData.loginSource && authData.user) {
        await supabase.from('login_events').insert({
          user_id: authData.user.id,
          source: validatedData.loginSource,
          timestamp: new Date().toISOString(),
        });
      }

      // ---- NEW: 同步 session 到服务端 Cookie ----
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token && session?.refresh_token) {
        await fetch('/auth/set', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });
      }

      // 跳转到目标页
      router.replace(redirectTo);

    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            errors[path.toString()] = issue.message;
          }
        });
        setFormErrors(errors);
      } else {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Unexpected error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link 
            href="/register" 
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            create a new account
          </Link>
        </p>
      </div>

      {sessionExpired && (
        <Alert type="warning" className="mb-4">
          Your session has expired. Please sign in again to continue.
        </Alert>
      )}

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        isLoading={isLoading}
        errors={formErrors}
        showRememberMe={true}
        requireMFA={requireMFA}
        showSocialAuth={true}
      />

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Forgot your password?
        </Link>
        <Link
          href="/help"
          className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          Need help?
        </Link>
      </div>
    </div>
  );
}
