// src/features/score/hooks/useMeasureHighlight.ts
import { useEffect, useRef } from "react";
import { useScoreStore } from "@/features/score/model/useScoreStore";

export function useMeasureHighlight(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const {
    currentMeasure,
    measureCount,
    bpm,
    setCurrentMeasure,
    isPlaying,
    setIsPlaying,
  } = useScoreStore();

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateHighlight = () => {
    const container = containerRef.current;
    if (!container) return;

    const measures = container.querySelectorAll("g.measure");

    measures.forEach((m, i) => {
      const old = m.querySelector("rect.measure-highlight");
      if (old) m.removeChild(old);

      // 순차적 인덱스를 마디 번호로 간주
      const id = i;

      if (id === currentMeasure) {
        const bbox = (m as SVGGElement).getBBox();
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", `${bbox.x}`);
        rect.setAttribute("y", `${bbox.y}`);
        rect.setAttribute("width", `${bbox.width}`);
        rect.setAttribute("height", `${bbox.height}`);
        rect.setAttribute("fill", "rgba(144, 238, 144, 0.3)");
        rect.setAttribute("stroke", "rgba(34, 139, 34, 0.6)");
        rect.setAttribute("stroke-width", "1");
        rect.setAttribute("class", "measure-highlight");
        rect.setAttribute("pointer-events", "none");
        m.insertBefore(rect, m.firstChild);
      }
    });
  };

  useEffect(() => {
    updateHighlight(); // always keep highlight in sync
  }, [currentMeasure]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = (60000 / bpm) * 4;
    updateHighlight();

    const step = () => {
      const prev = useScoreStore.getState().currentMeasure;
      const next = prev + 1;

      if (next >= measureCount) {
        setIsPlaying(false);
        setCurrentMeasure(0);
      } else {
        setCurrentMeasure(next);
        playTimerRef.current = setTimeout(step, interval);
      }
    };

    playTimerRef.current = setTimeout(step, interval);

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, bpm]);
}
