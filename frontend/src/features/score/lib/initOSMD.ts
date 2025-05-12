// initOSMD.ts
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export async function initOSMD(
  container: HTMLElement,
  xml: string,
  instrument: string,
  zoom: number
): Promise<OpenSheetMusicDisplay> {
  const osmd = new OpenSheetMusicDisplay(container, {
    autoResize: true,
    drawTitle: false,
    drawPartNames: true,
    backend: "svg",
    drawingParameters: "compact",
  });

  // 악기별 추가 설정…
  if (instrument === "Guitar") {
    osmd.EngravingRules.RenderFingerings = true;
  } else if (instrument === "Drums") {
    osmd.EngravingRules.UseModernPercussionClef = true;
  } else if (instrument === "Piano") {
    osmd.EngravingRules.RenderTwoStaffsPerInstrument = true;
  }

  osmd.EngravingRules.MinimumDistanceBetweenSystems = 40;
  osmd.EngravingRules.StaffDistance = 60;
  osmd.EngravingRules.PageTopMargin = 10;
  osmd.Zoom = zoom;
  osmd.EngravingRules.RenderXMeasuresPerLineAkaSystem = 4;

  await osmd.load(xml);
  try {
    await osmd.render();
  } catch (e) {
    console.warn("[OSMD] render 중 오류 무시:", e);
  }

  // ─── measure 태깅 ─────────────────────────────────────────────
  // g.vf-measure 요소를 전부 찾아서 data-measure-index만 추가
  const measures = container.querySelectorAll<SVGGElement>("g.vf-measure");
  measures.forEach((el, i) => {
    el.setAttribute("data-measure-index", i.toString());
  });
  console.log(`[OSMD] Valid measures tagged: ${measures.length}`);

  // ─── 하이라이트 함수 정의 ───────────────────────────────────
  let lastHighlighted: SVGGElement | null = null;
  function highlightMeasure(index: number) {
    if (lastHighlighted) {
      lastHighlighted.querySelector("rect.highlight-bg")?.remove();
      lastHighlighted.classList.remove("highlighted-measure");
    }
    const sel = container.querySelector<SVGGElement>(
      `g.vf-measure[data-measure-index="${index}"]`
    );
    if (!sel) return;
    const bbox = sel.getBBox();
    const svgNS = sel.ownerSVGElement!.namespaceURI!;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", `${bbox.x}`);
    rect.setAttribute("y", `${bbox.y}`);
    rect.setAttribute("width", `${bbox.width}`);
    rect.setAttribute("height", `${bbox.height}`);
    rect.classList.add("highlight-bg");
    sel.insertBefore(rect, sel.firstChild);
    sel.classList.add("highlighted-measure");
    lastHighlighted = sel;
  }
  // 외부에서 호출할 수 있게 container에 붙여두기
  (container as any).__highlightMeasure = highlightMeasure;

  return osmd;
}
