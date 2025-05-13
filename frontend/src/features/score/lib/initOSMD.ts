import { OpenSheetMusicDisplay, CursorOptions } from "opensheetmusicdisplay";

export async function initOSMD(
  container: HTMLElement,
  xml: string,
  instrument: string,
  zoom: number
): Promise<OpenSheetMusicDisplay> {
  console.log("[initOSMD] 시작 -------------------");
  console.log("[initOSMD] container:", container);
  console.log("[initOSMD] instrument:", instrument);
  console.log("[initOSMD] zoom:", zoom);

  const osmd = new OpenSheetMusicDisplay(container, {
    autoResize: true,
    drawTitle: false,
    drawPartNames: true,
    backend: "svg",
    drawingParameters: "compact",
  });

  // 악기별 설정
  if (instrument === "Guitar") {
    osmd.EngravingRules.RenderFingerings = true;
    console.log("[initOSMD] 기타 설정 적용됨");
  } else if (instrument === "Drums") {
    osmd.EngravingRules.UseModernPercussionClef = true;
    console.log("[initOSMD] 드럼 설정 적용됨");
  } else if (instrument === "Piano") {
    osmd.EngravingRules.RenderTwoStaffsPerInstrument = true;
    console.log("[initOSMD] 피아노 설정 적용됨");
  }

  osmd.EngravingRules.MinimumDistanceBetweenSystems = 40;
  osmd.EngravingRules.StaffDistance = 60;
  osmd.EngravingRules.PageTopMargin = 10;
  osmd.Zoom = zoom;
  osmd.EngravingRules.RenderXMeasuresPerLineAkaSystem = 4;

  console.log("[initOSMD] XML 로딩 시작");
  await osmd.load(xml);
  console.log("[initOSMD] XML 로딩 완료");

  console.log("[initOSMD] 렌더링 시작");
  await osmd.render();
  console.log("[initOSMD] 렌더링 완료");

  const cursor = osmd.cursor;
  if (!cursor) {
    console.error("[initOSMD] ❌ 커서가 생성되지 않았습니다.");
    throw new Error("OSMD 커서 초기화 실패");
  }

  console.log("[initOSMD] 커서 reset 및 show 실행");
  cursor.reset();
  console.log("[initOSMD] 커서 현재 위치 정보:", {
    Hidden: cursor.Hidden,
    IteratorIndex: cursor.Iterator?.CurrentVisibleVoiceEntries,
    CursorNotes: cursor.NotesUnderCursor?.length,
  });

  // @ts-ignore: private 접근 무시
  cursor.cursorOptions = {
    type: 3,
    color: "#ffcc00",
    alpha: 0.6,
    follow: true,
  };

  cursor.show();
  cursor.update();

  console.log("[initOSMD] 커서 show + update 후 상태:", {
    Hidden: cursor.Hidden,
    CursorNotes: cursor.NotesUnderCursor?.length,
  });

  const cursorElement = container.querySelector("g.cursor");
  if (cursorElement) {
    console.log("[initOSMD] ✅ 커서 SVG 요소가 DOM에 존재합니다.");
  } else {
    console.warn("[initOSMD] ⚠️ 커서 SVG 요소가 DOM에 존재하지 않습니다.");
  }

  return osmd;
}
