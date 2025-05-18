// src/pages/PersonalSpace/index.tsx
import { useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { useSocketStore } from "@/app/store/socketStore";
import { useGlobalStore } from "@/app/store/globalStore";

export const PersonalSpacePage = () => {
  const navigate = useNavigate();
  const stompClientRef = useRef<Client | null>(null);
  const setStompClient = useSocketStore((state) => state.setStompClient);

  // ✅ 쿠키에서 JSESSIONID 추출
  const getSessionIdFromCookie = () => {
    const match = document.cookie.match(/JSESSIONID=([^;]+)/);
    return match ? match[1] : null;
  };

  const connectAndEnter = () => {
    if (stompClientRef.current?.connected) {
      console.log("⚠️ 이미 연결된 WebSocket입니다");
      navigate("/room");
      return;
    }

    const clientId = useGlobalStore.getState().clientId;
    const copySheetIds = ["101", "102", "103"];
    const spaceId = "1";
    const sessionId = getSessionIdFromCookie();

    const headers = {
      spaceId,
      userId: String(clientId),
      copySheetIds: copySheetIds.join(","),
      sessionId: sessionId ?? "unknown",
    };

    console.log("📡 WebSocket connectHeaders:", headers);

    const client = new Client({
      brokerURL: import.meta.env.VITE_BROKER_URL,
      reconnectDelay: 5000,
      connectHeaders: headers,
    });

    client.onConnect = () => {
      console.log("✅ WebSocket connected");
      stompClientRef.current = client;
      setStompClient(client);
      navigate("/room");
    };

    client.onStompError = (frame) => {
      console.error("💥 WebSocket error:", frame);
    };

    client.activate();
  };

  const enterWithoutSocket = () => {
    navigate("/room");
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h1 className="text-2xl font-semibold">Personal Space Page</h1>

      <Button onClick={connectAndEnter} className="w-60">
        웹소켓 연결 후 입장
      </Button>

      <Button
        onClick={enterWithoutSocket}
        color="light"
        size="medium"
        className="w-60"
      >
        웹소켓 없이 입장
      </Button>
    </div>
  );
};
