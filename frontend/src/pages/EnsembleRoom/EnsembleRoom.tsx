// src/pages/EnsembleRoom/EnsembleRoom.tsx
import { useRef } from "react";
import { EnsembleRoomHeader } from "@/widgets/EnsembleRoomHeader";
import ScoreSheetViewer from "@/widgets/ScoreSheetViewer";
import EnsembleRoomFooter from "@/widgets/EnsembleRoomFooter";
import { useGlobalStore } from "@/app/store/globalStore";

export default function EnsembleRoom() {
  const { isPlaying, setIsPlaying } = useGlobalStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsPlaying(!isPlaying); // 현재 상태를 반전시킴
  };

  return (
    <div className="flex flex-col h-screen" onClick={handleClick}>
      <EnsembleRoomHeader />

      {/* 🧩 스크롤 가능한 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto scroll-custom">
        <ScoreSheetViewer containerRef={containerRef} />
      </div>

      <EnsembleRoomFooter containerRef={containerRef} />
    </div>
  );
}
