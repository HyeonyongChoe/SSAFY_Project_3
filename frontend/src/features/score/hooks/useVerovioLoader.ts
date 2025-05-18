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
          scale: 13,
          pageWidth: 2000,
          adjustPageHeight: true,
          spacingLinear: 0.5,
          spacingSystem: 18,
          spacingStaff: 6.5,
          spacingNonLinear: 0,
          breaks: "encoded",
          svgViewBox: true,
          footer: "none",
          header: "none",
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

          // ✅ 색상 정보 디버깅
          const allElements = container.querySelectorAll("svg *");
          console.log(`🎯 SVG 요소 개수: ${allElements.length}`);
          allElements.forEach((el) => {
            const tag = el.tagName;
            const fill = el.getAttribute("fill") || "none";
            const stroke = el.getAttribute("stroke") || "none";
            const styleFill = (el as SVGElement).style.fill || "none";
            const styleStroke = (el as SVGElement).style.stroke || "none";

            console.log(
              `[${tag}] fill=${fill}, stroke=${stroke}, style.fill=${styleFill}, style.stroke=${styleStroke}`
            );
          });

          // 시스템 정보 계산 및 마디 클릭 이벤트 설정
          const systemElements = container.querySelectorAll("g.system");
          let totalHeight = 0;
          const systemList: { el: Element; measureIds: number[] }[] = [];
          let globalMeasureIndex = 0;

          systemElements.forEach((systemEl, index) => {
            const measures = Array.from(systemEl.querySelectorAll("g.measure"));
            const measureIds = measures.map(() => globalMeasureIndex++);

            measures.forEach((el, i) => {
              const measureIndex = measureIds[i];
              el.setAttribute("data-measure-index", String(measureIndex));
              (el as SVGGraphicsElement).style.cursor = "pointer";
              el.addEventListener("click", () => {
                const { isPlaying } = useScoreStore.getState();
                if (isPlaying) return;
                useScoreStore.getState().setCurrentMeasure(measureIndex);
              });
            });

            const bbox = (systemEl as SVGGElement).getBBox();
            console.log(`📐 System ${index}: height=${bbox.height.toFixed(2)}, y=${bbox.y.toFixed(2)}`);
            totalHeight += bbox.height;

            systemList.push({
              el: systemEl,
              measureIds,
            });

            console.log(`📋 [System ${index}] 추출된 measureIds:`, measureIds);
          });

          const avgHeight = totalHeight / systemElements.length;
          console.log(`📊 평균 시스템 높이: ${avgHeight.toFixed(2)}px`);

          const measureElements = container.querySelectorAll("g.measure");
          store.setMeasureCount(measureElements.length);
          store.setSystems(systemList);
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
