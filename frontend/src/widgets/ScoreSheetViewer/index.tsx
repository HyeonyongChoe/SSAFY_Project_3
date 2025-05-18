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
  const { isFullscreen, currentMeasure, systems, isPlaying } = useScoreStore();
  const clientId = useGlobalStore((state) => state.clientId);

  console.log("🎯 ScoreSheetViewer mounted with clientId:", clientId);

  usePlaySync("1");

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
    if (!containerRef.current) return;

    const container = containerRef.current;
    const systemElements = container.querySelectorAll("g.system");

    // dimmed 효과 설정
    if (isPlaying) {
      systemElements.forEach((el) => el.classList.add("dimmed"));
    } else {
      systemElements.forEach((el) => el.classList.remove("dimmed"));
    }

    const currentSystemIndex = systems.findIndex((sys) =>
      sys.measureIds.includes(currentMeasure)
    );
    if (currentSystemIndex === -1) return;

    const currentSystem = systems[currentSystemIndex].el as SVGGraphicsElement;

    if (isPlaying) currentSystem.classList.remove("dimmed");

    // 재생 중일 때만 스크롤
    if (isPlaying && lastSystemIndexRef.current !== currentSystemIndex) {
      currentSystem.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      lastSystemIndexRef.current = currentSystemIndex;
    }
  }, [currentMeasure, systems, isPlaying]);

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
