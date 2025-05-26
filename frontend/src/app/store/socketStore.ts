// src/app/store/socketStore.ts
import { create } from "zustand";
import { Client } from "@stomp/stompjs";

type SocketState = {
  stompClient: Client | null;
  spaceId: string | null;
  setStompClient: (client: Client | null) => void;
  setSpaceId: (spaceId: string | null) => void;
  disconnectWithCleanup: () => Promise<void>;
  updatePausedMeasure?: (measure: number) => void; // ✅ 이 줄 추가
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  stompClient: null,
  spaceId: null,

  setStompClient: (client) => {
    set({ stompClient: client });
  },

  setSpaceId: (spaceId) => {
    set({ spaceId });
  },
  updatePausedMeasure: undefined, // 초기엔 undefined로 설정

  isConnected: false,
  setIsConnected: (value) => set({ isConnected: value }),

  disconnectWithCleanup: async () => {
    const { stompClient } = get();

    if (stompClient && stompClient.connected) {
      try {
        // disconnect 메시지 전송 (body 필수, headers 생략 가능)
        stompClient.publish({
          destination: "/app/disconnect",
          body: "", // STOMP에서는 body가 꼭 있어야 함
        });

        // 메시지 전송 여유 시간 확보 (100ms보다 여유롭게)
        await new Promise((resolve) => setTimeout(resolve, 200));

        // WebSocket 연결 종료
        await stompClient.deactivate();

        console.log("✅ [Store] WebSocket 정상 종료됨");
      } catch (error) {
        console.error("❌ [Store] WebSocket 종료 중 오류:", error);
      }
    } else {
      console.warn("⚠️ [Store] 종료 시도: 연결된 stompClient가 없음");
    }

    // 상태 초기화
    set({ stompClient: null, spaceId: null, isConnected: false });
  },
}));
