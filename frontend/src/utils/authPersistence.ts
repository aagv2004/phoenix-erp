import type { User } from "../types/user";

export interface PersistedAuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
}

export const loadPersistedAuth = (): PersistedAuthState | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { state?: any } | any;
    const state = (parsed && "state" in parsed ? parsed.state : parsed) ?? {};

    return {
      token: state.token ?? null,
      user: state.user ?? null,
      isAuth: state.isAuth ?? false,
    };
  } catch {
    return null;
  }
};
