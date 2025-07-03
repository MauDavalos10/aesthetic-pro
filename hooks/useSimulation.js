import { useState, useCallback, useRef } from "react";
import { useStore } from "../store/useStore";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../lib/cloudinary";

export const useSimulation = () => {
  const {
    currentSimulation,
    setCurrentSimulation,
    addSimulation,
    updateSimulation,
    simulationsCount,
    userPlan,
    incrementSimulationsCount,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const canvasRef = useRef(null);

  // Límites por plan
  const planLimits = { FREE: 5, BASIC: 50, PRO: 999 };

  // Verificar si puede crear más simulaciones
  const canCreateSimulation = useCallback(() => {
    if (userPlan === "PRO") return true;
    return simulationsCount < planLimits[userPlan];
  }, [userPlan, simulationsCount]);

  // Inicializar nueva simulación
  const initializeSimulation = useCallback(
    async (imageFile, patientId) => {
      try {
        setLoading(true);
        setError(null);

        // Verificar límites
        if (!canCreateSimulation()) {
          throw new Error(
            `Has alcanzado el límite de ${planLimits[userPlan]} simulaciones para tu plan`
          );
        }

        // Subir imagen original
        setUploadProgress(20);
        const uploadResult = await uploadImageToCloudinary(imageFile);

        setUploadProgress(60);

        // Crear nueva simulación
        const newSimulation = {
          id: Date.now().toString(),
          patientId,
          originalImage: uploadResult.url,
          originalImagePublicId: uploadResult.publicId,
          modifiedImage: null,
          modifiedImagePublicId: null,
          status: "draft",
          modifications: {
            nose: {
              bridge: 0,
              tip: 0,
              nostrils: 0,
              projection: 0,
              rotation: 0,
            },
            lips: {
              volume: 0,
              cupid: 0,
              corners: 0,
              asymmetry: 0,
              definition: 0,
            },
          },
          metadata: {
            originalDimensions: {
              width: uploadResult.width,
              height: uploadResult.height,
            },
            format: uploadResult.format,
            uploadedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCurrentSimulation(newSimulation);
        setUploadProgress(100);

        return newSimulation;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    },
    [canCreateSimulation, userPlan, setCurrentSimulation]
  );

  // Aplicar modificaciones
  const applyModifications = useCallback(
    async (modifications) => {
      if (!currentSimulation) {
        throw new Error("No hay simulación activa");
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener el canvas modificado
        const modifiedImageDataUrl = canvasRef.current?.getModifiedImage();
        if (!modifiedImageDataUrl) {
          throw new Error("No se pudo obtener la imagen modificada");
        }

        // Convertir DataURL a File
        const response = await fetch(modifiedImageDataUrl);
        const blob = await response.blob();
        const modifiedFile = new File([blob], "modified.png", {
          type: "image/png",
        });

        // Subir imagen modificada
        const uploadResult = await uploadImageToCloudinary(modifiedFile);

        // Actualizar simulación
        const updatedSimulation = {
          ...currentSimulation,
          modifiedImage: uploadResult.url,
          modifiedImagePublicId: uploadResult.publicId,
          modifications,
          status: "completed",
          updatedAt: new Date().toISOString(),
        };

        setCurrentSimulation(updatedSimulation);
        updateSimulation(updatedSimulation.id, updatedSimulation);

        return updatedSimulation;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentSimulation, setCurrentSimulation, updateSimulation]
  );

  // Guardar simulación
  const saveSimulation = useCallback(async () => {
    if (!currentSimulation) {
      throw new Error("No hay simulación activa");
    }

    try {
      setLoading(true);
      setError(null);

      // Agregar simulación al store
      addSimulation(currentSimulation);

      // Incrementar contador
      incrementSimulationsCount();

      return currentSimulation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentSimulation, addSimulation, incrementSimulationsCount]);

  // Descartar simulación
  const discardSimulation = useCallback(async () => {
    if (!currentSimulation) return;

    try {
      setLoading(true);

      // Eliminar imágenes de Cloudinary
      if (currentSimulation.originalImagePublicId) {
        await deleteImageFromCloudinary(
          currentSimulation.originalImagePublicId
        );
      }
      if (currentSimulation.modifiedImagePublicId) {
        await deleteImageFromCloudinary(
          currentSimulation.modifiedImagePublicId
        );
      }

      setCurrentSimulation(null);
    } catch (err) {
      console.error("Error descartando simulación:", err);
      // No lanzar error aquí, solo loggear
    } finally {
      setLoading(false);
    }
  }, [currentSimulation, setCurrentSimulation]);

  // Resetear modificaciones
  const resetModifications = useCallback(() => {
    if (!currentSimulation) return;

    const resetSimulation = {
      ...currentSimulation,
      modifications: {
        nose: {
          bridge: 0,
          tip: 0,
          nostrils: 0,
          projection: 0,
          rotation: 0,
        },
        lips: {
          volume: 0,
          cupid: 0,
          corners: 0,
          asymmetry: 0,
          definition: 0,
        },
      },
      modifiedImage: null,
      modifiedImagePublicId: null,
      status: "draft",
      updatedAt: new Date().toISOString(),
    };

    setCurrentSimulation(resetSimulation);
  }, [currentSimulation, setCurrentSimulation]);

  // Exportar imagen
  const exportImage = useCallback(
    async (format = "png", quality = 0.95) => {
      if (!currentSimulation?.modifiedImage) {
        throw new Error("No hay imagen modificada para exportar");
      }

      try {
        setLoading(true);

        // Si es plan gratuito, agregar marca de agua
        const shouldAddWatermark = userPlan === "FREE";

        const canvas = canvasRef.current?.getExportCanvas(shouldAddWatermark);
        if (!canvas) {
          throw new Error("No se pudo generar el canvas para exportar");
        }

        // Crear enlace de descarga
        const link = document.createElement("a");
        link.download = `simulation_${
          currentSimulation.id
        }_${Date.now()}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, quality);
        link.click();

        return link.href;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentSimulation, userPlan]
  );

  // Comparar antes y después
  const getComparison = useCallback(() => {
    if (!currentSimulation) return null;

    return {
      before: currentSimulation.originalImage,
      after: currentSimulation.modifiedImage,
      modifications: currentSimulation.modifications,
      hasChanges: currentSimulation.status === "completed",
    };
  }, [currentSimulation]);

  // Obtener estadísticas de la simulación
  const getSimulationStats = useCallback(() => {
    if (!currentSimulation) return null;

    const { modifications } = currentSimulation;

    const noseChanges = Object.values(modifications.nose).filter(
      (val) => val !== 0
    ).length;
    const lipsChanges = Object.values(modifications.lips).filter(
      (val) => val !== 0
    ).length;
    const totalChanges = noseChanges + lipsChanges;

    return {
      noseChanges,
      lipsChanges,
      totalChanges,
      hasNoseModifications: noseChanges > 0,
      hasLipsModifications: lipsChanges > 0,
      intensity:
        totalChanges > 0
          ? (
              Object.values({
                ...modifications.nose,
                ...modifications.lips,
              }).reduce((sum, val) => sum + Math.abs(val), 0) / totalChanges
            ).toFixed(1)
          : 0,
    };
  }, [currentSimulation]);

  return {
    // Estado
    currentSimulation,
    loading,
    error,
    uploadProgress,
    canvasRef,

    // Métodos principales
    initializeSimulation,
    applyModifications,
    saveSimulation,
    discardSimulation,
    resetModifications,
    exportImage,

    // Utilidades
    canCreateSimulation,
    getComparison,
    getSimulationStats,

    // Límites
    remainingSimulations:
      userPlan === "PRO" ? 999 : planLimits[userPlan] - simulationsCount,
    planLimit: planLimits[userPlan],

    // Helpers
    setError: (error) => setError(error),
    clearError: () => setError(null),
  };
};
