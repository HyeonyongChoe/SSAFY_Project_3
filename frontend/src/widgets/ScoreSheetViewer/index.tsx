import React, { useEffect } from "react";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useMeasureHighlight } from "@/features/score/hooks/useMeasureHighlight";
import { useVerovioLoader } from "@/features/score/hooks/useVerovioLoader";
import { PlayControl } from "@/widgets/PlayControl";

interface ScoreSheetViewerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ScoreSheetViewer: React.FC<ScoreSheetViewerProps> = ({
  containerRef,
}) => {
  const { isFullscreen, currentMeasure, systems } = useScoreStore();

  useVerovioLoader(containerRef);
  useMeasureHighlight(containerRef);

  useEffect(() => {
    if (!containerRef.current) return;

    const system = systems.find((sys) =>
      sys.measureIds.includes(currentMeasure)
    );

    if (system) {
      const systemEl = system.el as HTMLElement;
      systemEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.warn("⚠️ System not found for measure:", currentMeasure);
      console.log("🧪 현재 measure:", currentMeasure);
      console.log("📦 systems snapshot:", systems);
    }
  }, [currentMeasure, systems, containerRef]);

  return (
    <div
      className={`relative w-full flex-1 overflow-hidden ${
        isFullscreen ? "bg-black" : "bg-white"
      }`}
    >
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto scroll-smooth"
      />
      <div className="absolute bottom-4 left-4">
        <PlayControl />
      </div>
    </div>
  );
};

export default ScoreSheetViewer;
