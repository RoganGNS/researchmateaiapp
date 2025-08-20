// File: /app/(marketing)/layout.tsx
// ============================================================================
// Marketing Section Layout - Public Pages
// ============================================================================

import { PublicHeader } from '../../components/layout/PublicHeader';

/**
 * Layout for marketing/public pages
 * Includes public header and main content area
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Public header navigation */}
      <PublicHeader />
      
      {/* Main content area with semantic HTML */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      
      {/* Footer could be added here */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} ResearchMateAI. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}