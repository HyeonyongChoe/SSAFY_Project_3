// widgets/EnsembleRoomFooter/index.tsx
import { PlayControl } from "../PlayControl";
import { BpmControlButton } from "./BpmControlButton";
import { MetronomeToggleButton } from "./MetronomeToggleButton";
import { ScorePreviewToggle } from "./ScorePreviewToggle";
import { useGlobalStore } from "@/app/store/globalStore";

export default function EnsembleRoomFooter() {
  const isPlaying = useGlobalStore((state) => state.isPlaying);
  if (isPlaying) return null;

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
