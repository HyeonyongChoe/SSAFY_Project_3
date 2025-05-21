import { useRef } from "react";
import { useParams } from "react-router-dom";
import { EnsembleRoomHeader } from "@/widgets/EnsembleRoomHeader";
import ScoreSheetViewer from "@/widgets/ScoreSheetViewer";
import EnsembleRoomFooter from "@/widgets/EnsembleRoomFooter";
import { usePlaySync } from "@/shared/hooks/usePlaySync";
import { useManagerCheck } from "@/shared/hooks/useManagerCheck";
import ScoreSelectModal from "@/widgets/ScoreSelectModal/ScoreSelectModal";

export default function EnsembleRoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { roomId } = useParams();

  // ✅ 훅은 항상 최상단에서 호출되어야 함 (조건문 ❌)
  usePlaySync(roomId ?? "");
  useManagerCheck(roomId ?? "");

  return (
    <div className="flex flex-col h-screen bg-white">
      <ScoreSelectModal spaceId={roomId!} />
      <>
        <EnsembleRoomHeader />
        <div className="flex-1 overflow-y-auto scroll-custom">
          <ScoreSheetViewer containerRef={containerRef} />
        </div>
        <EnsembleRoomFooter containerRef={containerRef} />
      </>
    </div>
  );
}
