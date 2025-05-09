import { useUserStore } from "@/features/user/model/useUserStore";
import { InstrumentDropdown } from "@/features/instrument/ui/InstrumentDropdown";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button"; // 폴더 단위 import일 경우

export function EnsembleRoomHeader() {
  const { name, avatarUrl } = useUserStore();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/");
  };

  const handleEdit = () => {
    alert("악보 수정 기능 준비 중!");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      {/* 왼쪽: 유저 프로필 */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">{name}</span>
      </div>

      {/* 가운데: 악기 선택 */}
      <InstrumentDropdown />

      {/* 오른쪽: 버튼 2개 */}
      <div className="flex items-center gap-2">
        <Button color="light" onClick={handleEdit}>
          악보 수정
        </Button>
        <Button color="caution" onClick={handleExit}>
          방 나가기
        </Button>
      </div>
    </header>
  );
}
