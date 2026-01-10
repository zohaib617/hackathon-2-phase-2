/**
 * Better Auth client for TodoApp Frontend (FIXED).
 * * Data is now sent in the request body instead of URL parameters 
 * to prevent sensitive information (passwords) from leaking in logs.
 */

import { apiClient, getErrorMessage } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
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
        /**
         * FIXED: Sent credentials in request body.
         * Previous version leaked password in URL.
         */
        const response = await apiClient.post('/auth/login', {
          email,
          password,
        });

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
        /**
         * FIXED: Sent registration data in request body.
         * This is secure and follows HTTP standards.
         */
        const response = await apiClient.post('/auth/register', {
          email,
          password,
          name: name || '',
        });

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
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    return Promise.resolve();
  },

  getSession: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      return { data: null };
    }

    try {
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
      return { data: null };
    }
  }
};

export type { Session };