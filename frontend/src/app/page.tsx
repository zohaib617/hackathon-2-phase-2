'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ListTodo, Sparkles,  ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: 'Smart Management',
    description: 'Organize your daily workflow with intelligent task tracking and priority levels.',
    color: 'bg-blue-500'
  },
  {
    icon: <ListTodo className="h-6 w-6" />,
    title: 'Real-time Sync',
    description: 'Your tasks are always in sync across all your devices and team members.',
    color: 'bg-indigo-500'
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Modern Experience',
    description: 'A distraction-free interface designed for maximum focus and productivity.',
    color: 'bg-purple-500'
  },
];

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color} text-white shadow-lg`}>
        {feature.icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-[#09090b]">
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-[1200px] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-48 -left-48 h-96 w-96 bg-purple-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: Collaborative Workspaces
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl"
          >
            Master your day, <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              one task at a time.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            The world's most intuitive task manager. Built for individuals who 
            value clarity and teams that crave efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-6"
          >
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-indigo-500/25">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg dark:bg-gray-900/50">
                <Github className="mr-2 h-5 w-5" /> Star on GitHub
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="pb-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="border-t border-gray-100 dark:border-gray-800 py-12 text-center text-sm text-gray-500">
          <p>© 2026 TodoApp. Crafted with ❤️ for productive people.</p>
        </footer>
      </div>
    </main>
  );
}