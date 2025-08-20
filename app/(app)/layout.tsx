//File: /app/(app)/layout.tsx
// ============================================================================
// Simplified Application Layout - 不再检查Profile
// ============================================================================

import { redirect } from 'next/navigation';
import { createServerClient } from '../../lib/supabase/server';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppNav } from '../../components/nav/AppNav';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ROUTES } from '../../lib/routes';

/**
 * Server Component layout for authenticated application pages
 * 注意：Profile检查已经在middleware中完成，这里只负责渲染
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  
  // 获取用户和profile - middleware已经保证了这些数据的有效性
  const { data: { user } } = await supabase.auth.getUser();
  
  // 如果没有user，说明middleware有问题，重定向到登录
  if (!user) {
    redirect(ROUTES.LOGIN);
  }
  
  // 获取完整的profile数据用于显示
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  // 这时profile应该是完整的，因为middleware已经检查过
  if (!profile) {
    // 如果还是没有，说明数据有问题，重定向到onboarding
    redirect(ROUTES.ONBOARDING);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AppNav />
        
        <div className="flex-1 flex flex-col">
          <AppHeader user={user} profile={profile} />
          
          <main 
            id="main-content"
            className="flex-1 p-6 overflow-auto"
            role="main"
            aria-label="Main application content"
          >
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}