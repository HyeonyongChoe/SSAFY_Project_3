import { RefObject, useEffect } from "react";
import { PlayControl } from "../PlayControl";
import { BpmControlButton } from "./BpmControlButton";
import { MetronomeToggleButton } from "./MetronomeToggleButton";
import { usePreviewThumbnails } from "@/features/score/hooks/usePreviewThumbnails";
import { useGlobalStore } from "@/app/store/globalStore";
import { useHeaderFooterStore } from "@/app/store/headerFooterStore";

interface EnsembleRoomFooterProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function EnsembleRoomFooter({
  containerRef,
}: EnsembleRoomFooterProps) {
  const isPlaying = useGlobalStore((state) => state.isPlaying);
  const showHeaderFooter = useHeaderFooterStore((state) => state.showHeaderFooter);
  const setShowHeaderFooter = useHeaderFooterStore((state) => state.setShowHeaderFooter);

  const { thumbnails, handleThumbnailClick } = usePreviewThumbnails(containerRef);

  useEffect(() => {
    if (!isPlaying) {
      setShowHeaderFooter(true);
    }
  }, [isPlaying, setShowHeaderFooter]);

  if (isPlaying && !showHeaderFooter) return null;

  return (
    <footer
      onClick={(e) => e.stopPropagation()}
      className="w-full fixed bottom-0 bg-[#2E3153] text-white text-sm z-50"
    >
      {/* 항상 미리보기 썸네일 표시 */}
      <div className="w-full px-4 py-2 bg-[#2E3153] border-t border-white/10 flex gap-2 overflow-x-auto">
        {thumbnails.map((thumb, index) => (
          <div
            key={index}
            className="bg-white p-1 rounded shadow-sm cursor-pointer hover:shadow-md transition"
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={thumb}
              alt={`Page ${index + 1}`}
              className="w-20 h-auto rounded"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-6 py-2 order-2">
        <div className="flex items-center gap-4">
          <PlayControl />
        </div>
        <div className="flex items-center gap-4">
          <BpmControlButton />
          <MetronomeToggleButton />
        </div>
      </div>
    </footer>
  );
}
