// File: /app/layout.tsx
// ============================================================================
// 修复 Hydration 错误 - 添加 suppressHydrationWarning 到 body
// ============================================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'ResearchMateAI - Intelligent Research Companion',
    template: '%s | ResearchMateAI'
  },
  description: 'Your intelligent research companion. Upload documents, search through content, and collaborate on research projects with AI-powered assistance.',
  keywords: ['research', 'AI', 'document analysis', 'collaboration', 'academic'],
  authors: [{ name: 'ResearchMateAI Team' }],
  creator: 'ResearchMateAI',
  publisher: 'ResearchMateAI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'ResearchMateAI',
    description: 'Your intelligent research companion',
    url: 'https://researchmateai.com',
    siteName: 'ResearchMateAI',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResearchMateAI',
    description: 'Your intelligent research companion',
    creator: '@researchmateai',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head />
      <body 
        className="font-sans antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
        suppressHydrationWarning
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        
        {/* Main application content */}
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
