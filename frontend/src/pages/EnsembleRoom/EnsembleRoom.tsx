// src/pages/EnsembleRoom/EnsembleRoom.tsx
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { EnsembleRoomHeader } from "@/widgets/EnsembleRoomHeader";
import ScoreSheetViewer from "@/widgets/ScoreSheetViewer";
import EnsembleRoomFooter from "@/widgets/EnsembleRoomFooter";
import { useGlobalStore } from "@/app/store/globalStore";
import { usePlaySync } from "@/shared/hooks/usePlaySync"; // ✅ import 추가

export default function EnsembleRoom() {
  const { isPlaying, setIsPlaying } = useGlobalStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { roomId } = useParams(); // ✅ URL 파라미터에서 spaceId 추출

  if (roomId) {
    usePlaySync(roomId); // ✅ 재생 동기화 훅 호출
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
