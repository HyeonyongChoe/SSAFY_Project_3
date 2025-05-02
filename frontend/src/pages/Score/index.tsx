import { useState, useEffect } from 'react'
import { ScoreViewer } from '@/widgets/ScoreViewer/ScoreViewer'
import { ControlPanel } from '@/widgets/ControlPanel/ControlPanel'
import { useNavigate } from 'react-router-dom'

export const ScorePage = () => {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMeasure, setCurrentMeasure] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentMeasure((prev) => {
        console.log('현재 마디:', prev + 1)
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      <ControlPanel
        onPlayToggle={() => setIsPlaying((prev) => !prev)}
        isPlaying={isPlaying}
      />
      <div className="flex justify-end px-4 py-2">
        <button
          onClick={() => navigate('/edit')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          악보 편집하러 가기
        </button>
      </div>
      <ScoreViewer currentMeasure={currentMeasure} />
    </div>
  )
}
