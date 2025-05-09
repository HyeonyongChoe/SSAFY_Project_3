import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Button } from "@/shared/ui/Button";

export function PlayPauseButton() {
  const { isPlaying, togglePlay } = usePlayerStore();

  return (
    <Button onClick={togglePlay}>
      {isPlaying ? "⏸ 정지" : "▶️ 재생"}
    </Button>
  );
}
