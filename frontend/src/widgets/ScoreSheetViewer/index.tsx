import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { useScoreStore } from "@/features/score/model/useScoreStore";
import { MeasureTracker } from "./MeasureTracker";

export function ScoreSheetViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { xmlData, setXmlData, setMeasureCount } = useScoreStore(); // setXmlData 추가 필요
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (!xmlData || !containerRef.current) return;

    const osmd = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      drawTitle: false,
    });

    osmd
      .load(xmlData)
      .then(() => {
        osmd.render();
        const totalMeasures = osmd?.Sheet?.Measures?.length || 0;
        setMeasureCount(totalMeasures);
      })
      .catch(console.error);
  }, [xmlData]);

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
    <div className="relative">
      <div className="mb-2">
        <input type="file" accept=".xml,.musicxml" onChange={handleFileChange} />
        {previewTitle && <p className="text-xs mt-1 text-white/70">📄 {previewTitle}</p>}
      </div>
      <div ref={containerRef} className="overflow-x-auto w-full" />
      <div className="absolute bottom-2 right-2">
        <MeasureTracker />
      </div>
    </div>
  );
}
