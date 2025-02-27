// src/store/useLoaderStore.ts
import { create } from "zustand";

// Définition du type pour l'état du loader
type LoaderState = {
    isLoading: boolean; // Indique si le loader est actif
    showLoader: () => void; // Active le loader
    hideLoader: () => void; // Désactive le loader
};

// Création du store Zustand pour gérer l'affichage du loader
export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false, // État initial : le loader est désactivé
  showLoader: () => set({ isLoading: true }), // Active le loader
  hideLoader: () => set({ isLoading: false }), // Désactive le loader
}));
