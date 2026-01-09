'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${
        theme === 'dark'
          ? 'border-gray-700 bg-gray-900/80'
          : 'border-gray-200 bg-white/80'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500" />
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                TodoApp
              </span>
            </button>
          </motion.div>

          {/* Desktop */}
          <div className="hidden items-center space-x-6 md:flex">
            {!user ? (
              <>
                <Button
                  variant={isActive('/login') ? 'secondary' : 'ghost'}
                  className="gap-2"
                  onClick={() => router.push('/login')}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>

                <Button
                  variant={isActive('/signup') ? 'secondary' : 'primary'}
                  className="gap-2"
                  onClick={() => router.push('/signup')}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>

                <ThemeToggle />
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>

                <Button
                  variant={isActive('/tasks') ? 'secondary' : 'ghost'}
                  onClick={() => router.push('/tasks')}
                >
                  Tasks
                </Button>

                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-medium text-white">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {user.name || user.email}
                  </span>
                </div>

                <ThemeToggle />
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pb-4 md:hidden"
          >
            <div className="flex flex-col space-y-3">
              {!user ? (
                <>
                  <Button
                    variant={isActive('/login') ? 'secondary' : 'outline'}
                    className="justify-start gap-2"
                    onClick={() => router.push('/login')}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>

                  <Button
                    variant={isActive('/signup') ? 'secondary' : 'primary'}
                    className="justify-start gap-2"
                    onClick={() => router.push('/signup')}
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isActive('/dashboard') ? 'secondary' : 'outline'}
                    onClick={() => router.push('/dashboard')}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant={isActive('/tasks') ? 'secondary' : 'outline'}
                    onClick={() => router.push('/tasks')}
                  >
                    Tasks
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
