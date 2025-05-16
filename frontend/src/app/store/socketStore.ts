// src/app/store/socketStore.ts
import { create } from "zustand";
import { Client } from "@stomp/stompjs";

type SocketState = {
  stompClient: Client | null;
  setStompClient: (client: Client) => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  stompClient: null,
  setStompClient: (client) => {
    console.log("✅ [Zustand] stompClient 설정됨:", client); // 콘솔 로그 추가
    set({ stompClient: client });
  },
}));
