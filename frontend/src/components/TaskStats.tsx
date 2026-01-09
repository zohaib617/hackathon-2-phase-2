/**
 * Task Stats component for TodoApp.
 *
 * Displays statistics about tasks in a visually appealing way.
 */

import { motion } from "framer-motion";

interface TaskStatsProps {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export default function TaskStats({ total, completed, pending, overdue }: TaskStatsProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="text-2xl font-bold text-gray-800 dark:text-white">{total}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="text-2xl font-bold text-green-600">{completed}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="text-2xl font-bold text-blue-600">{pending}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="text-2xl font-bold text-red-600">{overdue}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:col-span-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">{completionRate}%</div>
          </div>
          <div className="h-10 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}