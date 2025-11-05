"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { CustomExampleDefinition } from "@/types/custom-example";

interface SimulatorState {
  selectedExampleId: string | null;
  inputsByExample: Record<string, Record<string, string | number>>;
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  isLoading: boolean;
  customDefinitions: CustomExampleDefinition[];
  setSelectedExample: (id: string | null) => void;
  setInputsForExample: (
    id: string,
    inputs: Record<string, string | number>
  ) => void;
  clearInputsForExample: (id: string) => void;
  resetPlayback: () => void;
  setPlayback: (
    state: Partial<Pick<SimulatorState, "currentStep" | "isPlaying">>
  ) => void;
  setSpeed: (speed: number) => void;
  advanceStep: (maxStepIndex: number) => void;
  resetSimulation: () => void;
  addCustomDefinition: (definition: CustomExampleDefinition) => void;
  updateCustomDefinition: (definition: CustomExampleDefinition) => void;
  removeCustomDefinition: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  get length() {
    return 0;
  },
};

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set, get) => {
      const actions = {
        setSelectedExample: (id: string | null) => {
          set({ selectedExampleId: id, currentStep: 0, isPlaying: false });
        },
        setInputsForExample: (
          id: string,
          inputs: Record<string, string | number>
        ) => {
          set((state) => ({
            inputsByExample: {
              ...state.inputsByExample,
              [id]: { ...inputs },
            },
          }));
        },
        clearInputsForExample: (id: string) => {
          set((state) => {
            const rest = { ...state.inputsByExample };
            delete rest[id];
            return { inputsByExample: rest };
          });
        },
        resetPlayback: () => set({ currentStep: 0, isPlaying: false }),
        setPlayback: (
          state: Partial<Pick<SimulatorState, "currentStep" | "isPlaying">>
        ) =>
          set((prev) => ({
            currentStep:
              typeof state.currentStep === "number"
                ? Math.max(0, state.currentStep)
                : prev.currentStep,
            isPlaying:
              typeof state.isPlaying === "boolean"
                ? state.isPlaying
                : prev.isPlaying,
          })),
        setSpeed: (speed: number) => set({ speed }),
        advanceStep: (maxStepIndex: number) =>
          set((prev) => {
            const safeMaxIndex = Math.max(0, maxStepIndex);

            if (prev.currentStep >= safeMaxIndex) {
              return { currentStep: safeMaxIndex, isPlaying: false };
            }

            return { currentStep: prev.currentStep + 1 };
          }),
        resetSimulation: () =>
          set({
            selectedExampleId: null,
            currentStep: 0,
            isPlaying: false,
          }),
        addCustomDefinition: (definition: CustomExampleDefinition) => {
          set((state) => {
            const exists = state.customDefinitions.some(
              (item) => item.id === definition.id
            );

            if (exists) {
              return {
                customDefinitions: state.customDefinitions.map((item) =>
                  item.id === definition.id ? definition : item
                ),
              };
            }

            return {
              customDefinitions: [...state.customDefinitions, definition],
            };
          });
        },
        updateCustomDefinition: (definition: CustomExampleDefinition) => {
          set((state) => ({
            customDefinitions: state.customDefinitions.map((item) =>
              item.id === definition.id ? definition : item
            ),
          }));
        },
        removeCustomDefinition: (id: string) => {
          set((state) => ({
            customDefinitions: state.customDefinitions.filter(
              (item) => item.id !== id
            ),
          }));
          const { selectedExampleId } = get();
          if (selectedExampleId === id) {
            set({ selectedExampleId: null, currentStep: 0, isPlaying: false });
            get().clearInputsForExample(id);
          }
        },
        setIsLoading: (isLoading: boolean) => set({ isLoading }),
      };

      return {
        selectedExampleId: null,
        inputsByExample: {},
        currentStep: 0,
        isPlaying: false,
        speed: 1000,
        isLoading: false,
        customDefinitions: [],
        ...actions,
      };
    },
    {
      name: "simulator-store",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage
      ),
      partialize: (state) => ({
        selectedExampleId: state.selectedExampleId,
        inputsByExample: state.inputsByExample,
        customDefinitions: state.customDefinitions,
        speed: state.speed,
      }),
      skipHydration: false,
    }
  )
);

export const getInputsForExample = (
  id: string
): Record<string, string | number> => {
  const store = useSimulatorStore.getState();
  return store.inputsByExample[id] ?? {};
};

export const getCustomDefinitions = (): CustomExampleDefinition[] => {
  return useSimulatorStore.getState().customDefinitions;
};
