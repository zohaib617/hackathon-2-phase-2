/**
 * Reusable TaskItem component for TodoApp.
 *
 * Displays an individual task with completion toggle, edit, and delete functionality.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "@/services";
import { Button } from "./ui/Button";
import ConfirmationModal from "./ConfirmationModal";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, padding: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border p-5 transition-all duration-300 hover:shadow-md ${
        task.completed
          ? "border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-900/20"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
            />
          </motion.div>
          <div className="flex-1">
            <motion.h3
              className={`font-medium ${
                task.completed
                  ? "text-gray-500 line-through dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
              animate={{
                color: task.completed
                  ? (document.documentElement.classList.contains('dark') ? '#9ca3af' : '#9ca3af')
                  : (document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937')
              }}
            >
              {task.title}
            </motion.h3>
            {task.description && (
              <motion.p
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              >
                {task.description}
              </motion.p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
              </span>
              {task.due_date && (
                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </motion.div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        cancelText="Cancel"
        variant="danger"
      />
    </motion.div>
  );
}