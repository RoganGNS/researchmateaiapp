// File: /lib/routes.ts
// ============================================================================
// Centralized Route Constants and Navigation Utilities
// ============================================================================

/**
 * Application route definitions
 * Centralized to prevent hardcoded strings throughout the app
 */
export const ROUTES = {
  // Marketing/Public routes
  HOME: '/',
  ABOUT: '/about',
  PRICING: '/pricing',
  FEATURES: '/features',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout',
  ONBOARDING: '/onboarding',
  
  // App routes (protected) - 注意：没有APP_HOME，dashboard是登录后主页
  DASHBOARD: '/app/dashboard',
  PROJECTS: '/app/projects',
  PROJECT_NEW: '/app/projects/new',
  PROJECT_DETAIL: (id: string) => `/app/projects/${id}` as const,
  LIBRARY: '/app/library',
  DOCUMENTS: '/app/documents',
  UPLOAD: '/app/upload',
  SEARCH: '/app/search',
  CITATIONS: '/app/citations',
  ANALYTICS: '/app/analytics',
  COLLABORATE: '/app/collaborate',
  SETTINGS: '/app/settings',
  PROFILE: '/app/profile',
  
  // Settings sub-routes
  SETTINGS_GENERAL: '/app/settings/general',
  SETTINGS_SECURITY: '/app/settings/security',
  SETTINGS_NOTIFICATIONS: '/app/settings/notifications',
  SETTINGS_BILLING: '/app/settings/billing',
  SETTINGS_API: '/app/settings/api',
  
  // Help routes
  HELP: '/help',
  DOCS: '/docs',
  SUPPORT: '/support',
  
  // Legal routes
  TERMS: '/terms',
  PRIVACY: '/privacy',
  COOKIES: '/cookies',
} as const;

/**
 * Route groups for navigation organization
 */
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.PRICING,
    ROUTES.FEATURES,
  ],
  AUTH: [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
  ],
  MAIN_NAV: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'Home' },
    { name: 'Projects', href: ROUTES.PROJECTS, icon: 'FolderOpen' },
    { name: 'Library', href: ROUTES.LIBRARY, icon: 'BookOpen' },
    { name: 'Search', href: ROUTES.SEARCH, icon: 'Search' },
    { name: 'Upload', href: ROUTES.UPLOAD, icon: 'Upload' },
  ],
  SETTINGS: [
    { name: 'General', href: ROUTES.SETTINGS_GENERAL },
    { name: 'Security', href: ROUTES.SETTINGS_SECURITY },
    { name: 'Notifications', href: ROUTES.SETTINGS_NOTIFICATIONS },
    { name: 'Billing', href: ROUTES.SETTINGS_BILLING },
    { name: 'API Keys', href: ROUTES.SETTINGS_API },
  ],
} as const;

/**
 * Check if a route is active based on current pathname
 * @param pathname - Current pathname from Next.js
 * @param route - Route to check against
 * @param exact - Whether to match exactly or allow sub-routes
 */
export function isRouteActive(
  pathname: string,
  route: string,
  exact = false
): boolean {
  if (exact) {
    return pathname === route;
  }
  
  // Special handling for dashboard
  if (route === ROUTES.DASHBOARD) {
    return pathname === route;
  }
  
  // For other routes, check if pathname starts with route
  return pathname.startsWith(route);
}

/**
 * Get breadcrumb items from pathname
 * @param pathname - Current pathname
 */
export function getBreadcrumbs(pathname: string): Array<{ name: string; href: string }> {
  const breadcrumbs: Array<{ name: string; href: string }> = [];
  
  // Always start with dashboard for app routes
  if (pathname.startsWith('/app')) {
    breadcrumbs.push({ name: 'Dashboard', href: ROUTES.DASHBOARD });
  }
  
  // Parse pathname segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumb trail
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip 'app' segment
    if (segment === 'app' && index === 0) return;
    
    // Format segment name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Don't duplicate dashboard
    if (currentPath === ROUTES.DASHBOARD && breadcrumbs.length > 0) return;
    
    // Special handling for project details
    if (segments[index - 1] === 'projects' && segment !== 'new') {
      breadcrumbs.push({ name: 'Project Canvas', href: currentPath });
    } else {
      breadcrumbs.push({ name, href: currentPath });
    }
  });
  
  return breadcrumbs;
}

/**
 * Route guards - Define which routes require authentication
 */
export const PROTECTED_ROUTES = [
  '/app',
  '/profile',
  '/settings',
] as const;

/**
 * Routes that should redirect if user is already authenticated
 */
export const AUTH_REDIRECT_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
] as const;

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a route should redirect when authenticated
 */
export function shouldRedirectWhenAuthenticated(pathname: string): boolean {
  return AUTH_REDIRECT_ROUTES.some(route => route === pathname);
}

/**
 * Get the appropriate redirect URL after login
 * Always redirects to dashboard as it's the main hub
 */
export function getPostLoginRedirect(from?: string | null): string {
  if (!from) return ROUTES.DASHBOARD;
  
  // Don't redirect back to auth pages
  if (shouldRedirectWhenAuthenticated(from)) {
    return ROUTES.DASHBOARD;
  }
  
  // Only redirect to protected routes if they're valid
  if (isProtectedRoute(from) && from !== '/app') {
    return from;
  }
  
  return ROUTES.DASHBOARD;
}