//File: /app/(auth)/onboarding/page.tsx
// ============================================================================
// Onboarding Page with Debug Logging
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '../../../lib/supabase/browser';
import { ROUTES } from '../../../lib/routes';
import { Card } from '../../../components/ui/Card';
import { Alert } from '../../../components/ui/Alert';
import { Sparkles, User, Building, ArrowRight, Loader2 } from 'lucide-react';
import { generateReferralCode } from '../../../lib/auth/profile-helpers';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
  });

  useEffect(() => {
    console.log('[Onboarding] useEffect running');
    
    const checkProfile = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        console.log('[Onboarding] User check:', user?.id);

        if (!user) {
          console.log('[Onboarding] No user, redirecting to login');
          router.push(ROUTES.LOGIN);
          return;
        }

        // 检查profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        console.log('[Onboarding] Profile check:', { profile, profileError });

        if (profileError) {
          console.error('[Onboarding] Profile error:', profileError);
          setIsChecking(false);
          return;
        }

        // 检查full_name字段
        console.log('[Onboarding] Full name value:', {
          fullName: profile?.full_name,
          trimmed: profile?.full_name?.trim(),
          isEmpty: !profile?.full_name || profile.full_name.trim() === ''
        });

        // 如果有profile但不完整，预填充
        if (profile) {
          console.log('[Onboarding] Profile exists but incomplete, pre-filling form');
          setFormData({
            fullName: profile.full_name || '',
            organization: profile.organization || '',
          });
        }

        setIsChecking(false);
      } catch (error) {
        console.error('[Onboarding] Error in checkProfile:', error);
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[Onboarding] Form submit, data:', formData);
    
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('No authenticated user found');
        setIsLoading(false);
        return;
      }

      // 先检查是否已有profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      console.log('[Onboarding] Existing profile check:', existingProfile);

      let result;
      if (existingProfile) {
        // 更新
        console.log('[Onboarding] Updating existing profile');
        result = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName.trim(),
            organization: formData.organization.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } else {
        // 创建
        console.log('[Onboarding] Creating new profile');
        result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: formData.fullName.trim(),
            organization: formData.organization.trim() || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            role: 'user' as const,
            referral_code: generateReferralCode(),
            terms_accepted_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }

      console.log('[Onboarding] Operation result:', result);

      if (result.error) {
        console.error('[Onboarding] Database error:', result.error);
        setError('Failed to save profile');
        setIsLoading(false);
        return;
      }

      // 成功后跳转
      console.log('[Onboarding] Success, redirecting to dashboard');
      router.push(ROUTES.DASHBOARD);
      
    } catch (err) {
      console.error('[Onboarding] Submit error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(null);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to ResearchMateAI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let&apos;s set up your profile to get started
          </p>
        </div>

        <Card className="p-8">
          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-md leading-5 bg-white dark:bg-gray-700 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="organization" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Organization / Institution (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  maxLength={100}
                  value={formData.organization}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-md leading-5 bg-white dark:bg-gray-700 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="University of Example"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.fullName.trim()}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white 
                       bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-indigo-500
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your workspace...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          By continuing, you agree to our{' '}
          <Link href={ROUTES.TERMS} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href={ROUTES.PRIVACY} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}