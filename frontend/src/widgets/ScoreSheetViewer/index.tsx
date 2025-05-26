import React, { useEffect, useRef, useState } from "react";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useMeasureHighlight } from "@/features/score/hooks/useMeasureHighlight";
import { useVerovioLoader } from "@/features/score/hooks/useVerovioLoader";
import { PlayControl } from "@/widgets/PlayControl";
import { usePlaySync } from "@/shared/hooks/usePlaySync";
import { useGlobalStore } from "@/app/store/globalStore";
import { useHeaderFooterStore } from "@/app/store/headerFooterStore";
import { useSocketStore } from "@/app/store/socketStore";
import CanvasOverlay from "@/features/draw/ui/CanvasOverlay";
import { useInstrumentStore } from "@/features/instrument/model/useInstrumentStore";
import axiosInstance from "@/shared/api/axiosInstance";

interface ScoreSheetViewerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ScoreSheetViewer: React.FC<ScoreSheetViewerProps> = ({
  containerRef,
}) => {
  const { isFullscreen, currentMeasure, systems, isPlaying, selectedSheets } =
    useScoreStore();
  const { setShowHeaderFooter } = useHeaderFooterStore();
  const clientId = useGlobalStore((s) => s.clientId);
  const isDrawing = useGlobalStore((s) => s.isDrawing);
  const isSocketConnected = useSocketStore((s) => s.isConnected);
  const stompClient = useSocketStore((state) => state.stompClient);
  const spaceId = useSocketStore((state) => state.spaceId);
  const selectedPart = useInstrumentStore((s) => s.selected);
  const setInstrument = useInstrumentStore((s) => s.setInstrument);
  const hasSelectedSong = useGlobalStore((s) => s.hasSelectedSong);
  const currentSheet = selectedSheets.find((s) => s.part === selectedPart);

  const [selectedColor, setSelectedColor] = useState("#000000");

  usePlaySync(spaceId ?? "");
  useVerovioLoader(containerRef);
  useMeasureHighlight(containerRef);

  const lastSystemIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedPart && selectedSheets.length > 0) {
      setInstrument(selectedSheets[0].part);
    }
  }, [selectedSheets, selectedPart, setInstrument]);

  useEffect(() => {
    const targetSheet = selectedSheets.find((s) => s.part === selectedPart);
    if (hasSelectedSong && targetSheet?.copySheetId && spaceId) {
      const fetchSheetWithDrawing = async () => {
        try {
          const res = await axiosInstance.get(
            `/api/v1/play/sheets/${targetSheet.copySheetId}/with-drawing`,
            { params: { spaceId } }
          );
          console.log("🎨 시트+드로잉 데이터:", res.data);
        } catch (error) {
          console.error("❌ 시트+드로잉 로드 실패:", error);
        }
      };
      fetchSheetWithDrawing();
    }
  }, [hasSelectedSong, selectedPart, selectedSheets, spaceId]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      console.log("🧪 scrollHeight:", container.scrollHeight);
      console.log("🧪 clientHeight:", container.clientHeight);
    }
  }, []);

  useEffect(() => {
  if (!containerRef.current || !isPlaying) return;

  const currentSystemIndex = systems.findIndex((sys) =>
    sys.measureIds.includes(currentMeasure)
  );

  if (currentSystemIndex === -1) return;

  const currentSystem = systems[currentSystemIndex].el as SVGGraphicsElement;
  currentSystem.scrollIntoView({ behavior: "smooth", block: "start" });

  lastSystemIndexRef.current = currentSystemIndex;
}, [isPlaying, currentMeasure, systems]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const systemElements = container.querySelectorAll("g.system");
    if (isPlaying) {
      systemElements.forEach((el) => el.classList.add("dimmed"));
    } else {
      systemElements.forEach((el) => el.classList.remove("dimmed"));
    }
    const currentSystemIndex = systems.findIndex((sys) =>
      sys.measureIds.includes(currentMeasure)
    );
    if (currentSystemIndex === -1) return;
    const currentSystem = systems[currentSystemIndex].el as SVGGraphicsElement;
    if (isPlaying) currentSystem.classList.remove("dimmed");
    if (
      isPlaying &&
      lastSystemIndexRef.current !== currentSystemIndex &&
      lastSystemIndexRef.current !== null
    ) {
      currentSystem.scrollIntoView({ behavior: "smooth", block: "start" });
      lastSystemIndexRef.current = currentSystemIndex;
    }
    if (!isPlaying) {
      lastSystemIndexRef.current = null;
    }
  }, [currentMeasure, systems, isPlaying]);

  const handleTouch = () => {
    if (!isPlaying) return;
    setShowHeaderFooter((prev) => !prev);
  };

  return (
    <div
      className={`relative w-full flex-1 overflow-hidden ${
        isFullscreen ? "bg-black" : "bg-white"
      }`}
      onClick={handleTouch}
    >
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto scroll-smooth"
      >
        <div className="relative">
          <div className="h-[20px]" />
          <div id="verovio-container" />

          {isDrawing && currentSheet && (
            <CanvasOverlay
              selectedColor={selectedColor}
              isPaletteVisible={isDrawing}
              onColorChange={setSelectedColor}
              isDrawing={true}
              sheetId={currentSheet.copySheetId}
              spaceId={spaceId ?? ""}
              userId={clientId.toString()}
              stompClient={stompClient}
              isSocketConnected={isSocketConnected}
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-4">
        <PlayControl />
      </div>
    </div>
  );
};

export default ScoreSheetViewer;
