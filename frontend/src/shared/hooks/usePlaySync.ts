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

    const subscribeToPlay = () => {
      console.log("📡 Subscribing to /topic/play/session/", spaceId);

      stompClient.subscribe(`/topic/play/session/${spaceId}`, (msg) => {
        console.log("📥 [raw message]", msg.body); // 원본 출력

        try {
          const data = JSON.parse(msg.body);
          console.log("📥 [parsed message]", data);
          console.log(
            "👤 sender:",
            data.sender,
            "📀 playing:",
            data.playing,
            "🎵 currentMeasure:",
            data.currentMeasure
          );

          if (data.sender === clientId) {
            console.log("⏩ [skip] 내 메시지라 무시함");
            return;
          }

          console.log("✅ [apply] 다른 사용자의 재생 상태 적용");
          setCurrentMeasure(data.currentMeasure);
          setScorePlaying(data.playing);
          setGlobalPlaying(data.playing);
        } catch (e) {
          console.error("❌ JSON 파싱 에러:", e);
        }
      });
    };

    if (stompClient.connected) {
      subscribeToPlay();
    } else {
      stompClient.onConnect = () => {
        subscribeToPlay();
      };
      stompClient.activate();
    }
  }, [stompClient, spaceId, clientId]);
}
