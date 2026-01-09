/**
 * Authentication wrapper component for TodoApp.
 *
 * This component protects routes that require authentication
 * and handles redirect logic for unauthenticated users.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import Spinner from "@/components/ui/Spinner";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, only authenticated users can access
  redirectTo?: string; // Where to redirect if not authorized
  fallback?: React.ReactNode; // What to show while checking auth status
}

export default function AuthWrapper({
  children,
  requireAuth = true,
  redirectTo = "/login",
  fallback = <Spinner fullScreen />,
}: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.replace(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // If this is a public route but user is logged in, redirect to dashboard
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // Show fallback while checking auth status
  if (isLoading) {
    return fallback;
  }

  // If auth requirement isn't met, don't render children
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null;
  }

  return <>{children}</>;
}