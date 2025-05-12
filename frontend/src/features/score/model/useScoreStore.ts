import { create } from "zustand";

interface ScoreState {
  xmlData: string | null;
  measureCount: number;
  currentMeasure: number;

  setXmlData: (xml: string) => void;
  setMeasureCount: (count: number) => void;
  setCurrentMeasure: (index: number | ((prev: number) => number)) => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
  xmlData: null,
  measureCount: 0,
  currentMeasure: 0,

  setXmlData: (xml) => set({ xmlData: xml }),
  setMeasureCount: (count) => set({ measureCount: count }),
  setCurrentMeasure: (indexOrUpdater) =>
    set((state) => ({
      currentMeasure:
        typeof indexOrUpdater === "function"
          ? indexOrUpdater(state.currentMeasure)
          : indexOrUpdater,
    })),
}));
