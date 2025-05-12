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

  // 1) 파일 읽기
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[FileChange] 파일 선택됨");
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("[FileChange] file.name=", file.name, " size=", file.size);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        console.log("[FileChange] reader.result length:", reader.result.length);
        setXmlData(reader.result);
        setPreviewTitle(file.name);
      }
    };
    reader.readAsText(file);
  };

  // 2) xmlData 바뀌면 OSMD 로드 & 마디 태깅
  useEffect(() => {
    console.log("[Effect:loadXML] xmlData?", xmlData ? "(있음)" : "(없음)");
    if (!xmlData || !containerRef.current) {
      console.log("[Effect:loadXML] early return");
      return;
    }
    const container = containerRef.current;
    console.log("[Effect:loadXML] container 초기화");
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
    console.log("[Effect:loadXML] zoom level:", zoom);

    initOSMD(container, xmlData, selectedInstrument, zoom)
      .then((osmd) => {
        console.log("[initOSMD.then] OSMD ready");
        osmdRef.current = osmd;
        const total = (osmd.Sheet as any).Measures?.length ?? 0;
        console.log("[initOSMD.then] total measures:", total);
        setMeasureCount(total);

        // measure 클릭 리스너
        const els = container.querySelectorAll<SVGGElement>(
          "g[data-measure-index]"
        );
        console.log("[initOSMD.then] tagged elements:", els.length);
        els.forEach((el) => {
          const idx = Number(el.getAttribute("data-measure-index"));
          el.addEventListener("click", () => {
            console.log("[Measure click] idx=", idx);
            setScoreMeasure(idx);
            setPlayerMeasure(idx);
            togglePlay();
          });
        });
      })
      .catch((err) => {
        console.error("[initOSMD] failed:", err);
      });
  }, [
    xmlData,
    selectedInstrument,
    setMeasureCount,
    setScoreMeasure,
    setPlayerMeasure,
    togglePlay,
  ]);

  // 3) 재생 중 자동으로 마디 증가
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = 60000 / bpm;
    const timer = setInterval(() => {
      // 직접 숫자를 넘겨줍니다.
      const next = currentMeasure + 1;
      console.log("[Playback interval] next measure:", next);
      setScoreMeasure(next);
      setPlayerMeasure(next);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, bpm, currentMeasure, setScoreMeasure, setPlayerMeasure]);

  // 4) 하이라이트
  useEffect(() => {
    console.log("[Effect:highlight] currentMeasure=", currentMeasure);
    const container = containerRef.current;
    if (!container) {
      console.log("[Effect:highlight] container 없음");
      return;
    }
    const all = container.querySelectorAll<SVGGElement>(
      "g[data-measure-index]"
    );
    console.log("[Effect:highlight] found tagged measures:", all.length);
    all.forEach((el) => el.classList.remove("highlight"));

    const target = container.querySelector<SVGGElement>(
      `g[data-measure-index="${currentMeasure}"]`
    );
    console.log("[Effect:highlight] target element:", target);
    if (target) target.classList.add("highlight");
  }, [currentMeasure]);

  // 5) 자동 스크롤
  useEffect(() => {
    const sel = `g[data-measure-index="${currentMeasure}"]`;
    console.log("[Effect:scroll] selector=", sel);
    const el = containerRef.current?.querySelector<HTMLElement>(sel);
    console.log("[Effect:scroll] element:", el);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      console.log("[Effect:scroll] scrolled into view");
    }
  }, [currentMeasure]);

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
        style={{
          minHeight: 400,
          maxHeight: "calc(100vh - 100px)",
        }}
      />
      <div className="absolute bottom-2 right-2 z-10">
        <MeasureTracker />
      </div>
    </div>
  );
}
