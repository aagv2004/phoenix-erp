import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSyncExternalStore } from "react";

const useHasHydrated = () => {
  return useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
};

export const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) {
    return null;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
