/**
 * Custom Auth client for FastAPI JWT backend
 * (NO Better Auth, NO query params)
 */

import apiClient, { getErrorMessage } from "./api";

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
  token: string;
}

export const authClient = {
  // =====================
  // LOGIN (JSON BODY)
  // =====================
  signIn: {
    email: async ({ email, password }: LoginCredentials) => {
      try {
        const response = await apiClient.post("/auth/login", {
          email,
          password,
        });

        if (typeof window !== "undefined" && response.data.token) {
          localStorage.setItem("auth_token", response.data.token);
        }

        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },

  // =====================
  // SIGNUP
  // =====================
  signUp: {
    email: async ({ email, password, name }: RegisterCredentials) => {
      try {
        const response = await apiClient.post("/auth/register", {
          email,
          password,
          name,
        });

        if (typeof window !== "undefined" && response.data.token) {
          localStorage.setItem("auth_token", response.data.token);
        }

        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },

  // =====================
  // LOGOUT
  // =====================
  signOut: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {}

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  // =====================
  // GET SESSION
  // =====================
  getSession: async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null;

    if (!token) {
      return { data: null };
    }

    try {
      const response = await apiClient.get("/auth/me");
      const userData = response.data;

      if (!userData?.id) {
        return { data: null };
      }

      const session: Session = {
        token,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        },
      };

      return { data: session };
    } catch {
      return { data: null };
    }
  },
};

export type { Session };
