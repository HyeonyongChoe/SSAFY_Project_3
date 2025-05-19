import { create } from "zustand";

interface InstrumentState {
  selected: string;
  setInstrument: (instrument: string) => void;
}

export const useInstrumentStore = create<InstrumentState>((set) => ({
  selected: "Piano",
  setInstrument: (instrument) => set({ selected: instrument }),
}));
