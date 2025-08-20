// File: /components/ui/ThemeToggle.tsx
'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

/**
 * Theme toggle component with system preference support
 * Persists preference to localStorage and respects system settings
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>('system')
  const [mounted, setMounted] = React.useState(false)

  // Handle mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  // Apply theme changes
  React.useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      root.style.colorScheme = systemTheme
    } else {
      root.classList.add(theme)
      root.style.colorScheme = theme
    }

    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  // Listen for system theme changes
  React.useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(mediaQuery.matches ? 'dark' : 'light')
        root.style.colorScheme = mediaQuery.matches ? 'dark' : 'light'
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  if (!mounted) {
    return (
      <button
        className={`relative h-9 w-9 rounded-md p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50 transition-colors ${className}`}
        disabled
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    )
  }

  const Icon = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) 
    ? Moon 
    : Sun

  return (
    <button
      onClick={cycleTheme}
      className={`relative h-9 w-9 rounded-md p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50 transition-colors ${className}`}
      aria-label={`Toggle theme (current: ${theme})`}
      aria-live="polite"
    >
      <Icon className="h-5 w-5 transition-all" />
      <span className="sr-only">
        Current theme: {theme}. Click to change.
      </span>
    </button>
  )
}