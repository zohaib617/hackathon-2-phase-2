/**
 * Common type definitions for the application
 */

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Todo entity
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Todo priority levels
 */
export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Todo creation input
 */
export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: string;
}

/**
 * Todo update input
 */
export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  dueDate?: string;
}

/**
 * Authentication credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
