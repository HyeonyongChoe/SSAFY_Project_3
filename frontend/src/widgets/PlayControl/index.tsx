import { useState, useEffect } from "react";
import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Icon } from "@/shared/ui/Icon";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { useHeaderFooterStore } from "@/app/store/headerFooterStore";
import { useSocketStore } from "@/app/store/socketStore";

export function PlayControl() {
  const { isPlaying, togglePlay, currentMeasure } = usePlayerStore();
  const { measureCount, bpm } = useScoreStore();
  const setGlobalPlaying = useGlobalStore((state) => state.setIsPlaying);
  const setShowHeaderFooter = useHeaderFooterStore((state) => state.setShowHeaderFooter);
  const stompClient = useSocketStore((state) => state.stompClient);

  const [countdown, setCountdown] = useState<number | null>(null);

  const playMetronomeBeep = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine"; // 더 부드러운 파형
    osc.frequency.setValueAtTime(800, ctx.currentTime); // 낮은 톤
    gain.gain.setValueAtTime(0.2, ctx.currentTime); // 낮은 볼륨

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05); // 짧은 소리
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      const isCurrentlyPlaying = usePlayerStore.getState().isPlaying;
      togglePlay();
      setGlobalPlaying(!isCurrentlyPlaying);
      
      // ✅ 재생 시작 시 상하단바 숨김
      if (!isCurrentlyPlaying) {
        setShowHeaderFooter(false);
      }

      if (stompClient?.connected) {
        const message = {
          type: isCurrentlyPlaying ? "pause" : "play",
          spaceId: "1",
          bpm,
          startTimestamp: Date.now(),
          playing: !isCurrentlyPlaying,
          currentMeasure,
          sender: "1",
        };

        stompClient.publish({
          destination: "/app/play/start",
          body: JSON.stringify(message),
        });
      }

      setCountdown(null);
    } else {
      playMetronomeBeep(); // 소리만 재생
      const timer = setTimeout(() => setCountdown((prev) => (prev ?? 1) - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, togglePlay, setGlobalPlaying, setShowHeaderFooter, stompClient, bpm, currentMeasure]);

  const handlePlayToggle = () => {
    if (!isPlaying && countdown === null) {
      setCountdown(3); // 카운트다운 시작
    } else if (isPlaying) {
      togglePlay();
      setGlobalPlaying(false);
      // ✅ 재생 정지 시 상하단바 보임
      setShowHeaderFooter(true);

      if (stompClient?.connected) {
        const message = {
          type: "pause",
          spaceId: "1",
          bpm,
          startTimestamp: Date.now(),
          playing: false,
          currentMeasure,
          sender: "1",
        };

        stompClient.publish({
          destination: "/app/play/start",
          body: JSON.stringify(message),
        });
      }
    }
  };

  const handleStop = () => {
    useScoreStore.getState().setIsPlaying(false);
    useScoreStore.getState().setCurrentMeasure(0);
    setGlobalPlaying(false);
    // ✅ 정지 시 상하단바 보임
    setShowHeaderFooter(true);

    if (stompClient?.connected) {
      const message = {
        type: "stop",
        spaceId: "1",
        startTimestamp: Date.now(),
        playing: false,
        currentMeasure: 0,
        sender: "1",
      };

      stompClient.publish({
        destination: "/app/play/start",
        body: JSON.stringify(message),
      });
    }
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