import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { User } from "../types/user";
import { getCurrentUser } from "../api/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  setLogin: (token: string, user: User) => void;
  setLogout: () => void;

  fetchCurrentUser?: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,

      setLogin: (token, user) => set({ token, user, isAuth: true }),
      setLogout: () => set({ token: null, user: null, isAuth: false }),
      fetchCurrentUser: async () => {
        try {
          const { data } = await getCurrentUser();
          set({ user: data, isAuth: true });
        } catch (error) {
          // Si la petición fue cancelada (por navegación, recarga, etc.), no lo tratamos como error de app
          if (axios.isCancel && axios.isCancel(error)) {
            return;
          }
          console.error("Error fetching current user:", error);
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
