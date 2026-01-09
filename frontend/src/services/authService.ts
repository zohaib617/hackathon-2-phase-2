/**
 * Authentication API service for TodoApp Frontend.
 *
 * This module provides typed API methods for authentication operations.
 */

import { apiClient, getErrorMessage } from "@/lib/api";

/**
 * User entity type
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  email_verified: boolean;
  image: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials
 */
export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

/**
 * Auth response with token
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Authentication API service
 */
export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/login", credentials);

      // Store token in localStorage for API client interceptor
      if (typeof window !== "undefined" && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Signup with email, password, and name
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/signup", credentials);

      // Store token in localStorage for API client interceptor
      if (typeof window !== "undefined" && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/auth/logout");

      // Clear token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/api/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/refresh");

      // Update token in localStorage
      if (typeof window !== "undefined" && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default authService;
