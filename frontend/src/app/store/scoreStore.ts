import { create } from "zustand"

interface ScoreState {
  selectedMeasure: number | null
  editModalOpen: boolean
  measureNotes: string[]
  selectMeasure: (index: number) => void
  openEditModal: () => void
  closeEditModal: () => void
  setMeasureNote: (note: string) => void
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  selectedMeasure: null,
  editModalOpen: false,
  measureNotes: Array(100).fill(""),
  selectMeasure: (index) => set({ selectedMeasure: index }),
  openEditModal: () => set({ editModalOpen: true }),
  closeEditModal: () => set({ editModalOpen: false }),
  setMeasureNote: (note) => {
    const idx = get().selectedMeasure
    if (idx !== null) {
      const updated = [...get().measureNotes]
      updated[idx] = note
      set({ measureNotes: updated })
    }
  },
}))
