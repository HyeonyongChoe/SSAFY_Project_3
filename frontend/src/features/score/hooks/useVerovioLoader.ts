// features/score/hooks/useVerovioLoader.ts
import { useEffect, useRef } from "react";
import { VerovioToolkit } from "verovio/esm";
import createVerovioModule from "verovio/wasm";
import { useScoreStore } from "@/features/score/model/useScoreStore";

export function useVerovioLoader(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    async function init() {
      try {
        const VerovioModule = await createVerovioModule({
          locateFile: (path: string) =>
            path.endsWith(".wasm") ? "/verovio/verovio.wasm" : path,
        });

        const toolkit = new VerovioToolkit(VerovioModule);
        toolkit.setOptions({
          scale: 18,
          pageWidth: 3000,
          pageHeight: 2970,
          spacingLinear: 0.5,
          adjustPageHeight: true,
          breaks: "encoded",
          svgViewBox: true,
          footer: "none",
          header: "none",
          spacingNonLinear: 0,
          spacingStaff: 6.5,
        });

        const response = await fetch(
          "https://a205-beatween-bucket.s3.ap-northeast-2.amazonaws.com/sheets/vocal_drum.musicxml"
        );
        const xml = await response.text();

        const store = useScoreStore.getState();
        store.setXmlData(xml);
        toolkit.loadData(xml);

        const pageCount = toolkit.getPageCount();

        let svgAllPages = "";
        const thumbs: string[] = [];

        for (let i = 1; i <= pageCount; i++) {
          const svg = toolkit.renderToSVG(i);
          thumbs.push(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
          svgAllPages += `<div class="page-wrapper" data-page="${i}">${svg}</div>`;
        }

        store.setThumbnails(thumbs);

        const container = containerRef.current;
        if (container) {
          container.innerHTML = svgAllPages;

          // 🔽 여기서 measureCount를 실제 DOM 기준으로 설정
          const measureElements = container.querySelectorAll("g.measure");
          console.log(
            "🛠 measureCount 설정 (DOM 기준):",
            measureElements.length
          );
          store.setMeasureCount(measureElements.length);
        }

        cleanup = () => {
          if (container) container.innerHTML = "";
        };

        try {
          const timeMap = toolkit.renderToMIDI();
          const bpmMatch = timeMap?.match(/Tempo="?(\d+)"?/i);
          if (bpmMatch) {
            const parsedBpm = parseInt(bpmMatch[1], 10);
            if (!isNaN(parsedBpm)) {
              store.setBpm(parsedBpm);
              console.log(
                "📥 store 상태에 저장된 BPM:",
                useScoreStore.getState().bpm
              ); // ✅ 상태 확인
            }
          }
        } catch (err) {
          console.warn("BPM 추출 실패:", err);
        }
      } catch (e) {
        console.error("🔥 Verovio 로드 실패:", e);
      }
    }

    init();

    return () => {
      if (typeof cleanup === "function") cleanup();
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [containerRef]);
}
