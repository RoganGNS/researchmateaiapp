// File: /components/ui/SkipToContent.tsx
'use client';

import * as React from 'react';

interface SkipToContentProps {
  mainContentId?: string;
  className?: string;
}

/**
 * Skip to content link for keyboard navigation.
 * Appears on focus to allow users to skip repetitive navigation.
 */
export function SkipToContent({
  mainContentId = 'main-content',
  className = '',
}: SkipToContentProps) {
  const baseClasses =
    'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1080] focus:inline-flex focus:h-10 focus:items-center focus:gap-2 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(mainContentId);
    if (target) {
      target.tabIndex = -1; // allow focusing a div/section
      (target as HTMLElement).focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href={`#${mainContentId}`}
      className={className ? `${baseClasses} ${className}` : baseClasses}
      onClick={handleClick}
    >
      Skip to main content
    </a>
  );
}
