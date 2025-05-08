import { useEffect, useRef, useState } from 'react';
import { useScoreStore } from '@/features/score/store';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

const ScoreStage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const { currentLineIndex, setCurrentLineIndex, resetLine } = useScoreStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const highlightAndScroll = () => {
    const osmd = osmdRef.current;
    const container = containerRef.current;
    if (!osmd || !container) return;

    const systems = osmd.Graphic?.MusicSystems;
    console.log('📐 Found systems:', systems?.length);

    osmd.Graphic?.MeasureList.forEach((measureRow, rowIndex) => {
      measureRow.forEach((measure) => {
        measure.sourceStaffEntries.forEach(entry => {
          entry.graphicalVoiceEntries.forEach(gve => {
            gve.notes.forEach(note => {
              const el = note.graphicalNote.renderingElement as SVGGraphicsElement;
              if (el) {
                el.style.fill = rowIndex === currentLineIndex ? 'rgba(255,255,0,0.5)' : '';
                el.onclick = () => {
                  console.log(`🖱️ Clicked note in line ${rowIndex}`);
                };
              }
            });
          });
        });
      });
    });

    if (systems && systems[currentLineIndex]) {
      const y = systems[currentLineIndex].PositionAndShape.RelativePosition.y;
      console.log(`🎯 Scrolling to line ${currentLineIndex} (y: ${y})`);
      container.scrollTo({ top: y, behavior: 'auto' });
    } else {
      console.warn(`⚠️ No system found for line index ${currentLineIndex}`);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log('📦 Loading MusicXML...');
      const osmd = new OpenSheetMusicDisplay(containerRef.current!, {
        autoResize: true,
        drawingParameters: 'compacttight',
        backend: 'svg',
        pageFormat: 'endless',
        drawTitle: false,
        maxSystemWidth: 700,
      });
      osmdRef.current = osmd;

      await osmd.load('/vocal.musicxml');
      await osmd.render();
      console.log('🎼 OSMD rendered');
      highlightAndScroll();
    };

    init();
  }, []);

  useEffect(() => {
    console.log('🔁 Current line index changed:', currentLineIndex);
    highlightAndScroll();
  }, [currentLineIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-[calc(100vh-120px)] bg-white">
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden"
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isPlaying ? '⏸ 정지' : '▶ 재생'}
        </button>
        <button
          onClick={() => {
            resetLine();
            setIsPlaying(false);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          ⏮ 처음으로
        </button>
      </div>
    </div>
  );
};

export default ScoreStage;
