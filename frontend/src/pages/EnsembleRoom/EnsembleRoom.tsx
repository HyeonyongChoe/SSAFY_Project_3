// src/pages/EnsembleRoom/EnsembleRoom.tsx
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { EnsembleRoomHeader } from "@/widgets/EnsembleRoomHeader";
import ScoreSheetViewer from "@/widgets/ScoreSheetViewer";
import EnsembleRoomFooter from "@/widgets/EnsembleRoomFooter";
import { useGlobalStore } from "@/app/store/globalStore";
import { usePlaySync } from "@/shared/hooks/usePlaySync";

export default function EnsembleRoom() {
  const { isPlaying, setIsPlaying } = useGlobalStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { roomId } = useParams();

  if (roomId) {
    usePlaySync(roomId);
  }

  const handleClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-screen" onClick={handleClick}>
      <EnsembleRoomHeader />
      <div className="flex-1 overflow-y-auto scroll-custom">
        <ScoreSheetViewer containerRef={containerRef} />
      </div>
      <EnsembleRoomFooter containerRef={containerRef} />
    </div>
  );
}
