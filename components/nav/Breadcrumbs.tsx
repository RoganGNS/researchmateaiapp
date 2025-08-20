// File: /components/nav/Breadcrumbs.tsx
// ============================================================================
// Breadcrumbs Navigation Component
// ============================================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { getBreadcrumbs } from '../../lib/routes';

/**
 * Breadcrumb item interface
 */
interface BreadcrumbItem {
  name: string;
  href: string;
}

/**
 * Breadcrumbs component props
 */
interface BreadcrumbsProps {
  /** Additional items to append to auto-generated breadcrumbs */
  additionalItems?: BreadcrumbItem[];
  /** Whether to show home icon for first item */
  showHomeIcon?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Breadcrumbs Navigation Component
 * 
 * Features:
 * - Auto-generates breadcrumbs from current route
 * - Supports custom additional items
 * - Fully accessible with ARIA labels
 * - Responsive design
 */
export function Breadcrumbs({ 
  additionalItems = [], 
  showHomeIcon = true,
  className = ''
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Get auto-generated breadcrumbs
  const autoBreadcrumbs = getBreadcrumbs(pathname);
  
  // Combine with additional items
  const breadcrumbs = [...autoBreadcrumbs, ...additionalItems];
  
  // Don't show breadcrumbs if only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="h-4 w-4 text-gray-400 mx-2" 
                  aria-hidden="true" 
                />
              )}
              
              {isLast ? (
                <span 
                  className="text-gray-700 dark:text-gray-300 font-medium"
                  aria-current="page"
                >
                  {isFirst && showHomeIcon ? (
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span className="sr-only">{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 
                           dark:hover:text-gray-200 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-indigo-500 rounded"
                >
                  {isFirst && showHomeIcon ? (
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span className="sr-only">{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Page Header with Breadcrumbs
 * Convenience component that combines page title with breadcrumbs
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs,
  actions 
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <Breadcrumbs additionalItems={breadcrumbs} className="mb-2" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}