import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Icon } from "@/shared/ui/Icon";

export function PlayControl() {
  const { isPlaying, togglePlay } = usePlayerStore();
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        className="rounded-md bg-white/10 hover:bg-white/20 p-2"
      >
        <Icon icon={isPlaying ? "pause" : "play_arrow"} size={24} />
      </button>
      <button className="rounded-md bg-white/10 hover:bg-white/20 p-2">
        <Icon icon="stop" size={24} />
      </button>
      <span className="text-sm font-medium">10마디 / 110마디</span>
    </div>
  );
}