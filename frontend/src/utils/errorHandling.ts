import { AxiosError } from "axios";
import type { BackendErrorResponse } from "../types/backend-error";

/**
 * Type guard para verificar si el error es de Axios
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Extrae el mensaje de error de forma segura
 */
export function getErrorMessage(error: unknown): string {
  // Si es un error de Axios
  if (isAxiosError(error)) {
    const data = error.response?.data as BackendErrorResponse | undefined;

    // Manejar caso donde message es un array (validaciones de NestJS)
    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(", "); // Unir mensajes con coma
      }
      return data.message;
    }

    // Probar con campo alternativo 'error'
    if (data?.error) {
      return data.error;
    }

    // Mensaje de Axios
    if (error.message) {
      return error.message;
    }

    // Fallback
    return "Error en la petición";
  }

  // Si es un Error nativo de JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // Si es un string
  if (typeof error === "string") {
    return error;
  }

  // Si es un objeto con propiedad message
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  // Fallback genérico
  return "Ocurrió un error inesperado";
}

/**
 * Extrae el código de estado HTTP de forma segura
 */
export function getErrorStatus(error: unknown): number | null {
  if (isAxiosError(error)) {
    return error.response?.status || null;
  }
  return null;
}

/**
 * Verifica si el error es de un tipo específico de status
 */
export function isErrorStatus(error: unknown, status: number): boolean {
  return getErrorStatus(error) === status;
}

/**
 * Extrae todos los mensajes de error como array (útil para formularios)
 */
export function getErrorMessages(error: unknown): string[] {
  if (isAxiosError(error)) {
    const data = error.response?.data as BackendErrorResponse | undefined;

    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message;
      }
      return [data.message];
    }
  }

  return [getErrorMessage(error)];
}

/**
 * Logger de errores para debugging
 */
export function logError(error: unknown, context?: string): void {
  const message = getErrorMessage(error);
  const status = getErrorStatus(error);

  console.error(`[${context || "Error"}]`, {
    message,
    status,
    fullError: error,
  });
}

export const isForbiddenError = (error: unknown): boolean => {
  const axiosError = error as AxiosError<BackendErrorResponse>;
  return axiosError?.response?.status === 403;
};
