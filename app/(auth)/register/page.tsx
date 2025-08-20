// File: /app/(auth)/register/page.tsx
// ============================================================================
// Enterprise Registration Page with Extended User Information
// ============================================================================

'use client';

import { useState } from 'react'; // CORRECTED: Removed unused 'useEffect'
// CORRECTED: Removed unused 'useRouter'
import Link from 'next/link';
import { z } from 'zod';
import { createBrowserClient } from '../../../lib/supabase/browser';
import { AuthForm, RegisterFormData } from '../../../components/auth/AuthForm';
import { Alert } from '../../../components/ui/Alert';

// Enhanced validation schema with all fields
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organization: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  subscribeToNewsletter: z.boolean().optional(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  // CORRECTED: Removed unused 'router' variable
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setFormErrors({});

    try {
      const validatedData = registerSchema.parse(data);
      const supabase = createBrowserClient();
      
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', validatedData.email)
        .single();
      
      if (existingUser) {
        setFormErrors({ email: 'This email is already registered' });
        setIsLoading(false);
        return;
      }
      
      const { error: signUpError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: validatedData.fullName,
            organization: validatedData.organization,
            subscribe_newsletter: validatedData.subscribeToNewsletter,
            referral_code: validatedData.referralCode,
            registration_source: 'web',
            registration_timestamp: new Date().toISOString(),
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setFormErrors({ email: 'This email is already registered. Please sign in instead.' });
        } else if (signUpError.message.includes('weak password')) {
          setFormErrors({ password: 'Password is too weak. Please choose a stronger password.' });
        } else if (signUpError.message.includes('rate limit')) {
          setError('Too many registration attempts. Please try again later.');
        } else {
          setError('An error occurred during registration. Please try again.');
          console.error('Registration error:', signUpError);
        }
        setIsLoading(false);
        return;
      }

      if (validatedData.referralCode) {
        await supabase.from('referrals').insert({
          referral_code: validatedData.referralCode,
          referred_email: validatedData.email,
          created_at: new Date().toISOString(),
        });
      }

      setSuccess(true);
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

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Registration Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {"We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account."}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {"Didn't receive the email? Check your spam folder or contact support."}
          </p>
          <div className="mt-6 space-y-2">
            <Link
              href="/login"
              className="block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              Return to login
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              Resend verification email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create a new account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link 
            href="/login" 
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        isLoading={isLoading}
        errors={formErrors}
        termsUrl="/terms"
        privacyUrl="/privacy"
        requireOrganization={false}
        showSocialAuth={true}
      />
    </div>
  );
}
