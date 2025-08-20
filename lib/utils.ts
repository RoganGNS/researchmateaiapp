// File: /lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for optimal className handling
 * Prevents Tailwind class conflicts and allows conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Check if code is running on the server
 */
export const isServer = typeof window === 'undefined'

/**
 * Safe localStorage access that handles SSR
 */
export const storage = {
  get: (key: string) => {
    if (isServer) return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set: (key: string, value: string) => {
    if (isServer) return
    try {
      localStorage.setItem(key, value)
    } catch {
      console.error('Failed to set localStorage item:', key)
    }
  },
  remove: (key: string) => {
    if (isServer) return
    try {
      localStorage.removeItem(key)
    } catch {
      console.error('Failed to remove localStorage item:', key)
    }
  },
}