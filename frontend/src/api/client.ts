import axios from "axios";
import { useAuthStore } from "../store/authStore";
import {
  showPermissionDeniedToast,
  showSessionExpiredToast,
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
    const status = error?.response?.status;

    if (status === 401) {
      showSessionExpiredToast();
    }

    if (status === 403) {
      // Pasamos método y URL para que el toast pueda adaptar el mensaje
      showPermissionDeniedToast({
        method: error.config?.method,
        url: error.config?.url,
      });
    }

    return Promise.reject(error);
  },
);

export default client;
