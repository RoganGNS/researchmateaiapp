// File: /app/(auth)/layout.tsx
// ============================================================================
// Auth Layout - 认证页面布局
// ============================================================================

import { redirect } from 'next/navigation';
import { createServerClient } from '../../lib/supabase/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 检查用户是否已登录
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 如果已登录，重定向到 dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}