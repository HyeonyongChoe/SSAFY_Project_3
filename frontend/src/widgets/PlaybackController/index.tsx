import { PlayPauseButton } from "./PlayPauseButton";
import { MetronomeToggleButton } from "./MetronomeToggleButton";

export function PlaybackController() {
  return (
    <div className="flex items-center justify-between gap-4">
      <PlayPauseButton />
      <MetronomeToggleButton />
    </div>
  );
}
