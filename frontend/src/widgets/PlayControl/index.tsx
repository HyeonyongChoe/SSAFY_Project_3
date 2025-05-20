import { useState, useEffect } from "react";
import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { Icon } from "@/shared/ui/Icon";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { useHeaderFooterStore } from "@/app/store/headerFooterStore";
import { useSocketStore } from "@/app/store/socketStore";
import { PlayStatus } from "@/entities/play/types/Play.types";

let audioCtx: AudioContext | null = null;

export function PlayControl() {
  const { isPlaying, togglePlay, currentMeasure } = usePlayerStore();
  const { measureCount, bpm } = useScoreStore();
  const setGlobalPlaying = useGlobalStore((state) => state.setIsPlaying);
  const setShowHeaderFooter = useHeaderFooterStore(
    (state) => state.setShowHeaderFooter
  );
  const stompClient = useSocketStore((state) => state.stompClient);

  const [countdown, setCountdown] = useState<number | null>(null);

  const playMetronomeBeep = () => {
    try {
      console.log("🎵 메트로놈 비프음 재생");
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

  useEffect(() => {
    if (countdown === null) return;

    const beatDuration = 60000 / bpm;

    if (countdown === 0) {
      const isCurrentlyPlaying = usePlayerStore.getState().isPlaying;
      console.log("✅ 카운트다운 종료, 재생 상태 토글 시작", {
        isCurrentlyPlaying,
      });

      togglePlay();
      setGlobalPlaying(!isCurrentlyPlaying);

      if (!isCurrentlyPlaying) {
        console.log("🔽 Header/Footer 숨김 처리");
        setShowHeaderFooter(false);
      }

      if (stompClient?.connected) {
        const playStatus = isCurrentlyPlaying
          ? PlayStatus.PAUSED
          : PlayStatus.PLAYING;

        const message = {
          type: playStatus.toLowerCase(),
          playStatus,
          spaceId: "1",
          bpm,
          startTimestamp: Date.now(),
          playing: !isCurrentlyPlaying,
          currentMeasure,
          sender: "1",
        };

        console.log("📡 WebSocket 전송 (play/pause)", message);
        stompClient.publish({
          destination: "/app/play/update",
          body: JSON.stringify(message),
        });
      } else {
        console.warn("❗ stompClient 연결 안 됨");
      }

      setCountdown(null);
    } else {
      console.log(`⏳ 카운트다운 진행 중: ${countdown}`);
      playMetronomeBeep();
      const timer = setTimeout(
        () => setCountdown((prev) => (prev ?? 1) - 1),
        beatDuration
      );
      return () => clearTimeout(timer);
    }
  }, [
    countdown,
    togglePlay,
    setGlobalPlaying,
    setShowHeaderFooter,
    stompClient,
    bpm,
    currentMeasure,
  ]);

  const handlePlayToggle = () => {
    console.log("🎬 재생 토글 클릭", { isPlaying, countdown });
    if (!isPlaying && countdown === null) {
      console.log("▶️ 카운트다운 시작 (4박)");
      setCountdown(4);
    } else if (isPlaying) {
      console.log("⏸️ 일시정지 실행");
      togglePlay();
      setGlobalPlaying(false);
      setShowHeaderFooter(true);

      if (stompClient?.connected) {
        const message = {
          type: "pause",
          playStatus: PlayStatus.PAUSED,
          spaceId: "1",
          bpm,
          startTimestamp: Date.now(),
          playing: false,
          currentMeasure,
          sender: "1",
        };
        console.log("📡 WebSocket 전송 (pause)", message);
        stompClient.publish({
          destination: "/app/play/update",
          body: JSON.stringify(message),
        });
      } else {
        console.warn("❗ stompClient 연결 안 됨");
      }
    }
  };

  const handleStop = () => {
    console.log("⏹️ 정지 실행");
    useScoreStore.getState().setIsPlaying(false);
    useScoreStore.getState().setCurrentMeasure(0);
    setGlobalPlaying(false);
    setShowHeaderFooter(true);

    if (stompClient?.connected) {
      const message = {
        type: "stop",
        playStatus: PlayStatus.STOPPED,
        spaceId: "1",
        startTimestamp: Date.now(),
        playing: false,
        currentMeasure: 0,
        sender: "1",
      };
      console.log("📡 WebSocket 전송 (stop)", message);
      stompClient.publish({
        destination: "/app/play/update",
        body: JSON.stringify(message),
      });
    } else {
      console.warn("❗ stompClient 연결 안 됨");
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
