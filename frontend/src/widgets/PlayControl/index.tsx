import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Icon } from "@/shared/ui/Icon";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { useSocketStore } from "@/app/store/socketStore";

export function PlayControl() {
  const { isPlaying, togglePlay, currentMeasure } = usePlayerStore();
  const { measureCount, bpm } = useScoreStore();
  const clientId = useGlobalStore((state) => state.clientId);
  const setGlobalPlaying = useGlobalStore((state) => state.setIsPlaying);
  const stompClient = useSocketStore((state) => state.stompClient);

  const handlePlayToggle = () => {
    const isCurrentlyPlaying = usePlayerStore.getState().isPlaying;
    togglePlay();
    setGlobalPlaying(!isCurrentlyPlaying);

    if (stompClient?.connected) {
      const message = {
        type: isCurrentlyPlaying ? "pause" : "play",
        spaceId: "1",
        bpm,
        startTimestamp: Date.now(),
        playing: !isCurrentlyPlaying,
        currentMeasure,
        sender: clientId,
      };

      console.log("🔼 [publish] send play/start message", message);

      stompClient.publish({
        destination: "/app/play/start",
        body: JSON.stringify(message),
      });
    } else {
      console.warn("❌ stompClient not connected");
    }
  };

  const handleStop = () => {
    useScoreStore.getState().setIsPlaying(false);
    useScoreStore.getState().setCurrentMeasure(0);
    setGlobalPlaying(false);

    if (stompClient?.connected) {
      const message = {
        type: "stop",
        spaceId: "1",
        startTimestamp: Date.now(),
        playing: false,
        currentMeasure: 0,
        sender: clientId,
      };

      console.log("🔼 [publish] send stop message", message);

      stompClient.publish({
        destination: "/app/play/update",
        body: JSON.stringify(message),
      });
    }
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
        {currentMeasure + 1}마디 / {measureCount + 1}마디
      </span>
    </div>
  );
}
