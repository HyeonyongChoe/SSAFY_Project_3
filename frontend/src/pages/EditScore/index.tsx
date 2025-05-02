// pages/EditScore/index.tsx
import { ScoreViewer } from "@/widgets/ScoreViewer/ScoreViewer"
import ScoreEditorModal from "@/widgets/ScoreEditorModal/ScoreEditorModal"
import { ControlPanel } from "@/widgets/ControlPanel/ControlPanel"

export function EditScorePage() {
  return (
    <div className="p-4 space-y-4">
      <ControlPanel />
      <ScoreViewer />
      <ScoreEditorModal />
    </div>
  )
}

