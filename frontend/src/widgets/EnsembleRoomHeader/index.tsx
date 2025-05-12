// 📁 src/widgets/EnsembleRoomHeader/index.tsx
import { useUserStore } from "@/features/user/model/useUserStore";
import { InstrumentDropdown } from "@/features/instrument/ui/InstrumentDropdown";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";

export function EnsembleRoomHeader() {
  const { avatarUrl } = useUserStore();
  const navigate = useNavigate();

  const handleExit = () => navigate("/");
  const handleEdit = () => alert("악보 수정 기능 준비 중!");

  return (
    <header className="w-full fixed top-0 h-16 z-50 flex items-center justify-between px-4 bg-[#2E3153] text-white shadow-md">
      <div className="flex items-center gap-3">
        {/* 유저 정보와 드롭다운 */}
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1E90FF] flex items-center justify-center">
            <img src={avatarUrl || "/placeholder.svg"} className="w-5 h-5 object-cover" alt="User avatar" />
          </div>
          <span className="text-sm font-medium text-white ml-1">SSAFY toGether</span>
          <Icon icon="chevron_right" tone="white" size={18} className="mx-1" />
          <div className="bg-white rounded px-1 flex items-center h-6">
            <InstrumentDropdown className="text-black font-medium text-xs border-none outline-none h-full leading-none py-0 my-0" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={handleEdit} className="text-white hover:text-neutral300">
          <Icon icon="edit" tone="white" size={20} />
        </button>
        <Button
          color="light"
          className="!bg-[#FF4D79] !text-white hover:!bg-[#e04e4e] whitespace-nowrap px-3 py-1.5 rounded-md text-sm"
          icon="logout"
          onClick={handleExit}
        >
          합주 방 나가기
        </Button>
      </div>
    </header>
  );
}
