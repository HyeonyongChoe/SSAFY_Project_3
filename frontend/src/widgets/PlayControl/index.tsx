// 📁 src/widgets/PlayControl/index.tsx
import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Icon } from "@/shared/ui/Icon";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useGlobalStore } from "@/app/store/globalStore";

export function PlayControl() {
  const { isPlaying, togglePlay, currentMeasure } = usePlayerStore();
  const { measureCount } = useScoreStore();
  const setGlobalPlaying = useGlobalStore((state) => state.setIsPlaying);

  const handlePlayToggle = () => {
    const isCurrentlyPlaying = usePlayerStore.getState().isPlaying; // ✅ 상태 즉시 조회
    togglePlay();
    setGlobalPlaying(!isCurrentlyPlaying); // ✅ 최신 상태 기준 반전
  };

  const handleStop = () => {
    useScoreStore.getState().setIsPlaying(false);
    useScoreStore.getState().setCurrentMeasure(0); // ✅ 정지 시 0번으로 초기화
    useGlobalStore.getState().setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePlayToggle}
        className="rounded-md bg-white/10 hover:bg-white/20 p-2"
      >
        <Icon icon={isPlaying ? "pause" : "play_arrow"} size={24} />
      </button>
      <button
        onClick={handleStop}
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
