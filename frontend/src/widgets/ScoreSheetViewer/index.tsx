import React, { useEffect, useRef } from "react";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useMeasureHighlight } from "@/features/score/hooks/useMeasureHighlight";
import { useVerovioLoader } from "@/features/score/hooks/useVerovioLoader";
import { PlayControl } from "@/widgets/PlayControl";
import { usePlaySync } from "@/shared/hooks/usePlaySync";
import { useGlobalStore } from "@/app/store/globalStore";
import { useHeaderFooterStore } from "@/app/store/headerFooterStore";

interface ScoreSheetViewerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ScoreSheetViewer: React.FC<ScoreSheetViewerProps> = ({
  containerRef,
}) => {
  const { isFullscreen, currentMeasure, systems, isPlaying } = useScoreStore();
  const clientId = useGlobalStore((state) => state.clientId);
  const { setShowHeaderFooter } = useHeaderFooterStore();

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

  // ✅ 재생 상태 변화만 감지하여 즉시 스크롤
  useEffect(() => {
    if (!containerRef.current || !isPlaying) return;

    const currentSystemIndex = systems.findIndex((sys) =>
      sys.measureIds.includes(currentMeasure)
    );

    if (currentSystemIndex === -1) return;

    const currentSystem = systems[currentSystemIndex].el as SVGGraphicsElement;

    // 재생 시작 시 즉시 스크롤
    currentSystem.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });

    lastSystemIndexRef.current = currentSystemIndex;
    console.log(
      `🎯 재생 시작 스크롤: 시스템 ${currentSystemIndex}, 마디 ${currentMeasure}`
    );
  }, [isPlaying]); // isPlaying만 의존성으로 설정

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

    // ✅ 재생 중일 때 마디 변경으로 인한 스크롤
    if (
      isPlaying &&
      lastSystemIndexRef.current !== currentSystemIndex &&
      lastSystemIndexRef.current !== null
    ) {
      currentSystem.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      lastSystemIndexRef.current = currentSystemIndex;
      console.log(
        `🎯 마디 변경 스크롤: 시스템 ${currentSystemIndex}, 마디 ${currentMeasure}`
      );
    }

    // ✅ 재생 정지 시 lastSystemIndexRef 초기화
    if (!isPlaying) {
      lastSystemIndexRef.current = null;
    }
  }, [currentMeasure, systems, isPlaying]);

  // 터치 이벤트 핸들러
  const handleTouch = () => {
    if (!isPlaying) return; // 재생 중이 아닐 때는 무시

    setShowHeaderFooter((prev) => !prev); // 토글
  };

  return (
    <div
      className={`relative w-full flex-1 overflow-hidden ${
        isFullscreen ? "bg-black" : "bg-white"
      }`}
      onClick={handleTouch}
    >
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto scroll-smooth"
      >
        <div className="relative">
          {/* ✅ Verovio가 삽입될 영역 */}
          <div className="h-[20px]" /> ← 여백
          <div id="verovio-container" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4">
        <PlayControl />
      </div>
    </div>
  );
};

export default ScoreSheetViewer;
