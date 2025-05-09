// 재생 시간과 BPM 기반으로 마디 계산
export function getCurrentMeasureIndex(
    elapsedSeconds: number,
    bpm: number,
    beatsPerMeasure = 4
  ): number {
    const beatDuration = 60 / bpm; // 초/박
    const measureDuration = beatDuration * beatsPerMeasure;
    return Math.floor(elapsedSeconds / measureDuration);
  }
  