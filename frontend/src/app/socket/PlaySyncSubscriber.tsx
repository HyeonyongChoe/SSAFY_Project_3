import { useEffect } from "react";
import { useSocketStore } from "@/app/store/socketStore";
import { useScoreStore } from "@/features/score/model/useScoreStore";

export function PlaySyncSubscriber() {
  const stompClient = useSocketStore((state) => state.stompClient);
  const spaceId = useSocketStore((state) => state.spaceId);

  const setCurrentMeasure = useScoreStore((state) => state.setCurrentMeasure);
  const setIsPlaying = useScoreStore((state) => state.setIsPlaying);

  useEffect(() => {
    if (!stompClient?.connected || !spaceId) return;

    const sub = stompClient.subscribe(`/topic/play/session/${spaceId}`, (msg) => {
      const message = JSON.parse(msg.body);
      console.log("🟢 동기화 메시지 수신:", message);

      if (message.playStatus === "PLAYING") {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }

      if (typeof message.currentMeasure === "number") {
        setCurrentMeasure(message.currentMeasure);
      }
    });

    return () => sub.unsubscribe();
  }, [stompClient, spaceId]);

  return null;
}
