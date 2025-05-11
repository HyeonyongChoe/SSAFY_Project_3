import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { useInstrumentStore } from "@/features/instrument/model/useInstrumentStore";
import { MeasureTracker } from "./MeasureTracker";

export function ScoreSheetViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { xmlData, setXmlData, setMeasureCount } = useScoreStore();
  const { selected: selectedInstrument } = useInstrumentStore();
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (!xmlData || !containerRef.current) return;

    const osmd = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      drawTitle: false,
      drawPartNames: true,
      backend: "svg",
    });

    // 악기 유형에 따른 EngravingRules 설정
    if (selectedInstrument === "Guitar") {
      osmd.EngravingRules.RenderSingleHorizontalStaffline = false;
      osmd.EngravingRules.TabNoteHeadBorderColor = "#000000";
      osmd.EngravingRules.RenderGuitarFingerings = true;
    } else if (selectedInstrument === "Drums") {
      osmd.EngravingRules.UseModernPercussionClef = true;
      osmd.EngravingRules.ColoringEnabled = true;
    } else if (selectedInstrument === "Piano") {
      osmd.EngravingRules.RenderTwoStaffsPerInstrument = true;
    } else {
      // 기본값: 보컬 등
      osmd.EngravingRules.RenderTwoStaffsPerInstrument = false;
    }

    osmd
      .load(xmlData)
      .then(() => {
        osmd.Zoom = 1.8; // 확대 비율 설정
        osmd.EngravingRules.RenderXMeasuresPerLineAkaSystem = 4; // 한 줄에 4마디 표시
        osmd.render();
        const totalMeasures = osmd?.Sheet?.Measures?.length || 0;
        setMeasureCount(totalMeasures);
      })
      .catch(console.error);
  }, [xmlData, selectedInstrument]);

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

  return (
    <div className="relative w-full h-[calc(100vh-112px)] overflow-auto">
      <div className="mb-2">
        <input type="file" accept=".xml,.musicxml" onChange={handleFileChange} />
        {previewTitle && (
          <p className="text-xs mt-1 text-white/70">📄 {previewTitle}</p>
        )}
      </div>
      <div
        ref={containerRef}
        className="overflow-x-auto w-full bg-white rounded-md"
      />
      <div className="absolute bottom-2 right-2">
        <MeasureTracker />
      </div>
    </div>
  );
}
