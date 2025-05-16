import { create } from "zustand";

interface ScoreStore {
  xmlData: string;
  setXmlData: (data: string) => void;

  currentMeasure: number;
  setCurrentMeasure: (measure: number) => void;

  measureCount: number;
  setMeasureCount: (count: number) => void;

  bpm: number;
  setBpm: (bpm: number) => void;

  thumbnails: string[];
  setThumbnails: (thumbnails: string[]) => void;

  selectedNote: string | null;
  setSelectedNote: (note: string | null) => void;

  isPreviewVisible: boolean;
  togglePreview: () => void;

  isFullscreen: boolean;
  toggleFullscreen: () => void;

  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;

  systems: { el: Element; measureIds: number[] }[];
  setSystems: (systems: { el: Element; measureIds: number[] }[]) => void;
}

export const useScoreStore = create<ScoreStore>((set) => ({
  xmlData: "",
  setXmlData: (data) => set({ xmlData: data }),

  currentMeasure: 0,
  setCurrentMeasure: (measure) => set({ currentMeasure: measure }),

  measureCount: 0,
  setMeasureCount: (count) => set({ measureCount: count }),

  bpm: 120,
  setBpm: (bpm) => set({ bpm }),

  thumbnails: [],
  setThumbnails: (thumbnails) => set({ thumbnails }),

  selectedNote: null,
  setSelectedNote: (note) => set({ selectedNote: note }),

  isPreviewVisible: false,
  togglePreview: () =>
    set((state) => ({ isPreviewVisible: !state.isPreviewVisible })),

  isFullscreen: false,
  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  systems: [],
  setSystems: (systems) => set({ systems }),
}));
