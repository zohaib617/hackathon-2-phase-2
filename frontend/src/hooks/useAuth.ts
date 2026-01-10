/**
 * Custom React hook for authentication state management.
 *
 * This hook provides access to the current user session,
 * authentication status, and auth methods (login, logout, signup).
 */

"use client";

import { useEffect, useState } from "react";
import { authClient, type Session } from "@/lib/auth";

interface UseAuthReturn {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: Session["user"] | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Hook to manage authentication state and operations.
 *
 * @returns Authentication state and methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, signIn, signOut } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={signIn} />;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user?.name}</p>
 *       <button onClick={signOut}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch and update the current session.
   */
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const { data } = await authClient.getSession();
      setSession(data);
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign in with email and password.
   */
  const signIn = async (email: string, password: string) => {
    try {
      await authClient.signIn.email({
        email,
        password,
      });
      await refreshSession();
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  };

  /**
   * Sign up with email, password, and name.
   */
  const signUp = async (email: string, password: string, name: string) => {
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });
      await refreshSession();
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };

  /**
   * Sign out the current user.
   */
  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  };

  // Fetch session on mount
  useEffect(() => {
    refreshSession();
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated: !!session?.user,
    user: session?.user || null,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };
}
