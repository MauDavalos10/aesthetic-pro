import { toast } from "react-hot-toast";

// Configuración base para los toasts
const defaultOptions = {
  duration: 4000,
  position: "top-right",
  style: {
    borderRadius: "8px",
    background: "#333",
    color: "#fff",
    fontSize: "14px",
    padding: "12px 16px",
  },
};

// Notificación de éxito
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#4caf50",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#4caf50",
    },
    ...options,
  });
};

// Notificación de error
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...defaultOptions,
    duration: 6000, // Errores duran más tiempo
    style: {
      ...defaultOptions.style,
      background: "#f44336",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#f44336",
    },
    ...options,
  });
};

// Notificación de advertencia
export const showWarning = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    icon: "⚠️",
    style: {
      ...defaultOptions.style,
      background: "#ff9800",
      color: "#fff",
    },
    ...options,
  });
};

// Notificación de información
export const showInfo = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    icon: "ℹ️",
    style: {
      ...defaultOptions.style,
      background: "#2196f3",
      color: "#fff",
    },
    ...options,
  });
};

// Notificación de carga
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#6c757d",
      color: "#fff",
    },
    ...options,
  });
};

// Actualizar notificación existente
export const updateToast = (
  toastId,
  message,
  type = "success",
  options = {}
) => {
  const updateOptions = {
    ...defaultOptions,
    ...options,
  };

  switch (type) {
    case "success":
      return toast.success(message, { ...updateOptions, id: toastId });
    case "error":
      return toast.error(message, { ...updateOptions, id: toastId });
    case "loading":
      return toast.loading(message, { ...updateOptions, id: toastId });
    default:
      return toast(message, { ...updateOptions, id: toastId });
  }
};

// Descartar notificación
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Descartar todas las notificaciones
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Notificación personalizada con JSX
export const showCustom = (component, options = {}) => {
  return toast.custom(component, {
    ...defaultOptions,
    ...options,
  });
};

// Notificación de promesa (para operaciones async)
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || "Cargando...",
      success: messages.success || "Completado",
      error: messages.error || "Error",
    },
    {
      ...defaultOptions,
      success: {
        style: {
          ...defaultOptions.style,
          background: "#4caf50",
        },
      },
      error: {
        style: {
          ...defaultOptions.style,
          background: "#f44336",
        },
      },
      loading: {
        style: {
          ...defaultOptions.style,
          background: "#6c757d",
        },
      },
      ...options,
    }
  );
};

// Notificaciones específicas para la aplicación
export const notifications = {
  // Autenticación
  auth: {
    loginSuccess: () => showSuccess("¡Bienvenido de vuelta!"),
    loginError: () => showError("Error al iniciar sesión"),
    logoutSuccess: () => showSuccess("Sesión cerrada correctamente"),
    signupSuccess: () => showSuccess("Cuenta creada exitosamente"),
    signupError: () => showError("Error al crear la cuenta"),
  },

  // Simulaciones
  simulation: {
    uploadSuccess: () => showSuccess("Imagen cargada correctamente"),
    uploadError: () => showError("Error al cargar la imagen"),
    saveSuccess: () => showSuccess("Simulación guardada"),
    saveError: () => showError("Error al guardar la simulación"),
    deleteSuccess: () => showSuccess("Simulación eliminada"),
    deleteError: () => showError("Error al eliminar la simulación"),
    limitReached: (plan) =>
      showWarning(
        `Has alcanzado el límite de simulaciones para el plan ${plan}. Actualiza tu plan para continuar.`
      ),
    exportSuccess: () => showSuccess("Imagen exportada correctamente"),
    exportError: () => showError("Error al exportar la imagen"),
  },

  // Pacientes
  patient: {
    addSuccess: (name) =>
      showSuccess(`Paciente ${name} agregado correctamente`),
    addError: () => showError("Error al agregar el paciente"),
    updateSuccess: (name) => showSuccess(`Información de ${name} actualizada`),
    updateError: () => showError("Error al actualizar el paciente"),
    deleteSuccess: (name) => showSuccess(`Paciente ${name} eliminado`),
    deleteError: () => showError("Error al eliminar el paciente"),
  },

  // Perfil
  profile: {
    updateSuccess: () => showSuccess("Perfil actualizado correctamente"),
    updateError: () => showError("Error al actualizar el perfil"),
    avatarUpdateSuccess: () => showSuccess("Foto de perfil actualizada"),
    avatarUpdateError: () => showError("Error al actualizar la foto de perfil"),
  },

  // Suscripciones
  subscription: {
    upgradeSuccess: (plan) =>
      showSuccess(`Plan actualizado a ${plan} exitosamente`),
    upgradeError: () => showError("Error al actualizar el plan"),
    cancelSuccess: () =>
      showInfo(
        "Suscripción cancelada. Tendrás acceso hasta el final del período de facturación."
      ),
    cancelError: () => showError("Error al cancelar la suscripción"),
    paymentSuccess: () => showSuccess("Pago procesado correctamente"),
    paymentError: () => showError("Error al procesar el pago"),
  },

  // Sistema
  system: {
    offline: () => showWarning("Conexión perdida. Trabajando en modo offline."),
    online: () => showSuccess("Conexión restablecida"),
    updateAvailable: () =>
      showInfo(
        "Nueva versión disponible. Actualiza para obtener las últimas mejoras."
      ),
    maintenanceMode: () =>
      showWarning(
        "El sistema está en mantenimiento. Algunas funciones pueden no estar disponibles."
      ),
  },

  // Cloudinary
  cloudinary: {
    uploadStarted: () => showLoading("Subiendo imagen..."),
    uploadProgress: (progress) => showInfo(`Subiendo imagen... ${progress}%`),
    uploadCompleted: () => showSuccess("Imagen subida correctamente"),
    uploadFailed: () => showError("Error al subir la imagen"),
    processingImage: () => showLoading("Procesando imagen..."),
    imageProcessed: () => showSuccess("Imagen procesada correctamente"),
  },
};

// Wrapper para operaciones con carga
export const withLoadingToast = async (
  promise,
  loadingMessage,
  successMessage,
  errorMessage
) => {
  const toastId = showLoading(loadingMessage);

  try {
    const result = await promise;
    updateToast(toastId, successMessage, "success");
    return result;
  } catch (error) {
    updateToast(toastId, errorMessage || error.message, "error");
    throw error;
  }
};

// Notificación con confirmación
export const showConfirmation = (message, onConfirm, onCancel) => {
  return showCustom(
    (t) => (
      <div className="bg-white p-4 rounded-lg shadow-lg border max-w-md">
        <div className="flex flex-col gap-3">
          <p className="text-gray-800 font-medium">{message}</p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => {
                toast.dismiss(t.id);
                onCancel?.();
              }}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              onClick={() => {
                toast.dismiss(t.id);
                onConfirm?.();
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: 10000,
    }
  );
};

// Notificación de progreso personalizada
export const showProgressToast = (message, progress = 0) => {
  return showCustom(
    (t) => (
      <div className="bg-white p-4 rounded-lg shadow-lg border min-w-[300px]">
        <div className="flex items-center gap-3 mb-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-gray-800 font-medium">{message}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">{progress}%</div>
      </div>
    ),
    {
      duration: Infinity,
    }
  );
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  updateToast,
  dismissToast,
  dismissAllToasts,
  showCustom,
  showPromise,
  notifications,
  withLoadingToast,
  showConfirmation,
  showProgressToast,
};
