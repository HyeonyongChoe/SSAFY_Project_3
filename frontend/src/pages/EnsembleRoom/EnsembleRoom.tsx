// src/pages/EnsembleRoom/EnsembleRoom.tsx
import { EnsembleRoomHeader } from "@/widgets/EnsembleRoomHeader";
import ScoreSheetViewer from "@/widgets/ScoreSheetViewer";
import EnsembleRoomFooter from "@/widgets/EnsembleRoomFooter";
import { useGlobalStore } from "@/app/store/globalStore";

export default function EnsembleRoom() {
  const { isPlaying, setIsPlaying } = useGlobalStore();

  const handleClick = () => {
    if (isPlaying) {
      setIsPlaying(false); // ✅ 재생 중이면 상/하단 다시 표시
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-100">
      <EnsembleRoomHeader />
      <div className="flex-1 overflow-y-auto p-4" onClick={handleClick}>
        <ScoreSheetViewer />
      </div>
      <div className="border-t bg-white shadow-md">
        <EnsembleRoomFooter />
      </div>
    </div>
  );
}
