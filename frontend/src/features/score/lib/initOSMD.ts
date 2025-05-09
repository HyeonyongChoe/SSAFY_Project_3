import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export function initOSMD(container: HTMLElement): OpenSheetMusicDisplay {
  return new OpenSheetMusicDisplay(container, {
    autoResize: true,
    drawTitle: false,
  });
}
