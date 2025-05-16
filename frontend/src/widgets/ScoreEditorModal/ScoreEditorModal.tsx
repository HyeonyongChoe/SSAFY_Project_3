// widgets/ScoreEditorModal/ScoreEditorModal.tsx
import { useScoreStore } from "@/app/store/scoreStore"
import { Modal } from "@/shared/ui/Modal"

export default function ScoreEditorModal() {
  const {
    editModalOpen,
    closeEditModal,
    measureNotes,
    setMeasureNote,
    selectedMeasure,
  } = useScoreStore()

  const currentNote =
    selectedMeasure !== null ? measureNotes[selectedMeasure] : ""

  const handleSave = () => {
    closeEditModal()
  }

  return (
    <Modal isOpen={editModalOpen} onClose={closeEditModal} title="마디 편집">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">선택된 마디: {selectedMeasure}</p>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={currentNote}
          onChange={(e) => setMeasureNote(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </Modal>
  )
}
