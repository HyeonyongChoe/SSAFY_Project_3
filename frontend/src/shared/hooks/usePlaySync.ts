// src/shared/hooks/usePlaySync.ts
import { useEffect } from "react";
import { useSocketStore } from "@/app/store/socketStore";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useGlobalStore } from "@/app/store/globalStore";

export function usePlaySync(spaceId: string) {
  const stompClient = useSocketStore((state) => state.stompClient);
  const clientId = useGlobalStore((state) => state.clientId);
  const setCurrentMeasure = useScoreStore((state) => state.setCurrentMeasure);
  const setScorePlaying = useScoreStore((state) => state.setIsPlaying);
  const setGlobalPlaying = useGlobalStore((state) => state.setIsPlaying);

  useEffect(() => {
    if (!stompClient || !spaceId) return;

    stompClient.onConnect = () => {
      console.log("📡 Subscribing to /topic/play/session/", spaceId);

      stompClient.subscribe(`/topic/play/session/${spaceId}`, (msg) => {
        const data = JSON.parse(msg.body);
        if (data.sender === clientId) return;

        console.log("📥 [received] synced play message", data);
        setCurrentMeasure(data.currentMeasure);
        setScorePlaying(data.playing);
        setGlobalPlaying(data.playing);
      });
    };

    if (!stompClient.connected) {
      stompClient.activate();
    }
  }, [stompClient, spaceId, clientId]);
}
