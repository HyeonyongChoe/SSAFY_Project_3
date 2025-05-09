import { useEffect, useState } from "react";
import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { getCurrentMeasureIndex } from "@/features/score/lib/syncMeasureWithPlayback";

export function useCurrentMeasure() {
  const { bpm, isPlaying } = usePlayerStore();
  const { setCurrentMeasure } = useScoreStore();
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      setStartTime(Date.now());
      interval = setInterval(() => {
        const elapsed = (Date.now() - (startTime ?? Date.now())) / 1000;
        const measure = getCurrentMeasureIndex(elapsed, bpm);
        setCurrentMeasure(measure);
      }, 200); // 200ms 단위로 체크
    } else {
      setStartTime(null);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  return null; // UI 필요 없음
}
