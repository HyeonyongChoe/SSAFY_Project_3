// src/pages/PersonalSpace/index.tsx
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { useSocketStore } from "@/app/store/socketStore";

export const PersonalSpacePage = () => {
  const navigate = useNavigate();
  const stompClientRef = useRef<Client | null>(null);
  const setStompClient = useSocketStore((state) => state.setStompClient);

  const connectAndEnter = () => {
    // ✅ 중복 연결 방지
    if (stompClientRef.current?.connected) {
      console.log("⚠️ 이미 연결된 WebSocket입니다");
      navigate("/room");
      return;
    }

    const client = new Client({
      brokerURL: import.meta.env.VITE_BROKER_URL,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ WebSocket connected");
      stompClientRef.current = client;
      setStompClient(client); // ✅ 전역 저장
      navigate("/room"); // ✅ 연결 완료 후 이동
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
