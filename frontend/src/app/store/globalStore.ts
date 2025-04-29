// src/app/store/globalStore.ts
import { create } from 'zustand';

type GlobalState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));
