import { create } from "zustand";

export const useStore = create((set, get) => ({
  // Usuario
  user: null,
  setUser: (user) => set({ user }),

  // Pacientes
  patients: [],
  setPatients: (patients) => set({ patients }),
  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, patient],
    })),

  // Simulaciones
  currentSimulation: null,
  setCurrentSimulation: (simulation) => set({ currentSimulation: simulation }),

  // Editor de imágenes
  originalImage: null,
  modifiedImage: null,
  faceMesh: null,
  editorMode: "nose", // 'nose' | 'lips'

  setOriginalImage: (image) => set({ originalImage: image }),
  setModifiedImage: (image) => set({ modifiedImage: image }),
  setFaceMesh: (mesh) => set({ faceMesh: mesh }),
  setEditorMode: (mode) => set({ editorMode: mode }),

  // UI State
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Plan del usuario
  userPlan: "FREE",
  simulationsCount: 0,
  setUserPlan: (plan) => set({ userPlan: plan }),
  setSimulationsCount: (count) => set({ simulationsCount: count }),
  incrementSimulationsCount: () =>
    set((state) => ({
      simulationsCount: state.simulationsCount + 1,
    })),

  // Reset functions
  resetSimulation: () =>
    set({
      originalImage: null,
      modifiedImage: null,
      faceMesh: null,
      currentSimulation: null,
    }),
}));
