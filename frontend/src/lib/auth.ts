/**
 * Updated Auth client for TodoApp Frontend.
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

export const authClient = {
  signIn: {
    email: async ({ email, password }: LoginCredentials) => {
      try {
        // FIX: Data ab body mein jayega (URL parameters ke bajaye)
        const response = await apiClient.post('/auth/login', { 
          email, 
          password 
        });

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
        // FIX: Register ke liye bhi data body mein bhein
        const response = await apiClient.post('/auth/register', {
          email,
          password,
          name
        });

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