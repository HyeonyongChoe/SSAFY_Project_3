import { useScoreStore } from "@/features/score/model/useScoreStore";

export function MeasureTracker() {
  const { currentMeasure, measureCount } = useScoreStore();

  return (
    <div className="px-3 py-1 bg-white/80 text-sm rounded shadow">
      {currentMeasure + 1} / {measureCount}
    </div>
  );
}
