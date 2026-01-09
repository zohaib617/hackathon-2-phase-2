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
      exit={{ opacity: 0, y: 10 }}
      className={`rounded-lg border p-4 ${
        task.completed
          ? "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-900/20"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <div>
            <h3
              className={`font-medium ${
                task.completed
                  ? "text-gray-500 line-through dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center space-x-4">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </Button>
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