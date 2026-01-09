
/**
 * Root layout component for TodoApp.
 *
 * Provides global structure and styling for the entire application,
 * including navigation and authentication context.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

/**
 * Inter font configuration
 * Using variable font for optimal performance
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Application metadata
 */
export const metadata: Metadata = {
  title: {
    default: 'TodoApp - Manage Your Tasks Efficiently',
    template: '%s | TodoApp',
  },
  description:
    'A modern, multi-user todo application built with Next.js, TypeScript, and Tailwind CSS.',
  keywords: ['todo', 'task management', 'productivity', 'next.js', 'react'],
  authors: [{ name: 'TodoApp Team' }],
  creator: 'TodoApp Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://todoapp.example.com',
    title: 'TodoApp - Manage Your Tasks Efficiently',
    description: 'A modern, multi-user todo application',
    siteName: 'TodoApp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TodoApp - Manage Your Tasks Efficiently',
    description: 'A modern, multi-user todo application',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root layout component
 * Provides global structure and styling for the entire application
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
