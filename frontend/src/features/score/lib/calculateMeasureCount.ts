import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export function calculateMeasureCount(osmd: OpenSheetMusicDisplay): number {
  return osmd?.Sheet?.Measures?.length ?? 0;
}
