import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  loadPersistedAuth,
  type PersistedAuthState,
} from "../utils/authPersistence";

export const ProtectedRoute = () => {
  const [auth] = useState<PersistedAuthState | null>(() => loadPersistedAuth());

  const token = auth?.token;
  const isAuth = auth?.isAuth ?? !!token;

  if (!token && !isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
