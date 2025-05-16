// src/app/store/socketStore.ts
import { create } from "zustand";
import { Client } from "@stomp/stompjs";

type SocketState = {
  stompClient: Client | null;
  setStompClient: (client: Client) => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  stompClient: null,
  setStompClient: (client) => set({ stompClient: client }),
}));
