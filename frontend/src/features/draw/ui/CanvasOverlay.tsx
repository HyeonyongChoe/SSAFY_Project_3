import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import ColorPicker from "@/features/draw/ui/ColorPicker";
import { Icon } from "@/shared/ui/Icon";

interface CanvasOverlayProps {
  sheetId: number;
  spaceId: string;
  userId: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
  isSocketConnected: boolean;
  stompClient: any;
  isDrawing: boolean; // ✅ 추가
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
  const [palettePos, setPalettePos] = useState({ x: 16, y: 16 });
  const paletteRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [lines, setLines] = useState<LineData[]>([]);
  const [isEraser, setIsEraser] = useState(false);
  const drawingLine = useRef<LineData | null>(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

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
      const height = content.scrollHeight;
      console.log("📐 캔버스 높이 측정 (scrollHeight):", height);
      setCanvasHeight(height);
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
    const pos = {
      x: touch.clientX - rect.left,
      y: touch.clientY + window.scrollY - rect.top,
    };
    return pos;
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
      color: selectedColor,
      mode: isEraser ? "destination-out" : "source-over", // ✅ 적용
    };
    drawingLine.current = newLine;
    setLines((prev) => [...prev, newLine]);
  };

  const handleMove = (e: any) => {
    if (!isDrawing || !drawingLine.current) return;

    const stage = e.target.getStage();
    const point = getTouchPos(e) || stage.getPointerPosition();
    if (!point) return;

    drawingLine.current.points = [
      ...drawingLine.current.points,
      point.x,
      point.y,
    ];
    setLines((prev) => [...prev.slice(0, -1), { ...drawingLine.current! }]);
  };

  const handleEnd = () => {
    if (!isDrawing) return;

    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";

    if (drawingLine.current && drawingLine.current.points.length > 0) {
      setLines((prev) => [...prev, { ...drawingLine.current! }]);
    }
    drawingLine.current = null;
  };

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    draggingRef.current = true;
    offsetRef.current = {
      x: clientX - palettePos.x,
      y: clientY - palettePos.y,
    };

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientX
          : (moveEvent as MouseEvent).clientX;
      const moveY =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientY
          : (moveEvent as MouseEvent).clientY;
      if (!draggingRef.current) return;
      setPalettePos({
        x: moveX - offsetRef.current.x,
        y: moveY - offsetRef.current.y,
      });
    };

    const handleEnd = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", handleMove as any);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove as any);
      document.removeEventListener("touchend", handleEnd);
    };

    document.addEventListener("mousemove", handleMove as any);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove as any, {
      passive: false,
    });
    document.addEventListener("touchend", handleEnd);
  };

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
        pointerEvents: isDrawing ? "auto" : "none", // ✅ 드로잉 외에는 패스스루
      }}
    >
      {showPalette && (
        <div
          ref={paletteRef}
          className="fixed z-[100] bg-white rounded-2xl shadow-xl border p-4"
          style={{ top: palettePos.y, left: palettePos.x, touchAction: "none" }}
        >
          <div
            className="cursor-move bg-gray-100 px-3 py-1 rounded-t font-medium text-sm select-none mb-2"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            🎨 팔레트 이동
          </div>
          <div className="flex items-center gap-2">
            <ColorPicker color={selectedColor} onChange={onColorChange} />
            <button
              onClick={() => setIsEraser((prev) => !prev)}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                isEraser
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-black"
              }`}
            >
              <Icon
                icon="pan_tool"
                tone={isEraser ? "light" : "dark"}
                size={20}
              />
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
          width: "100%",
          height: `${canvasHeight}px`,
        }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={4}
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
