// File: /types/auth.ts
// ============================================================================
// Authentication Types (Fixed)
// ============================================================================

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'EMAIL_NOT_CONFIRMED' | 'USER_LOCKED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: Record<string, unknown>;
}

export interface AuthResponse<T = unknown> {
  data?: T;
  error?: AuthError;
}

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  app_metadata: {
    provider?: string;
    providers?: string[];
    [key: string]: unknown;
  };
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  refresh_token: string;
  user: User;
}