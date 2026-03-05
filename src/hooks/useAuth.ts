'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Authentication Hook
 *
 * Manages admin user authentication state and provides login/logout functions.
 * Uses Supabase Auth for secure authentication.
 */

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; data?: { user?: User; session?: Session | null } }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

/**
 * Check if user is an admin based on email domain or custom claims
 */
function isAdminUser(user: User | null): boolean {
  if (!user?.email) return false;

  // Check for specific admin email domain
  // In production, use custom claims or a separate admin_users table
  const adminDomains = ['pike2thepolls.com', 'trustee.pike.in.gov'];
  const emailDomain = user.email.split('@')[1]?.toLowerCase();

  return adminDomains.includes(emailDomain || '');
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    error: null,
  });

  // Clear error function
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Initialize auth state from current session
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (mounted) {
          const user = session?.user ?? null;
          const isAdmin = isAdminUser(user);

          setState({
            user,
            session,
            isLoading: false,
            isAuthenticated: !!session,
            isAdmin,
            error: error?.message ?? null,
          });
        }
      } catch (err) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to initialize authentication',
          }));
        }
      }
    }

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        const user = session?.user ?? null;
        const isAdmin = isAdminUser(user);

        setState({
          user,
          session,
          isLoading: false,
          isAuthenticated: !!session,
          isAdmin,
          error: null,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
        return { error };
      }

      const user = data.user ?? null;
      const isAdmin = isAdminUser(user);

      setState({
        user,
        session: data.session ?? null,
        isLoading: false,
        isAuthenticated: !!data.session,
        isAdmin,
        error: null,
      });

      return { error: null, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { error: { message: errorMessage, name: 'AuthError' } as AuthError };
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await supabase.auth.signOut();

      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  return {
    ...state,
    signIn,
    signOut,
    clearError,
  };
}
