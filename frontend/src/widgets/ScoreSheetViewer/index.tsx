// ScoreSheetViewer.tsx
import { useEffect, useRef, useState } from "react";
import { initOSMD } from "@/features/score/lib/initOSMD";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useInstrumentStore } from "@/features/instrument/model/useInstrumentStore";
import { usePlayerStore } from "@/features/player/model/usePlayerStore";
import { MeasureTracker } from "./MeasureTracker";
import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export function ScoreSheetViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  const {
    xmlData,
    setXmlData,
    setMeasureCount,
    currentMeasure,
    setCurrentMeasure: setScoreMeasure,
  } = useScoreStore();
  const { selected: selectedInstrument } = useInstrumentStore();
  const {
    isPlaying,
    bpm,
    setCurrentMeasure: setPlayerMeasure,
    togglePlay,
  } = usePlayerStore();
  const [previewTitle, setPreviewTitle] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setXmlData(reader.result);
        setPreviewTitle(file.name);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!xmlData || !containerRef.current) return;
    console.log("[ScoreSheetViewer] XML 데이터 변경 감지");

    const container = containerRef.current;
    container.innerHTML = "";

    const zoom =
      window.innerWidth >= 1400
        ? 2.0
        : window.innerWidth >= 1200
        ? 1.8
        : window.innerWidth >= 1024
        ? 1.6
        : window.innerWidth >= 768
        ? 1.4
        : 1.2;

    console.log("[ScoreSheetViewer] initOSMD 호출", {
      zoom,
      selectedInstrument,
    });

    initOSMD(container, xmlData, selectedInstrument, zoom)
      .then((osmd) => {
        console.log("[ScoreSheetViewer] initOSMD 완료");

        osmdRef.current = osmd;
        const total = osmd.Sheet?.SourceMeasures?.length ?? 0;
        console.log("[ScoreSheetViewer] 전체 마디 수:", total);
        setMeasureCount(total);

        const measures =
          container.querySelectorAll<SVGGElement>("g.vf-measure");
        console.log("[ScoreSheetViewer] 마디 DOM 요소 수:", measures.length);
        measures.forEach((el, i) => {
          el.style.cursor = "pointer";
          el.onclick = () => {
            console.log(`[ScoreSheetViewer] 마디 ${i} 클릭`);
            setScoreMeasure(i);
            setPlayerMeasure(i);
            togglePlay();
          };
        });
      })
      .catch((err) => {
        console.error("[ScoreSheetViewer] initOSMD 실패:", err);
      });
  }, [
    xmlData,
    selectedInstrument,
    setMeasureCount,
    setScoreMeasure,
    setPlayerMeasure,
    togglePlay,
  ]);
  useEffect(() => {
    if (!osmdRef.current || currentMeasure === undefined) return;
    const cursor = osmdRef.current.cursor;
    if (!cursor) {
      console.warn("[ScoreSheetViewer] 커서 없음");
      return;
    }

    console.log(`[ScoreSheetViewer] 커서 이동 시작 -> 마디 ${currentMeasure}`);
    cursor.reset();
    for (let i = 0; i < currentMeasure; i++) {
      cursor.next();
    }
    cursor.update();
    cursor.show(); // <-- 여기 추가
    console.log("[ScoreSheetViewer] 커서 이동 완료 및 표시됨");
  }, [currentMeasure]);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = 60000 / bpm;
    const timer = setInterval(() => {
      const next = currentMeasure + 1;
      setScoreMeasure(next);
      setPlayerMeasure(next);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, bpm, currentMeasure, setScoreMeasure, setPlayerMeasure]);

  return (
    <div className="relative w-full max-w-screen mx-auto overflow-x-hidden pt-16 min-h-screen">
      {!xmlData && (
        <div className="relative z-10 px-4 pt-24">
          <input
            type="file"
            accept=".xml,.musicxml"
            onChange={handleFileChange}
          />
          {previewTitle && (
            <p className="text-xs mt-1 text-white/70">📄 {previewTitle}</p>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative z-0 w-full overflow-y-auto"
        style={{ minHeight: 400, maxHeight: "calc(100vh - 100px)" }}
      />
      <div className="absolute bottom-2 right-2 z-10">
        <MeasureTracker />
      </div>
    </div>
  );
}
