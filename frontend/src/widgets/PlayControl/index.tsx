// src/widgets/PlayControl/index.tsx
import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Icon } from "@/shared/ui/Icon";
import { useScoreStore } from "@/features/score/model/useScoreStore";

export function PlayControl() {
  const { isPlaying, togglePlay, currentMeasure } = usePlayerStore();
  const { measureCount } = useScoreStore();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        className="rounded-md bg-white/10 hover:bg-white/20 p-2"
      >
        <Icon icon={isPlaying ? "pause" : "play_arrow"} size={24} />
      </button>
      <button
        onClick={() => useScoreStore.getState().setIsPlaying(false)}
        className="rounded-md bg-white/10 hover:bg-white/20 p-2"
      >
        <Icon icon="stop" size={24} />
      </button>
      <span className="text-sm font-medium">
        {currentMeasure}마디 / {measureCount}마디
      </span>
    </div>
  );
}
