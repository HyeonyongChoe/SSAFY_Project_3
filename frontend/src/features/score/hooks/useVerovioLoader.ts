// src/features/score/hooks/useVerovioLoader.ts
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
          systemMaxPerPage: 2, // 2줄씩 한 페이지
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
          svgAllPages += `<div class="page-wrapper py-16 scroll-mt-10" data-page="${i}">${svg}</div>`;
        }

        store.setThumbnails(thumbs);

        const container = containerRef.current;
        if (container) {
          container.innerHTML = svgAllPages;

          // 마디 수 저장
          const measureElements = container.querySelectorAll("g.measure");
          store.setMeasureCount(measureElements.length);

          // 시스템 정보 저장
          const systemElements = container.querySelectorAll("g.system");
          const systemList: { el: Element; measureIds: number[] }[] = [];
          let globalMeasureIndex = 0;

          systemElements.forEach((systemEl, index) => {
            const measures = Array.from(systemEl.querySelectorAll("g.measure"));
            const measureIds = measures.map(() => globalMeasureIndex++);

            console.log(`📋 [System ${index}] 추출된 measureIds:`, measureIds);

            systemList.push({
              el: systemEl,
              measureIds,
            });
          });

          console.log("🧠 줄 단위 시스템 정보 저장됨:", systemList);
          store.setSystems(systemList);
        }

        cleanup = () => {
          if (container) container.innerHTML = "";
        };

        // BPM 추출
        try {
          const timeMap = toolkit.renderToMIDI();
          const bpmMatch = timeMap?.match(/Tempo="?(\d+)"?/i);
          if (bpmMatch) {
            const parsedBpm = parseInt(bpmMatch[1], 10);
            if (!isNaN(parsedBpm)) {
              store.setBpm(parsedBpm);
              console.log("📥 저장된 BPM:", useScoreStore.getState().bpm);
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