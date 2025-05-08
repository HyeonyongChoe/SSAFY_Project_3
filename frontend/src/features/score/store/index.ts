import { create } from 'zustand';

interface ScoreState {
  currentLineIndex: number;
  setCurrentLineIndex: (index: number) => void;
  nextLine: () => void;
  resetLine: () => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
  currentLineIndex: 0,
  setCurrentLineIndex: (index) => set({ currentLineIndex: index }),
  nextLine: () => set((state) => ({ currentLineIndex: state.currentLineIndex + 1 })),
  resetLine: () => set({ currentLineIndex: 0 }),
}));
