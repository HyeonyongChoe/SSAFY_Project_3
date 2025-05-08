import { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

export const useScoreRenderer = (containerRef: React.RefObject<HTMLDivElement>, xmlPath: string) => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const osmd = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      drawingParameters: 'compacttight',
      backend: 'svg',
    });
    osmdRef.current = osmd;

    osmd.load(xmlPath).then(() => {
      osmd.render();
    });
  }, [xmlPath]);

  return osmdRef;
};