'use client';

/**
 * Client layout component for TodoApp.
 *
 * Handles client-side functionality like theme management and authentication context.
 */

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to prevent hydration mismatch for theme/dark mode
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={mounted ? '' : 'opacity-0'}>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}