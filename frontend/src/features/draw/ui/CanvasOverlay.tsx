import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import ColorPicker from "@/features/draw/ui/ColorPicker";

interface CanvasOverlayProps {
  sheetId: number;
  spaceId: string;
  userId: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
  isSocketConnected: boolean;
  stompClient: Client | null;
}

export default function CanvasOverlay({
  sheetId,
  spaceId,
  userId,
  selectedColor,
  onColorChange,
  isSocketConnected,
  stompClient,
}: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [palettePos, setPalettePos] = useState({ x: 16, y: 16 });
  const paletteRef = useRef<HTMLDivElement>(null);
  const clientIdRef = useRef<string>(crypto.randomUUID());
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = () => {
      setShowPalette(true);
    };
    window.addEventListener("show-color-picker", handler);
    return () => window.removeEventListener("show-color-picker", handler);
  }, []);

  const getRelativeCoords = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const drawDot = (x: number, y: number, color = "black") => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const canvas = canvasRef.current!;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * canvas.width, y * canvas.height, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!drawing) return;
    const { x, y } = getRelativeCoords(e);
    drawDot(x, y, selectedColor);

    stompClient?.publish({
      destination: "/app/updateDraw",
      body: JSON.stringify({
        spaceId,
        copySheetId: sheetId,
        relativeX: x,
        relativeY: y,
        color: selectedColor,
        sender: clientIdRef.current,
        erase: false,
      }),
    });
  };

  useEffect(() => {
    if (!stompClient || !isSocketConnected) return;

    const subscription = stompClient.subscribe(
      `/topic/draw/${sheetId}`,
      (msg) => {
        const data = JSON.parse(msg.body);
        if (data.sender === clientIdRef.current) return;
        drawDot(data.relativeX, data.relativeY, data.color || "red");
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, isSocketConnected, sheetId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = () => setDrawing(true);
    const onMouseUp = () => setDrawing(false);

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [drawing, selectedColor]);

  // 드래그 핸들 전용
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - palettePos.x,
      y: e.clientY - palettePos.y,
    };

    const handleMove = (moveEvent: MouseEvent) => {
      if (!draggingRef.current) return;
      setPalettePos({
        x: moveEvent.clientX - offsetRef.current.x,
        y: moveEvent.clientY - offsetRef.current.y,
      });
    };

    const handleEnd = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {showPalette && (
        <div
          ref={paletteRef}
          className="fixed z-[100] bg-white rounded shadow-lg border"
          style={{ top: palettePos.y, left: palettePos.x }}
        >
          <div
            className="cursor-move bg-gray-100 px-3 py-1 rounded-t font-medium text-sm select-none"
            onMouseDown={handleDragStart}
          >
            🎨 팔레트 이동
          </div>
          <ColorPicker color={selectedColor} onChange={onColorChange} />
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={1000}
        height={1200}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
