// src/app/store/globalStore.ts
import { create } from "zustand";

type GlobalState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;

  isPlaying: boolean;
  setIsPlaying: (status: boolean) => void;

  accessToken: string | null;
  login: (status: boolean) => void;
  logout: () => void;

  introShown: boolean;
  setIntroShown: (shown: boolean) => void;

  clientId: number;
  setClientId: (id: number) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),

  isPlaying: false,
  setIsPlaying: (status) => set({ isPlaying: status }),

  accessToken: null,
  login: (status) => set({ isLoggedIn: true, accessToken: `${status}` }),
  logout: () => set({ isLoggedIn: false, accessToken: null }),

  introShown: false,
  setIntroShown: (shown) => set({ introShown: shown }),

  clientId: Math.floor(Math.random() * 10000), // 숫자형 ID 사용
  setClientId: (id) => set({ clientId: id }),
}));
