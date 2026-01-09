/**
 * Loading Spinner component with Framer Motion animations.
 *
 * A reusable loading indicator with customizable size and color.
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fullScreen?: boolean;
}

export default function Spinner({ size = "md", className, fullScreen = false }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  const spinner = (
    <motion.div
      className={cn(
        "animate-spin rounded-full border-blue-600 border-t-transparent",
        "dark:border-blue-400",
        sizes[size],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Loading component with text
 */
export function LoadingWithText({
  text = "Loading...",
  size = "md",
}: {
  text?: string;
  size?: SpinnerProps["size"];
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Spinner size={size} />
      <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
    </motion.div>
  );
}
