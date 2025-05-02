import { useEffect, useRef, useState } from "react"
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"
import { useScoreStore } from "@/app/store/scoreStore"
import { highlightMeasure } from "@/shared/lib/highlightUtils"

export function ScoreViewer({ currentMeasure }: { currentMeasure?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null)
  const [musicXML, setMusicXML] = useState("")
  const { selectMeasure, measureNotes } = useScoreStore()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setMusicXML(text)
    console.log("📄 파일 업로드 완료. XML 길이:", text.length)
  }

  useEffect(() => {
    if (!containerRef.current || !musicXML) return

    console.log("⏳ OSMD 초기화 시작")

    // 임시로 먼저 load
    const tempOSMD = new OpenSheetMusicDisplay(containerRef.current)
    tempOSMD.load(musicXML).then(() => {
      const maxMeasureCount = tempOSMD.Sheet?.SourceMeasures?.length || 0
      console.log("🎼 총 마디 수:", maxMeasureCount)

      const breakPoints: number[] = []
      for (let i = 5; i <= maxMeasureCount; i += 4) {
        breakPoints.push(i)
      }
      console.log("📐 줄 바꿈 위치:", breakPoints)

      // 두 번째 OSMD에 줄 바꿈 설정 포함
      osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
        backend: "svg",
        drawTitle: true,
        autoResize: true,
        newSystemFromMeasureNumber: breakPoints,
      })

      osmdRef.current.load(musicXML).then(() => {
        console.log("✅ OSMD 렌더링 시작")
        osmdRef.current?.render()

        const svg = containerRef.current?.querySelector("svg")
        svg?.querySelectorAll(".measure").forEach((el, index) => {
          const note = measureNotes[index]
          if (note) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
            text.setAttribute("x", "10")
            text.setAttribute("y", "20")
            text.setAttribute("fill", "red")
            text.textContent = note
            el.appendChild(text)
          }

          el.addEventListener("click", () => {
            selectMeasure(index)
            highlightMeasure(index)
          })
        })

        // 1초 후 Y 좌표 콘솔로 확인
        setTimeout(() => {
          const ys = Array.from(document.querySelectorAll(".vf-measure")).map((el) =>
            Math.round((el as SVGGElement).getBBox().y)
          )
          console.log("📏 렌더링된 마디 Y 좌표 목록:", ys)
        }, 1000)
      })
    })
  }, [musicXML, measureNotes])

  useEffect(() => {
    if (currentMeasure !== undefined) {
      console.log("🎯 하이라이트 대상 마디:", currentMeasure)
      highlightMeasure(currentMeasure)
    }
  }, [currentMeasure])

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".musicxml,.xml"
        onChange={handleFile}
        className="mb-2"
      />
      <div ref={containerRef} className="w-full" />
    </div>
  )
}
