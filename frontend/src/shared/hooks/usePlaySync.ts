import { useEffect } from "react";
import { useSocketStore } from "@/app/store/socketStore";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { usePlayerStore } from "@/features/player/model/usePlayerStore";

export function usePlaySync(spaceId: string) {
  const stompClient = useSocketStore((state) => state.stompClient);
  const clientId = useGlobalStore((state) => state.clientId);

  const setCurrentMeasure = useScoreStore((state) => state.setCurrentMeasure);
  const setScorePlaying = useScoreStore((state) => state.setIsPlaying);
  const setGlobalPlaying = useGlobalStore((state) => state.setIsPlaying);

  const togglePlay = usePlayerStore((state) => state.togglePlay);

  useEffect(() => {
    if (!stompClient || !spaceId) return;

    let subscription: any;

    const subscribeToPlay = () => {
      const topic = `/topic/play/session/${spaceId}`;
      console.log("📡 구독 시작:", topic);

      subscription = stompClient.subscribe(topic, (msg) => {
        // 메시지 처리 로직 동일
      });
    };

    if (stompClient.connected) {
      subscribeToPlay();
    } else {
      stompClient.onConnect = () => {
        console.log("✅ WebSocket 연결됨 - 구독 시작");
        subscribeToPlay();
      };
      stompClient.activate();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log("🧹 구독 해제:", subscription);
      }
    };
  }, [stompClient, spaceId, clientId]);
}
