import { create } from "zustand";

interface PlayerState {
  isPlaying: boolean;
  bpm: number;
  originalBpm: number;
  currentMeasure: number;

  togglePlay: () => void;
  setBpm: (bpm: number) => void;
  resetBpm: () => void;
  setCurrentMeasure: (n: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  bpm: 120,
  originalBpm: 120,
  currentMeasure: 0,

  togglePlay: () =>
    set((state) => ({ isPlaying: !state.isPlaying })),
  setBpm: (bpm) => set({ bpm }),
  resetBpm: () =>
    set((state) => ({ bpm: state.originalBpm })),
  setCurrentMeasure: (n) => set({ currentMeasure: n }),
}));
