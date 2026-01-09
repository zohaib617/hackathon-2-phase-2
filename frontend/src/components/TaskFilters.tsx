/**
 * Task Filters component for TodoApp.
 *
 * Provides filtering and sorting controls for tasks.
 */

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { TaskPriority } from "@/services";

interface TaskFiltersProps {
  activeFilter: "all" | "active" | "completed";
  priorityFilter: TaskPriority | "all";
  sortBy: "created_at" | "updated_at" | "due_date" | "priority";
  sortOrder: "asc" | "desc";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  onPriorityFilterChange: (priority: TaskPriority | "all") => void;
  onSortChange: (sort: "created_at" | "updated_at" | "due_date" | "priority", order: "asc" | "desc") => void;
}

export default function TaskFilters({
  activeFilter,
  priorityFilter,
  sortBy,
  sortOrder,
  onFilterChange,
  onPriorityFilterChange,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Status Filter */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status</h3>
          <div className="flex space-x-2">
            <Button
              variant={activeFilter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => onFilterChange("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "active" ? "primary" : "outline"}
              size="sm"
              onClick={() => onFilterChange("active")}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === "completed" ? "primary" : "outline"}
              size="sm"
              onClick={() => onFilterChange("completed")}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Priority</h3>
          <div className="flex space-x-2">
            <Button
              variant={priorityFilter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => onPriorityFilterChange("all")}
            >
              All
            </Button>
            <Button
              variant={priorityFilter === "high" ? "primary" : "outline"}
              size="sm"
              onClick={() => onPriorityFilterChange("high")}
            >
              High
            </Button>
            <Button
              variant={priorityFilter === "medium" ? "primary" : "outline"}
              size="sm"
              onClick={() => onPriorityFilterChange("medium")}
            >
              Medium
            </Button>
            <Button
              variant={priorityFilter === "low" ? "primary" : "outline"}
              size="sm"
              onClick={() => onPriorityFilterChange("low")}
            >
              Low
            </Button>
          </div>
        </div>

        {/* Sort Controls */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</h3>
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any, sortOrder)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="created_at">Created Date</option>
              <option value="updated_at">Updated Date</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}