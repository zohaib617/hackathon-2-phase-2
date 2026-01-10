"use client";

import { useEffect, useState } from "react";
import { authClient, type Session } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const { data } = await authClient.getSession();
      setSession(data);
    } catch (error) {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await authClient.signIn.email({ email, password });
      await refreshSession();
      // LOGIN KE BAAD REDIRECT
      router.push("/dashboard"); 
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await authClient.signUp.email({ email, password, name });
      await refreshSession();
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await authClient.signOut();
    setSession(null);
    router.push("/login");
  };

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