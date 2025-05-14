// src/features/player/model/usePlayerStore.ts
import { create } from "zustand";
import { useScoreStore } from "@/features/score/model/useScoreStore";

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

export const usePlayerStore = create<PlayerState>(() => ({
  get isPlaying() {
    return useScoreStore.getState().isPlaying;
  },
  get bpm() {
    return useScoreStore.getState().bpm;
  },
  originalBpm: useScoreStore.getState().bpm,
  get currentMeasure() {
    return useScoreStore.getState().currentMeasure;
  },

  togglePlay: () => {
    const next = !useScoreStore.getState().isPlaying;
    useScoreStore.getState().setIsPlaying(next);
    if (next) {
      useScoreStore.getState().setCurrentMeasure(0);
    }
  },

  setBpm: (bpm: number) => {
    useScoreStore.getState().setBpm(bpm);
  },

  resetBpm: () => {
    useScoreStore.getState().setBpm(usePlayerStore.getState().originalBpm);
  },

  setCurrentMeasure: (n: number) => {
    useScoreStore.getState().setCurrentMeasure(n);
  },
}));
