/**
 * Custom hook for managing task filters and search.
 *
 * Provides state and functions for filtering, searching, and sorting tasks.
 */

import { useState, useMemo } from "react";
import { Task, TaskPriority } from "@/services";

export interface TaskFilters {
  status: "all" | "active" | "completed";
  priority: TaskPriority | "all";
  search: string;
  sortBy: "created_at" | "updated_at" | "due_date" | "priority" | "title";
  sortOrder: "asc" | "desc";
}

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply status filter
    if (filters.status === "active") {
      result = result.filter(task => !task.completed);
    } else if (filters.status === "completed") {
      result = result.filter(task => task.completed);
    }

    // Apply priority filter
    if (filters.priority !== "all") {
      result = result.filter(task => task.priority === filters.priority);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: string | Date | boolean | number;
      let bValue: string | Date | boolean | number;

      switch (filters.sortBy) {
        case "created_at":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case "updated_at":
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case "due_date":
          aValue = a.due_date ? new Date(a.due_date) : new Date(0);
          bValue = b.due_date ? new Date(b.due_date) : new Date(0);
          break;
        case "priority":
          // High > Medium > Low
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as TaskPriority] as number;
          bValue = priorityOrder[b.priority as TaskPriority] as number;
          break;
        case "title":
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
      }

      // Handle comparison based on type
      let comparison = 0;
      if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = (aValue as any) - (bValue as any);
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters]);

  const updateFilter = (key: keyof TaskFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      search: "",
      sortBy: "created_at",
      sortOrder: "desc",
    });
  };

  return {
    filters,
    filteredAndSortedTasks,
    updateFilter,
    resetFilters,
  };
}