import { create } from "zustand"

interface ScoreState {
  isPlaying: boolean
  currentMeasure: number
  totalMeasures: number
  tempo: number
  selectedInstrument: string
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentMeasure: (measure: number) => void
  setTotalMeasures: (measures: number) => void
  setTempo: (tempo: number) => void
  setSelectedInstrument: (instrument: string) => void
}

export const useScoreStore = create<ScoreState>((set) => ({
  isPlaying: false,
  currentMeasure: 1,
  totalMeasures: 110,
  tempo: 145,
  selectedInstrument: "Guitar 1",
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentMeasure: (currentMeasure) => set({ currentMeasure }),
  setTotalMeasures: (totalMeasures) => set({ totalMeasures }),
  setTempo: (tempo) => set({ tempo }),
  setSelectedInstrument: (selectedInstrument) => set({ selectedInstrument }),
}))
