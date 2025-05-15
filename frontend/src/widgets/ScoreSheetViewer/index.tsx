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
  const container = containerRef.current;
  if (container) {
    console.log("🧪 scrollHeight:", container.scrollHeight);
    console.log("🧪 clientHeight:", container.clientHeight);
  }
}, []);
  useEffect(() => {
  if (!containerRef.current) return;

  const system = systems.find((sys) =>
    sys.measureIds.includes(currentMeasure)
  );

  console.log("🔍 currentMeasure:", currentMeasure);
  console.log("📦 systems:", systems);
  console.log("✅ matched system:", system);

  if (system) {
    const systemEl = system.el as HTMLElement;
    const pageWrapper = systemEl.closest(".page-wrapper") as HTMLElement;

    console.log("📌 systemEl:", systemEl);
    console.log("📄 pageWrapper:", pageWrapper);

    if (pageWrapper && containerRef.current.contains(pageWrapper)) {
      pageWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.warn("❌ pageWrapper not found or not in container");
    }
  } else {
    console.warn("⚠️ System not found for measure:", currentMeasure);
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
