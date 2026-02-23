import axios from "axios";
import { useAuthStore } from "../store/authStore";
import {
  showPermissionDeniedToast,
  showSessionExpiredToast,
  showErrorToast,
} from "../utils/toast";

const client = axios.create({
  baseURL: "http://localhost:3000",
});

// REQUEST INTERCEPTOR - Agregar token
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR - Manejar errores con toasts
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // 401 - No autenticado o token expirado
    if (status === 401) {
      showSessionExpiredToast();

      // Limpiar el store y redirigir al login
      useAuthStore.getState().setLogout();

      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500); // Dar tiempo para que se vea el toast
      }
    }

    // 403 - Autenticado pero sin permisos
    else if (status === 403) {
      showPermissionDeniedToast();
    }

    // 404 - Recurso no encontrado
    else if (status === 404) {
      showErrorToast(message || "Recurso no encontrado");
    }

    // 500 - Error del servidor
    else if (status >= 500) {
      showErrorToast("Error del servidor. Intenta nuevamente más tarde.");
    }

    // Otros errores
    else if (error.response) {
      showErrorToast(message || "Ocurrió un error inesperado");
    }

    // Error de red (sin respuesta del servidor)
    else if (error.request) {
      showErrorToast(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    }

    return Promise.reject(error);
  },
);

export default client;
