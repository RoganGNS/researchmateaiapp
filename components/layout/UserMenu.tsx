// File: /components/layout/UserMenu.tsx
// ============================================================================
// Enhanced User Menu Component with Complete Features
// ============================================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Next.js Image component
import { User, Settings, LogOut, HelpCircle, Moon, Sun, Shield, Bell } from 'lucide-react';
import { createBrowserClient } from '../../lib/supabase/browser';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfile } from '../../types/profiles';

interface UserMenuProps {
  user: SupabaseUser;
  profile?: UserProfile | null;
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check dark mode on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createBrowserClient();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Optionally show an error message to the user
        return;
      }

      // Clear any local storage
      localStorage.removeItem('rememberMe');
      
      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const userEmail = user.email || 'User';
  const userName = profile?.full_name || userEmail.split('@')[0];
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <span className="sr-only">Open user menu</span>
        {profile && profile.avatar_url ? (
          <Image
            className="h-8 w-8 rounded-full object-cover"
            src={profile.avatar_url}
            alt={userName}
            width={32} // Required for Next.js Image
            height={32} // Required for Next.js Image
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            {userInitials}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          {/* User info section */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userEmail}
            </p>
            {profile?.organization && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {profile.organization}
              </p>
            )}
          </div>
          
          {/* Menu items */}
          <div className="py-1">
            <a
              href="/profile"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Your Profile
            </a>
            
            <a
              href="/settings"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Settings
            </a>

            <a
              href="/settings/notifications"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Notifications
            </a>

            <a
              href="/settings/security"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Shield className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Security & Privacy
            </a>
          </div>

          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleDarkMode}
              className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <>
                  <Sun className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                  Dark Mode
                </>
              )}
            </button>
            
            <a
              href="/help"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HelpCircle className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Help & Support
            </a>
          </div>
          
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              {isLoading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
