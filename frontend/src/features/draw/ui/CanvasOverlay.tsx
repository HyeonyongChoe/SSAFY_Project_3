import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import ColorPicker from "@/features/draw/ui/ColorPicker";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useInstrumentStore } from "@/features/instrument/model/useInstrumentStore";
import { useSocketStore } from "@/app/store/socketStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";

interface CanvasOverlayProps {
  sheetId: number;
  spaceId: string;
  userId: string;
  selectedColor: string;
  isSocketConnected: boolean;
  stompClient: Client | null;

  onColorChange: (color: string) => void;
  isDrawing: boolean;
  isPaletteVisible: boolean;
}

type KonvaCompositeOperation = "source-over" | "destination-out";

type LineData = {
  points: number[];
  color: string;
  mode: KonvaCompositeOperation;
};

export default function CanvasOverlay({
  selectedColor,
  onColorChange,
  isDrawing,
}: CanvasOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [palettePos] = useState({ x: 16, y: 16 });
  const [lines, setLines] = useState<LineData[]>([]);
  const [isEraser, setIsEraser] = useState(false);
  const drawingLine = useRef<LineData | null>(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  const { roomId } = useParams();
  const spaceId = roomId ?? "";
  const stompClient = useSocketStore((s) => s.stompClient);
  const isSocketConnected = useSocketStore((s) => s.isConnected);
  const clientId = useGlobalStore((s) => s.clientId);
  const selectedPart = useInstrumentStore((s) => s.selected);
  const selectedSheets = useScoreStore((s) => s.selectedSheets);

  const currentSheet = selectedSheets.find((s) => s.part === selectedPart);
  const sheetId = currentSheet?.copySheetId;

  useEffect(() => {
    console.log("🎯 selectedPart:", selectedPart);
    console.log("📄 selectedSheets:", selectedSheets);
    console.log("🔍 currentSheet:", currentSheet);
    console.log("🧪 현재 구독 sheetId:", sheetId);
  }, [stompClient, isSocketConnected, sheetId]);

  useEffect(() => {
    const handleShowPalette = () => setShowPalette(true);
    window.addEventListener("show-color-picker", handleShowPalette);
    return () => {
      window.removeEventListener("show-color-picker", handleShowPalette);
    };
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const content =
        document.getElementById("score-container") || document.body;
      setCanvasHeight(content.scrollHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("scroll", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!isDrawing) {
      setShowPalette(false);
    }
  }, [isDrawing]);

  const getTouchPos = (e: any) => {
    const touch = e.evt.touches?.[0];
    if (!touch || !containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY + window.scrollY - rect.top,
    };
  };

  const handleStart = (e: any) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const pos = getTouchPos(e) || stage.getPointerPosition();
    if (!pos) return;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const newLine: LineData = {
      points: [pos.x, pos.y],
      color: isEraser ? "#ffffff" : selectedColor,
      mode: isEraser ? "destination-out" : "source-over",
    };
    drawingLine.current = newLine;
    setLines((prev) => [...prev, newLine]);
  };

  const handleMove = (e: any) => {
    if (!isDrawing || !drawingLine.current) return;

    const stage = e.target.getStage();
    const point = getTouchPos(e) || stage.getPointerPosition();
    if (!point) return;

    drawingLine.current.points.push(point.x, point.y);
    setLines((prev) => [...prev.slice(0, -1), { ...drawingLine.current! }]);

    if (drawingLine.current.points.length % 10 === 0) {
      sendDrawData(drawingLine.current);
    }
  };

  const sendDrawData = (line: LineData) => {
    if (!stompClient || !stompClient.connected || !sheetId) return;

    const drawMessage = {
      sheetId,
      spaceId,
      userId: clientId.toString(),
      color: line.color,
      points: line.points,
      mode: line.mode,
    };

    stompClient.publish({
      destination: "/app/updateDraw",
      body: JSON.stringify(drawMessage),
    });
  };

  const handleEnd = () => {
    if (!isDrawing) return;

    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";

    if (drawingLine.current?.points.length) {
      const finishedLine = { ...drawingLine.current! };
      setLines((prev) => [...prev, finishedLine]);
      sendDrawData(finishedLine);
    }
    drawingLine.current = null;
  };

  useEffect(() => {
    if (!stompClient || !stompClient.connected || !sheetId) return;

    console.log("✅ [Socket] subscribe 실행 조건 충족:", sheetId);

    const drawSub = stompClient.subscribe(
      `/topic/draw/${sheetId}`,
      (message: any) => {
        try {
          const draw: LineData = JSON.parse(message.body);
          console.log("📥 실시간 드로잉 수신:", draw);
          setLines((prev) => [...prev, draw]);
        } catch (err) {
          console.error("❌ 드로잉 메시지 파싱 실패:", err);
        }
      }
    );

    const initSub = stompClient.subscribe(
      `/topic/draw/init/${sheetId}`,
      (message: any) => {
        try {
          const drawArray: LineData[] = JSON.parse(message.body);
          console.log("📥 초기 드로잉 수신:", drawArray);
          setLines((prev) => (prev.length > 0 ? prev : drawArray));
        } catch (err) {
          console.error("❌ 초기 드로잉 메시지 파싱 실패:", err);
        }
      }
    );

    stompClient.publish({
      destination: `/app/getDrawing/${spaceId}/${sheetId}`,
    });

    return () => {
      drawSub.unsubscribe();
      initSub.unsubscribe();
    };
  }, [stompClient?.connected, sheetId, spaceId]);

  if (!sheetId) return null;

  return (
    <div
      ref={containerRef}
      className="overflow-visible touch-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: canvasHeight,
        pointerEvents: isDrawing ? "auto" : "none",
      }}
    >
      {showPalette && (
        <div
          className="fixed z-[100] bg-white rounded-2xl shadow-xl border p-4"
          style={{ top: palettePos.y, left: palettePos.x }}
        >
          <div className="cursor-move font-bold mb-2 text-sm">🎨 팔레트</div>
          <div className="flex items-center gap-3">
            <ColorPicker
              color={selectedColor}
              onChange={onColorChange}
              isVisible={isDrawing}
            />
            <button
              onClick={() => setIsEraser((prev) => !prev)}
              className={`w-10 h-10 text-white font-bold text-sm rounded-full transition-all border-2 ${
                isEraser ? "bg-red-600 border-red-800" : "bg-gray-300"
              }`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Stage
        width={window.innerWidth}
        height={canvasHeight}
        onMouseDown={handleStart}
        onMousemove={handleMove}
        onMouseup={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={isEraser ? 10 : 4}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={line.mode}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
