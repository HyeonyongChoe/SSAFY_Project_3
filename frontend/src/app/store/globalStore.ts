// src/app/store/globalStore.ts
import { create } from "zustand";

type GlobalState = {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (status: boolean) => void;
  // login: (token: string) => void;
  logout: () => void;
  introShown: boolean;
  setIntroShown: (shown: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (status: boolean) => void;
  clientId: number;
  setClientId: (id: number) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  isLoggedIn: true,
  accessToken: null,
  login: (status) =>
    set(() => ({
      isLoggedIn: true,
      accessToken: `${status}`,
    })),
  logout: () =>
    set(() => ({
      isLoggedIn: false,
      accessToken: null,
    })),
  isPlaying: false,
  setIsPlaying: (status) => set({ isPlaying: status }),
  introShown: false,
  setIntroShown: (shown) => set({ introShown: shown }),
  clientId: Math.floor(Math.random() * 10000), // 숫자형 ID 사용
  setClientId: (id) => set({ clientId: id }),
}));
