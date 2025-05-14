// src/features/score/hooks/useMeasureHighlight.ts
import { useEffect, useRef } from "react";
import { useScoreStore } from "@/features/score/model/useScoreStore";

export function useMeasureHighlight(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const { currentMeasure, measureCount, bpm, setCurrentMeasure, isPlaying } =
    useScoreStore();
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("🎬 useMeasureHighlight 실행됨 - isPlaying:", isPlaying);
    if (!isPlaying) return;

    const container = containerRef.current;
    if (!container) {
      console.warn("❌ containerRef.current가 null입니다.");
      return;
    }

    const measures = container.querySelectorAll("g.measure");
    console.log("🎼 감지된 마디 수:", measures.length);
    const interval = 60000 / bpm;

    const addHighlightBox = (measure: Element) => {
      const old = measure.querySelector("rect.measure-highlight");
      if (old) measure.removeChild(old);

      const bbox = (measure as SVGGElement).getBBox();
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("x", `${bbox.x}`);
      rect.setAttribute("y", `${bbox.y}`);
      rect.setAttribute("width", `${bbox.width}`);
      rect.setAttribute("height", `${bbox.height}`);
      rect.setAttribute("fill", "rgba(255, 0, 0, 0.2)");
      rect.setAttribute("class", "measure-highlight");
      rect.setAttribute("pointer-events", "none");
      measure.insertBefore(rect, measure.firstChild);
    };

    let current = currentMeasure;
    const step = () => {
      if (current > 0) {
        const prev = measures[current - 1];
        const old = prev.querySelector("rect.measure-highlight");
        if (old) prev.removeChild(old);
      }
      if (current < measureCount) {
        addHighlightBox(measures[current]);
        current++;
        setCurrentMeasure(current);
        playTimerRef.current = setTimeout(step, interval);
      }
    };

    step();

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying]);
}
