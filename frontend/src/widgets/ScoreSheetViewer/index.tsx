// src/widgets/ScoreSheetViewer/index.tsx
import React, { useRef } from "react";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useMeasureHighlight } from "@/features/score/hooks/useMeasureHighlight";
import { useVerovioLoader } from "@/features/score/hooks/useVerovioLoader";
import { PlayControl } from "@/widgets/PlayControl";

const ScoreSheetViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen } = useScoreStore();

  useVerovioLoader(containerRef);
  useMeasureHighlight(containerRef);

  return (
    <div
      className={`relative w-full h-full overflow-auto ${
        isFullscreen ? "bg-black" : "bg-white"
      }`}
    >
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4">
        <PlayControl />
      </div>
    </div>
  );
};

export default ScoreSheetViewer;
