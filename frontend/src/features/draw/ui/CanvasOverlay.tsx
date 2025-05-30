import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Client } from "@stomp/stompjs";
import ColorPicker from "@/features/draw/ui/ColorPicker";
import { useDrawingStore } from "@/features/draw/model/useDrawingStore";
import { normalizePoint, denormalizePoint } from "@/shared/lib/draw";

interface CanvasOverlayProps {
  sheetId: number;
  spaceId: string;
  userId: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
  isDrawing: boolean;
  isPaletteVisible: boolean;
  stompClient: Client | null;
}

function getMode(erase: boolean): "destination-out" | "source-over" {
  return erase ? "destination-out" : "source-over";
}

export default function CanvasOverlay({
  sheetId,
  spaceId,
  selectedColor,
  onColorChange,
  isDrawing,
  isPaletteVisible,
  stompClient,
}: CanvasOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const drawingLine = useRef<ReturnType<typeof useDrawingStore.getState>["lines"][0] | null>(null);
  const lastReceivedLine = useRef<typeof drawingLine.current>(null);

  const { lines, isEraser, addLine, updateLastLine, toggleEraser } = useDrawingStore();

  useEffect(() => {
    const updateHeight = () => {
      const content = document.getElementById("score-container") || document.body;
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
    if (!pos || !containerRef.current) return;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const newLine = {
      points: [pos.x, pos.y],
      color: isEraser ? "#ffffff" : selectedColor,
      mode: getMode(isEraser),
    };

    drawingLine.current = newLine;
    addLine(newLine);
  };

  const handleMove = (e: any) => {
    if (!isDrawing || !drawingLine.current || !containerRef.current) return;
    const stage = e.target.getStage();
    const point = getTouchPos(e) || stage.getPointerPosition();
    if (!point) return;

    drawingLine.current.points = [...drawingLine.current.points, point.x, point.y];
    updateLastLine({ ...drawingLine.current });

    if (drawingLine.current.points.length % 10 === 0) {
      sendDrawData(drawingLine.current);
    }
  };

  const handleEnd = () => {
    if (!isDrawing || !drawingLine.current || !containerRef.current) return;
    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";

    sendDrawData(drawingLine.current);
    drawingLine.current = null;
  };

  const sendDrawData = (line: typeof drawingLine.current) => {
    if (!line || !stompClient || !stompClient.connected || !sheetId || !containerRef.current) return;
    const points = line.points;
    if (points.length < 4) return;

    for (let i = 2; i < points.length; i += 2) {
      const { relativeX, relativeY } = normalizePoint(points[i], points[i + 1], containerRef.current);
      const drawMessage = {
        spaceId,
        copySheetId: sheetId,
        relativeX,
        relativeY,
        erase: line.mode === "destination-out",
        color: line.color,
      };

      stompClient.publish({
        destination: "/app/updateDraw",
        body: JSON.stringify(drawMessage),
      });
    }
  };

  useEffect(() => {
    if (!stompClient || !stompClient.connected || !sheetId || !spaceId || !containerRef.current) return;

    const drawSub = stompClient.subscribe(`/topic/draw/${sheetId}`, (message: any) => {
      try {
        const draw = JSON.parse(message.body);
        const { x, y } = denormalizePoint(draw.relativeX, draw.relativeY, containerRef.current!);

        if (
          !lastReceivedLine.current ||
          lastReceivedLine.current.color !== draw.color ||
          lastReceivedLine.current.mode !== getMode(draw.erase)
        ) {
          lastReceivedLine.current = {
            points: [x, y],
            color: draw.color,
            mode: getMode(draw.erase),
          };
          addLine(lastReceivedLine.current);
        } else {
          lastReceivedLine.current.points = [...lastReceivedLine.current.points, x, y];
          updateLastLine({ ...lastReceivedLine.current });
        }

        if (lastReceivedLine.current.points.length >= 50) {
          lastReceivedLine.current = null;
        }
      } catch (err) {
        console.error("❌ 드로잉 수신 실패:", err);
      }
    });

    const initSub = stompClient.subscribe(`/topic/draw/init/${sheetId}`, (message: any) => {
      try {
        const drawArray = JSON.parse(message.body);
        drawArray.forEach((point: any) => {
          const { x, y } = denormalizePoint(point.relativeX, point.relativeY, containerRef.current!);
          addLine({
            points: [x, y, x + 0.1, y + 0.1],
            color: point.color,
            mode: getMode(false),
          });
        });
      } catch (err) {
        console.error("❌ 초기 드로잉 수신 실패:", err);
      }
    });

    stompClient.publish({
      destination: `/app/getDrawing/${spaceId}/${sheetId}`,
    });

    return () => {
      drawSub.unsubscribe();
      initSub.unsubscribe();
      lastReceivedLine.current = null;
    };
  }, [stompClient, sheetId, spaceId]);

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
      {isPaletteVisible && (
        <div className="fixed z-[100] bg-white rounded-2xl shadow-xl border p-4" style={{ top: 16, left: 16 }}>
          <div className="cursor-move font-bold mb-2 text-sm">🎨 팔레트</div>
          <div className="flex items-center gap-3">
            <ColorPicker color={selectedColor} onChange={onColorChange} isVisible={isDrawing} />
            <button
              onClick={toggleEraser}
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
        style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.mode === "destination-out" ? 10 : 4}
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
