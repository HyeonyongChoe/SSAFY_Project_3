// src/pages/EnsembleRoom/EnsembleRoom.tsx
import { EnsembleRoomHeader } from "@/widgets/EnsembleRoomHeader";
import { ScoreSheetViewer } from "@/widgets/ScoreSheetViewer";
import { EnsembleRoomFooter } from "@/widgets/EnsembleRoomFooter";

export default function EnsembleRoom() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-100">
      <EnsembleRoomHeader />
      <div className="flex-1 overflow-y-auto p-4">
        <ScoreSheetViewer />
      </div>
      <div className="border-t bg-white shadow-md">
        <EnsembleRoomFooter />
      </div>
    </div>
  );
}
