import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  loadPersistedAuth,
  type PersistedAuthState,
} from "../utils/authPersistence";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const [auth] = useState<PersistedAuthState | null>(() => loadPersistedAuth());

  const token = auth?.token;
  const user = auth?.user;
  const isAuth = auth?.isAuth ?? !!token;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toUpperCase();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
