// widgets/EnsembleRoomFooter/index.tsx
import { PlayControl } from "./PlayPauseButton";
import { BpmControlButton } from "./BpmControlButton";
import { MetronomeToggleButton } from "./MetronomeToggleButton";
import { ScorePreviewToggle } from "./ScorePreviewToggle";

export default function EnsembleRoomFooter() {
  return (
    <footer className="w-full fixed bottom-0 bg-[#2E3153] text-white px-6 py-2 flex items-center justify-between text-sm h-16 z-50">
      <div className="flex items-center gap-4">
        <PlayControl />
        <ScorePreviewToggle />
      </div>
      <div className="flex items-center gap-4">
        <BpmControlButton />
        <MetronomeToggleButton />
      </div>
    </footer>
  );
}
