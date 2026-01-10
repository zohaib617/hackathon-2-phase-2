import { apiClient, getErrorMessage } from './api';

export interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export const authClient = {
  signIn: {
    email: async ({ email, password }: any) => {
      try {
        // Body mein data bhej rahe hain (Standard Method)
        const response = await apiClient.post(`/auth/login`, { email, password });

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
    email: async ({ email, password, name }: any) => {
      try {
        const response = await apiClient.post(`/auth/register`, { email, password, name });
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
    } catch (error) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  getSession: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) return { data: null };

    try {
      const response = await apiClient.get('/auth/me');
      return { data: { user: response.data } };
    } catch (error) {
      return { data: null };
    }
  }
};