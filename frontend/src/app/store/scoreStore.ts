import { create } from 'zustand';

interface ScoreState {
  isPlaying: boolean;
  currentLineIndex: number;
  setIsPlaying: (value: boolean) => void;
  nextLine: () => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
  isPlaying: false,
  currentLineIndex: 0,
  setIsPlaying: (value) => set({ isPlaying: value }),
  nextLine: () =>
    set((state) => ({ currentLineIndex: state.currentLineIndex + 1 })),
}));

