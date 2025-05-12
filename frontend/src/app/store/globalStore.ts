// src/app/store/globalStore.ts
import { create } from "zustand";

type GlobalState = {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (status: boolean) => void;
  // login: (token: string) => void;
  logout: () => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  isLoggedIn: false,
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
}));
