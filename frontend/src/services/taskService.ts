/**
 * Task API service for TodoApp Frontend.
 *
 * This module provides typed API methods for task CRUD operations.
 */

import { apiClient, getErrorMessage } from "@/lib/api";

/**
 * Task priority levels
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Task entity type
 */
export interface Task {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Task creation payload
 */
export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  completed?: boolean;
}

/**
 * Task update payload
 */
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  completed?: boolean;
}

/**
 * Task list response
 */
export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Task query parameters
 */
export interface TaskQueryParams {
  page?: number;
  page_size?: number;
  completed?: boolean;
  priority?: TaskPriority;
  search?: string;
  sort_by?: "created_at" | "updated_at" | "due_date" | "priority";
  sort_order?: "asc" | "desc";
}

/**
 * Task API service
 */
export const taskService = {
  /**
   * Get all tasks for the current user
   */
  async getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    try {
      const response = await apiClient.get<TaskListResponse>("/tasks", { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get a single task by ID
   */
  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create a new task
   */
  async createTask(payload: CreateTaskPayload): Promise<Task> {
    try {
      const response = await apiClient.post<Task>("/tasks", payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update an existing task
   */
  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    try {
      const response = await apiClient.put<Task>(`/tasks/${taskId}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Partially update a task (PATCH)
   */
  async patchTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${taskId}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Toggle task completion status
   */
  async toggleTaskCompletion(taskId: string, completed: boolean): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${taskId}`, { completed });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default taskService;
