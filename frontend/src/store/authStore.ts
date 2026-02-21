import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  setLogin: (token: string, user: User) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,

      setLogin: (token, user) => set({ token, user, isAuth: true }),
      setLogout: () => set({ token: null, user: null, isAuth: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
