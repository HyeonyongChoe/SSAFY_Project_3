import ScoreStage from '@/widgets/ScoreViewer/ScoreStage';
import { useScoreStore } from '@/features/score/store';

const ScorePage = () => {
  const { resetLine, nextLine } = useScoreStore();

  return (
    <div className="h-screen w-full flex flex-col bg-black text-white">
      <header className="h-[60px] bg-[#2c2c3a] flex items-center justify-between px-6">
        <div className="font-bold text-lg">SSAFY toGether</div>
        <select className="bg-white text-black px-2 py-1 rounded">
          <option>Guitar 1</option>
          <option>Drum</option>
        </select>
        <button className="text-red-400 font-semibold">합주 방 나가기</button>
      </header>

      <ScoreStage />

      <footer className="h-[60px] bg-[#2c2c3a] px-6 py-2 flex justify-center items-center gap-4">
        <button onClick={nextLine} className="bg-green-500 px-4 py-2 rounded">다음 줄</button>
        <button onClick={resetLine} className="bg-red-500 px-4 py-2 rounded">처음으로</button>
      </footer>
    </div>
  );
};

export default ScorePage;
