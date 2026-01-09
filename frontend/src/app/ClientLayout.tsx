'use client';

/**
 * Client layout component for TodoApp.
 *
 * Handles client-side functionality like theme management and authentication context.
 * Conditionally renders navigation based on the route.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to prevent hydration mismatch for theme/dark mode
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Determine if we're on a public page (landing, login, signup)
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={mounted ? '' : 'opacity-0'}>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* For public pages (landing, login, signup) - show top navbar */}
            {isPublicPage ? (
              <div className="flex flex-col h-full w-full">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                  <div className="max-w-7xl mx-auto">
                    {children}
                  </div>
                </main>
              </div>
            ) : (
              /* For authenticated pages (dashboard, tasks, etc.) - show sidebar */
              <div className="flex h-full w-full">
                {/* Mobile sidebar overlay */}
                <AnimatePresence>
                  {sidebarOpen && isMobile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                      />
                      <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl"
                      >
                        <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
                      </motion.aside>
                    </>
                  )}
                </AnimatePresence>

                {/* Desktop sidebar */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                  <Sidebar />
                </aside>

                {/* Mobile menu button */}
                {isMobile && (
                  <div className="fixed top-20 left-4 z-30">
                    <button
                      onClick={toggleSidebar}
                      className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {/* Main content for authenticated pages */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 md:ml-0">
                  <div className="max-w-7xl mx-auto">
                    {children}
                  </div>
                </main>
              </div>
            )}
          </div>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}