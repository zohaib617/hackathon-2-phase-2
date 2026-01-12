/**
 * Professional Axios API Client for TodoApp Frontend.
 * Optimized for performance, security, and seamless JWT handling.
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Base API URL - Env variables se load hota hai.
 * Backend trailing slash issues se bachne ke liye base URL ko clean rakha gaya hai.
 */
const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || "http://localhost:8000/api/v1";

/**
 * Custom Error Interface for better TypeScript support.
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

/**
 * Configured Axios instance.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds (Production standard)
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR: Auth Token Handling
 * Har request se pehle check karta hai ke token mojood hai ya nahi.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // SSR check to prevent 'window is not defined' errors in Next.js
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");

      if (token && config.headers) {
        const cleanToken = token.trim();
        // Ensure "Bearer " prefix logic
        config.headers.Authorization = cleanToken.startsWith('Bearer ') 
          ? cleanToken 
          : `Bearer ${cleanToken}`;
      }
    }

    /**
     * PRO TIP: Trailing Slash Fix
     * Agar request URL ke aakhir mein slash nahi hai, to add kar deta hai 
     * taake FastAPI 307 Redirect na bheje.
     */
    if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
      config.url += '/';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR: Global Error Handling & Token Expiry
 * 401 Unauthorized errors ko handle karta hai bina infinite loops ke.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      
      // Auth/me request check to avoid redundant redirects
      const isAuthMeRequest = error.config?.url?.includes('/auth/me');

      switch (status) {
        case 401:
          // Agar user pehle se login page par nahi hai aur unauthorized hai
          if (!isAuthMeRequest && typeof window !== "undefined" && currentPath !== "/login") {
            localStorage.removeItem("auth_token");
            // Redirect with callback URL for better UX
            window.location.href = `/login?message=session_expired&callback=${encodeURIComponent(currentPath)}`;
          }
          break;

        case 403:
          console.error("[Access Forbidden]: You don't have permission.");
          break;

        case 422:
          console.error("[Validation Error]:", error.response.data);
          break;

        case 500:
          console.error("[Server Error]: Please try again later.");
          break;
      }
    } else if (error.request) {
      // Network issue (backend down)
      console.error("[Network Error]: No response from server.");
    }

    return Promise.reject(error);
  }
);

/**
 * Helper: API Errors se saaf message nikalne ke liye.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // FastAPI 'detail' field use karta hai errors ke liye
    const data = error.response?.data;
    if (data?.detail) {
      return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    }
    return data?.message || error.message || "An unexpected error occurred";
  }
  return error instanceof Error ? error.message : "An unknown error occurred";
}

export default apiClient;