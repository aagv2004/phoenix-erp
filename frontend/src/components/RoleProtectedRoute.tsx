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

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const hasHydrated = useHasHydrated();
  const { isAuth, user } = useAuthStore((state) => ({
    isAuth: state.isAuth,
    user: state.user,
  }));

  if (!hasHydrated) return null;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
