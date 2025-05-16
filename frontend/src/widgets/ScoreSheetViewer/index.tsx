// src/widgets/ScoreSheetViewer/index.tsx
import React, { useEffect, useRef } from "react";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useMeasureHighlight } from "@/features/score/hooks/useMeasureHighlight";
import { useVerovioLoader } from "@/features/score/hooks/useVerovioLoader";
import { PlayControl } from "@/widgets/PlayControl";
import { usePlaySync } from "@/shared/hooks/usePlaySync";
import { useGlobalStore } from "@/app/store/globalStore";

interface ScoreSheetViewerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ScoreSheetViewer: React.FC<ScoreSheetViewerProps> = ({
  containerRef,
}) => {
  const { isFullscreen, currentMeasure, systems } = useScoreStore();
  const clientId = useGlobalStore((state) => state.clientId);

  console.log("🎯 ScoreSheetViewer mounted with clientId:", clientId);

  usePlaySync("1", clientId); // clientId는 number 타입

  const lastSystemIndexRef = useRef<number | null>(null);

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
    console.log("🎼 currentMeasure changed:", currentMeasure);

    if (!containerRef.current) return;

    const currentSystemIndex = systems.findIndex((sys) =>
      sys.measureIds.includes(currentMeasure)
    );

    if (currentSystemIndex === -1) {
      console.warn("⚠️ System not found for measure:", currentMeasure);
      return;
    }

    if (lastSystemIndexRef.current !== currentSystemIndex) {
      console.log("📍 scrolling to system index:", currentSystemIndex);
      const system = systems[currentSystemIndex];
      const systemEl = system.el as SVGGraphicsElement;

      if (containerRef.current && systemEl) {
        systemEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        lastSystemIndexRef.current = currentSystemIndex;
      } else {
        console.warn("❌ systemEl not found or not in container");
      }
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
