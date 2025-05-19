import { usePlayState } from "@/entities/play/hooks/usePlay";
import { IconButton } from "@/shared/ui/Icon";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const TestPlaywithPage = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const clientIdRef = useRef<string>("1");

  const { data: playStateData, isSuccess } = usePlayState(spaceId);

  // 초기 상태 가져오기
  useEffect(() => {
    if (isSuccess && playStateData) {
      setIsPlaying(playStateData.playing);
    }
  }, [isSuccess, playStateData]);

  // socket 연결 및 구독
  useEffect(() => {
    if (!spaceId) return;

    const client = new Client({
      brokerURL: import.meta.env.VITE_BROKER_URL,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("WebSocket connected");

      // 에러 메시지
      client.subscribe(`/topic/errors/${clientIdRef.current}`, (msg) => {
        const error = JSON.parse(msg.body);
        alert(`에러 발생: ${error.error.message}`);
      });

      // 재생 상태
      client.subscribe(`/topic/play/session/${spaceId}`, (msg) => {
        const message = JSON.parse(msg.body);
        if (message.sender === clientIdRef.current) return;

        setIsPlaying(message.playing);
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [spaceId]);

  const sendPlayState = (state: boolean) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) return;

    // 현재 이 message const는 playing을 제외하고는 테스트용 더미데이터가 들어가고 있습니다
    // 정말 사용할 때는 실제 연결 페이지에 맞게 바꿔야 합니다
    const message = {
      spaceId: spaceId,
      bpm: 120,
      startTimestamp: Date.now(),
      playing: state,
      measureMap: {},
      sender: clientIdRef.current, //userId
    };

    stompClientRef.current.publish({
      destination: "/app/play/start",
      body: JSON.stringify(message),
    });
  };

  return (
    <>
      <h1>합주방 테스트 페이지</h1>
      <p>재생 상태: {isPlaying ? "재생중" : "정지됨"}</p>
      <p className="flex justify-center gap-3">
        <IconButton
          onClick={() => sendPlayState(true)}
          icon="play_arrow"
          size={36}
          fill
        />
        <IconButton
          onClick={() => sendPlayState(false)}
          icon="stop"
          size={36}
          fill
        />
      </p>
    </>
  );
};
