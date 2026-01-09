/**
 * Better Auth client for TodoApp Frontend.
 *
 * This module provides authentication functions that integrate with Better Auth.
 * Tokens are stored in localStorage by Better Auth.
 */

import { apiClient, getErrorMessage } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

interface LoginResponse {
  user_id: string;
  email: string;
  name: string;
  token: string;
}

interface RegisterResponse {
  message: string;
  user_id: string;
  email: string;
  token: string;
}

interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

/**
 * Better Auth client that relies on localStorage-based authentication
 */
export const authClient = {
  signIn: {
    email: async ({ email, password }: LoginCredentials) => {
      try {
        // Use query parameters instead of request body for backend compatibility
        const response = await apiClient.post(`/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

        // Store token in localStorage
        if (typeof window !== 'undefined' && response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }

        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    }
  },

  signUp: {
    email: async ({ email, password, name }: RegisterCredentials) => {
      try {
        // Use query parameters instead of request body for backend compatibility
        const response = await apiClient.post(`/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(name || '')}`);

        // Store token in localStorage
        if (typeof window !== 'undefined' && response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }

        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    }
  },

  signOut: async () => {
    try {
      // Call the logout endpoint if available
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with local cleanup even if server logout fails
      console.error('Logout error:', error);
    }

    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    return Promise.resolve();
  },

  getSession: async () => {
    // Check if we have a token before making the request
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      // No token exists, so return null session without making request
      return { data: null };
    }

    try {
      // The API client will automatically include the token via the request interceptor
      const response = await apiClient.get('/auth/me');
      const userData = response.data;

      if (!userData || !userData.id) {
        return { data: null };
      }

      const session: Session = {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        }
      };

      return { data: session };
    } catch (error) {
      // Session is invalid or doesn't exist
      return { data: null };
    }
  }
};

/**
 * Type exports for Better Auth
 */
export type { Session };
