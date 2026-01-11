/**
 * Axios API client configuration for TodoApp Frontend.
 *
 * This module provides a configured Axios instance with:
 * - Base URL configuration
 * - Request/response interceptors
 * - Automatic JWT token attachment
 * - Error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Base API URL from environment variables.
 * The backend API is mounted at /api/v1
 */
const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || "https://hackathon-2-phase-2-rho.vercel.app/api/v1/";

/**
 * Configured Axios instance for API requests.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  // Don't use withCredentials since we're handling auth via headers
  // withCredentials: true, // Include cookies in requests
});

/**
 * Request interceptor to attach JWT token to requests.
 *
 * Retrieves the JWT token from localStorage and adds it to the
 * Authorization header for authenticated requests.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token && config.headers) {
      // Ensure the token is properly formatted with "Bearer " prefix
      // Check if token already has "Bearer " prefix to avoid duplication
      const tokenStr = String(token);
      if (!tokenStr.startsWith('Bearer ')) {
        config.headers.Authorization = `Bearer ${tokenStr}`;
      } else {
        config.headers.Authorization = tokenStr;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling.
 *
 * Handles common error scenarios:
 * - 401: Unauthorized (redirect to login)
 * - 403: Forbidden (show error message)
 * - 500: Server error (show error message)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      // Don't log errors for auth/me requests as they're expected when no valid session exists
      const isAuthMeRequest = error.config?.url?.endsWith('/auth/me');

      switch (status) {
        case 401:
          // Unauthorized - redirect to login (except for auth/me which is expected to fail initially)
          if (!isAuthMeRequest && typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          if (!isAuthMeRequest) {
            console.error("Access forbidden:", error.response.data || error.response.statusText);
          }
          break;
        case 500:
          // Server error
          console.error("Server error:", error.response.data || error.response.statusText);
          break;
        default:
          if (!isAuthMeRequest) {
            console.error("API error:", error.response.data || error.response.statusText);
          }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error:", error.message);
    } else {
      // Error in request configuration
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);


/**
 * API error type for typed error handling.
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * Helper function to extract error message from API error.
 *
 * @param error - The error object from Axios
 * @returns Formatted error message
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;

    if (axiosError.response?.data) {
      return (
        axiosError.response.data.detail ||
        axiosError.response.data.message ||
        "An error occurred"
      );
    }

    return axiosError.message || "Network error";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}

export default apiClient;
