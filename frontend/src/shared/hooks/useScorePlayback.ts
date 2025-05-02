// shared/hooks/useScorePlayback.ts
import { useRef } from "react"

export function useScorePlayback(onBeat: (measureIndex: number) => void) {
  const audioCtx = useRef<AudioContext | null>(null)

  const start = () => {
    audioCtx.current = new AudioContext()
    const interval = setInterval(() => {
      const nextMeasure = Math.floor(Math.random() * 5)
      onBeat(nextMeasure)
    }, 1000)

    return () => {
      clearInterval(interval)
      audioCtx.current?.close()
    }
  }

  return { start }
}
