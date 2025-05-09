import { useEffect, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { MeasureTracker } from "./MeasureTracker";

export function ScoreSheetViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { xmlData, setMeasureCount } = useScoreStore();

  useEffect(() => {
    if (!xmlData || !containerRef.current) return;

    const osmd = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      drawTitle: false,
    });

    osmd
      .load(xmlData)
      .then(() => {
        osmd.render();

        // 총 마디 수 계산
        const totalMeasures = osmd?.Sheet?.Measures?.length || 0;
        setMeasureCount(totalMeasures);
      })
      .catch(console.error);
  }, [xmlData]);

  return (
    <div className="relative">
      <div ref={containerRef} className="overflow-x-auto w-full" />
      <div className="absolute bottom-2 right-2">
        <MeasureTracker />
      </div>
    </div>
  );
}
