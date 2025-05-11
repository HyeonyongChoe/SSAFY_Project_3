import { Icon } from "@/shared/ui/Icon";

export function BpmControlButton() {
  const bpm = 145; // 상태 연동 예정
  return (
    <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-neutral800 hover:bg-neutral700 text-sm">
      <Icon icon="settings" size={18} />
      <span>{bpm}bpm</span>
    </button>
  );
}