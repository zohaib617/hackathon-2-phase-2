import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * API client configuration
 * Centralized Axios instance with interceptors for authentication and error handling
 */

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:8000/api';

/**
 * Create Axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Adds authentication token to requests if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common error scenarios and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Redirect to login page
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle other errors
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * API response wrapper type
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * API error type
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Generic API request helper
 */
export const api = {
  get: <T>(url: string, config?: Parameters<typeof apiClient.get>[1]) =>
    apiClient.get<ApiResponse<T>>(url, config),

  post: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.post>[2]) =>
    apiClient.post<ApiResponse<T>>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.put>[2]) =>
    apiClient.put<ApiResponse<T>>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.patch>[2]) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),

  delete: <T>(url: string, config?: Parameters<typeof apiClient.delete>[1]) =>
    apiClient.delete<ApiResponse<T>>(url, config),
};

export default apiClient;
