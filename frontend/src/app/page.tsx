'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ListTodo, Sparkles, LogIn } from 'lucide-react';
import Link from 'next/link';

/**
 * Feature data
 */
const features = [
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: 'Task Management',
    description: 'Create, organize, and track your tasks with an intuitive interface.',
  },
  {
    icon: <ListTodo className="h-6 w-6" />,
    title: 'Multi-User Support',
    description: 'Collaborate with your team and share tasks seamlessly.',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Beautiful UI',
    description: 'Enjoy a modern, responsive design that works on all devices.',
  },
];

/**
 * Feature card component
 * Displays individual feature with icon and description
 */
interface FeatureCardProps {
  feature: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-secondary-200 bg-white p-6 shadow-soft transition-all hover:shadow-medium"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
        {feature.icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-secondary-900">{feature.title}</h3>
      <p className="text-sm text-secondary-600">{feature.description}</p>
    </motion.div>
  );
}

/**
 * Home page component
 * Landing page with hero section and feature highlights
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-24 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary-200 to-accent-200 opacity-30" />
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Built with Next.js 16 & TypeScript</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 text-5xl font-bold tracking-tight text-secondary-900 sm:text-6xl lg:text-7xl"
          >
            Manage Your Tasks
            <br />
            <span className="text-gradient">Efficiently & Beautifully</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10 text-lg text-secondary-600 sm:text-xl"
          >
            A modern, multi-user todo application with a beautiful interface.
            <br />
            Built with the latest web technologies for optimal performance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/signup" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2">
              <span>Get Started</span>
              <CheckCircle2 className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-secondary-300 bg-white px-8 py-3 text-base font-semibold text-secondary-900 transition-all hover:border-secondary-400 hover:bg-secondary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-2">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-24 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
      </section>
    </main>
  );
}
