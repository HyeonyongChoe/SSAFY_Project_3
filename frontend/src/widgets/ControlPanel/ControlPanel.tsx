// widgets/ControlPanel/ControlPanel.tsx
import { useScoreStore } from "@/app/store/scoreStore"

export function ControlPanel({
  onPlayToggle,
  isPlaying,
}: {
  onPlayToggle?: () => void
  isPlaying?: boolean
}) {
  const { selectedMeasure, openEditModal } = useScoreStore()

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={selectedMeasure === null}
        onClick={openEditModal}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        편집
      </button>

      {onPlayToggle && (
        <button
          onClick={() => {
            console.log("재생 버튼 클릭됨")
            onPlayToggle()
          }}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          {isPlaying ? "정지" : "재생"}
        </button>
      )}
    </div>
  )
}
