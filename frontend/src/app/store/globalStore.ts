// src/app/store/globalStore.ts
import { create } from "zustand";

type GlobalState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;

  isPlaying: boolean;
  setIsPlaying: (status: boolean) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),

  isPlaying: false,
  setIsPlaying: (status) => set({ isPlaying: status }),
}));
