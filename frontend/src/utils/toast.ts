import Swal from "sweetalert2";

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
export const showPermissionDeniedToast = () => {
  Toast.fire({
    icon: "error",
    title: "🔒 Acceso Denegado",
    text: "Tu rol no tiene permisos para realizar esta acción",
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
