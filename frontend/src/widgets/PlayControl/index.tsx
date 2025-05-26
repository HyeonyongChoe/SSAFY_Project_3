import { useEffect, useState } from "react";
import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Icon } from "@/shared/ui/Icon";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { useSocketStore } from "@/app/store/socketStore";

let audioCtx: AudioContext | null = null;

export function PlayControl() {
  const { isPlaying, togglePlay, currentMeasure } = usePlayerStore();
  const { measureCount, bpm } = useScoreStore();
  const setGlobalPlaying = useGlobalStore((state) => state.setIsPlaying);
  const stompClient = useSocketStore((state) => state.stompClient);
  const spaceId = useSocketStore((state) => state.spaceId);

  const [countdown, setCountdown] = useState<number | null>(null);

  const playMetronomeBeep = () => {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (err) {
      console.warn("🔇 오디오 재생 실패:", err);
    }
  };

  const publishPlayState = (
    status: "PLAYING" | "PAUSED" | "STOPPED",
    measure: number
  ) => {
    if (!spaceId) {
      console.warn("❌ spaceId가 설정되지 않았습니다.");
      return;
    }
    const message = {
      spaceId,
      bpm,
      startTimestamp: Date.now(),
      playStatus: status,
      currentMeasure: measure,
      positionInMeasure: 0,
    };
    console.log("🛰️ [SEND] /app/play/update payload:", message);
    if (stompClient?.connected) {
      stompClient.publish({
        destination: "/app/play/update",
        body: JSON.stringify(message),
      });
      console.log("✅ [WebSocket] 메시지 전송 성공");
    } else {
      console.warn("❌ [WebSocket] 연결 안 됨 - stompClient.connected=false");
    }
  };

  useEffect(() => {
    if (countdown === null) return;

    const beatDuration = 60000 / bpm;

    if (countdown === 0) {
      console.log("✅ [COUNTDOWN] 종료 후 재생 시작");
      togglePlay();
      setGlobalPlaying(true);
      publishPlayState("PLAYING", currentMeasure);
      setCountdown(null);
    } else {
      playMetronomeBeep();
      const timer = setTimeout(
        () => setCountdown((prev) => (prev ?? 1) - 1),
        beatDuration
      );
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePlayToggle = () => {
    const isCurrentlyPlaying = usePlayerStore.getState().isPlaying;
    console.log(
      `🎬 [CLICK] PlayToggle - 현재 상태: ${
        isCurrentlyPlaying ? "재생 중" : "정지 상태"
      }`
    );
    if (!isCurrentlyPlaying && countdown === null) {
      console.log("▶️ [COUNTDOWN] 4박 시작");
      setCountdown(4);
    } else {
      togglePlay();
      setGlobalPlaying(false);
      publishPlayState("PAUSED", currentMeasure);
    }
  };

  const handleStop = () => {
    console.log("⏹️ [CLICK] Stop");
    useScoreStore.getState().setIsPlaying(false);
    useScoreStore.getState().setCurrentMeasure(0);
    setGlobalPlaying(false);
    setCountdown(null);
    publishPlayState("STOPPED", 0);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePlayToggle}
        disabled={countdown !== null}
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
