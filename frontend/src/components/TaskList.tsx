/**
 * Reusable TaskList component for TodoApp.
 *
 * Displays a list of tasks with filtering and search capabilities.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/services";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  filter: "all" | "active" | "completed";
  loading?: boolean;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({
  tasks,
  filter,
  loading = false,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskListProps) {
  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center text-gray-500 dark:text-gray-400"
          >
            {filter === "completed"
              ? "No completed tasks yet"
              : filter === "active"
              ? "No active tasks - great job!"
              : "No tasks yet - add one above!"}
          </motion.div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}