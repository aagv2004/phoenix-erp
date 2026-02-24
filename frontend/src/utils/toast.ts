import Swal from "sweetalert2";
import type { PermissionDeniedContext } from "../types/permission-denied-context";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "colored-toast", // Puedes agregar clases CSS personalizadas
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const PERMISSION_TOAST_STORAGE_KEY = "phoenix_permission_toasts";

const loadShownPermissionToasts = (): Set<string> => {
  try {
    const raw = localStorage.getItem(PERMISSION_TOAST_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
};

const saveShownPermissionToasts = (set: Set<string>) => {
  try {
    const arr = Array.from(set);
    localStorage.setItem(PERMISSION_TOAST_STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // No hacemos nada si falla el almacenamiento
  }
};

const shownPermissionToasts = loadShownPermissionToasts();

const getPermissionContextKey = (context?: PermissionDeniedContext): string => {
  const method = context?.method?.toUpperCase() ?? "ANY";
  const url = context?.url ?? "ANY";
  return `${method}:${url}`;
};

export const showSuccessToast = (message: string) => {
  Toast.fire({
    icon: "success",
    title: message,
  });
};

export const showErrorToast = (message: string) => {
  Toast.fire({
    icon: "error",
    title: message,
  });
};

export const showWarningToast = (message: string) => {
  Toast.fire({
    icon: "warning",
    title: message,
  });
};

export const showInfoToast = (message: string) => {
  Toast.fire({
    icon: "info",
    title: message,
  });
};

// Modal de confirmación
export const showConfirmDialog = async (
  title: string,
  text: string,
  confirmButtonText: string = "Sí, continuar",
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText: "Cancelar",
  });

  return result.isConfirmed;
};

// Toast para errores de permisos (403)
export const showPermissionDeniedToast = (
  context?: PermissionDeniedContext,
) => {
  const key = getPermissionContextKey(context);

  if (shownPermissionToasts.has(key)) {
    return;
  }
  shownPermissionToasts.add(key);
  saveShownPermissionToasts(shownPermissionToasts);

  const method = context?.method?.toUpperCase();

  let title: string;
  let text: string;

  if (method === "GET") {
    title = "🔒 Acceso restringido";
    text = "Tienes permisos únicamente para ver esta información.";
  } else {
    title = "🔒 Acción no permitida para tu rol";
    text = "Tu rol no tiene permisos para realizar esta acción";
  }

  Toast.fire({
    icon: "info",
    title,
    text,
    timer: 4000,
  });
};

// Toast para sesión expirada (401)
export const showSessionExpiredToast = () => {
  Toast.fire({
    icon: "warning",
    title: "⏱️ Sesión Expirada",
    text: "Tu sesión ha caducado. Por favor, inicia sesión nuevamente.",
    timer: 4000,
  });
};
