'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ThemeToggle';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  LogOut,
  
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const {  } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Create Task', href: '/dashboard', icon: PlusCircle },
  ];

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  // Modern Floating Sidebar Wrapper for Desktop
  const desktopClasses = `
    hidden md:flex flex-col m-4 rounded-2xl 
    bg-white/80 dark:bg-gray-800/80 backdrop-blur-md
    border border-gray-200 dark:border-gray-700 shadow-sm
    h-[calc(100vh-2rem)] sticky top-4
  `;

  // Mobile Sidebar Wrapper
  const mobileClasses = `
    fixed inset-y-0 left-0 z-50 w-72 
    bg-white dark:bg-gray-800 shadow-2xl flex flex-col
  `;

  return isMobile ? (
    <AnimatePresence>
      {isExpanded && (
        <>
          {/* Overlay for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsExpanded(false); if(onClose) onClose(); }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={mobileClasses}
          >
            {renderSidebarContent()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  ) : (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 260 : 88 }}
      className={desktopClasses}
    >
      {renderSidebarContent()}
    </motion.div>
  );

  function renderSidebarContent() {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700/50">
          <motion.div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20" />
            {isExpanded && (
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 truncate">
                TodoApp
              </span>
            )}
          </motion.div>

          {/* Desktop Toggle Button */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => { setIsExpanded(false); if(onClose) onClose(); }}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <motion.div key={item.name} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Button
                  variant={active ? 'secondary' : 'ghost'}
                  className={`w-full group relative ${
                    active 
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' 
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  } ${!isExpanded ? 'justify-center px-0' : 'justify-start px-4'}`}
                  onClick={() => {
                    if (item.name === 'Create Task') {
                      router.push('/dashboard');
                      setTimeout(() => document.getElementById('task-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    } else {
                      router.push(item.href);
                    }
                    if (isMobile) { setIsExpanded(false); if (onClose) onClose(); }
                  }}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {isExpanded && <span className="ml-3 font-medium">{item.name}</span>}
                  
                  {/* Active Indicator Dot */}
                  {active && !isExpanded && (
                    <div className="absolute right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        {user && (
          <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-700/50">
            <div className={`flex items-center gap-3 ${!isExpanded ? 'flex-col' : 'mb-4'}`}>
              <div className="h-10 w-10 shrink-0 rounded-full border-2 border-white dark:border-gray-700 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                {user.name?.charAt(0) || 'U'}
              </div>
              
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-2 mt-2 ${!isExpanded ? 'flex-col' : 'justify-between'}`}>
              <ThemeToggle />
              <Button
                variant="outline"
                size={isExpanded ? "sm" : "icon"}
                className="hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                {isExpanded && <span className="ml-2">Logout</span>}
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }
}