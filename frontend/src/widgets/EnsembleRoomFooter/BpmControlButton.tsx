import { Icon } from "@/shared/ui/Icon";
import { useScoreStore } from "@/features/score/model/useScoreStore"; // ✅ 추가

export function BpmControlButton() {
  const bpm = useScoreStore((state) => state.bpm); // ✅ 상태 연동
  return (
    <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-neutral800 hover:bg-neutral700 text-sm">
      <Icon icon="settings" size={18} />
      <span>{bpm}bpm</span>
    </button>
  );
}
