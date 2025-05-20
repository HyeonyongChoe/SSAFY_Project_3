import { useUserStore } from "@/features/user/model/useUserStore";
import { useGlobalStore } from "@/app/store/globalStore";
import { useSocketStore } from "@/app/store/socketStore";
import { InstrumentDropdown } from "@/features/instrument/ui/InstrumentDropdown";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { useHeaderFooterStore } from "@/app/store/headerFooterStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export function EnsembleRoomHeader() {
  const { avatarUrl } = useUserStore();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const isPlaying = useGlobalStore((state) => state.isPlaying);
  const { showHeaderFooter } = useHeaderFooterStore();
  const { disconnectWithCleanup, setSpaceId, spaceId } = useSocketStore();

  const currentSpaceId = String(roomId ?? "unknown");

  // 컴포넌트 마운트 시 spaceId를 store에 저장
  useEffect(() => {
    if (currentSpaceId && currentSpaceId !== "unknown") {
      setSpaceId(currentSpaceId);
      console.log("🎯 [Header] spaceId를 store에 설정:", currentSpaceId);
    }
  }, [currentSpaceId, setSpaceId]);

  const handleExit = async () => {
    console.log("🚪 [EXIT] 합주방 나가기 시도");
    console.log("🟡 store의 spaceId:", spaceId);

    // socketStore의 disconnectWithCleanup 사용
    await disconnectWithCleanup();

    console.log("⏪ [EXIT] 이전 화면으로 이동");
    navigate(-1);
  };

  const handleEdit = () => alert("악보 수정 기능 준비 중!");

  if (isPlaying && !showHeaderFooter) return null;

  return (
    <header
      onClick={(e) => e.stopPropagation()}
      className="w-full fixed top-0 h-16 z-50 flex items-center justify-between px-4 bg-[#2E3153]/70 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1E90FF] flex items-center justify-center">
            <img
              src={avatarUrl || "/placeholder.svg"}
              className="w-5 h-5 object-cover"
              alt="User avatar"
            />
          </div>
          <span className="text-sm font-medium text-white ml-1">
            SSAFY toGether
          </span>
          <div className="flex mx-1">
            <Icon icon="chevron_right" tone="white" size={18} />
          </div>
          <div className="bg-white rounded px-1 flex items-center h-6">
            <InstrumentDropdown className="text-black font-medium text-xs border-none outline-none h-full leading-none py-0 my-0" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleEdit}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/20 transition-all"
        >
          <Icon icon="draw" tone="white" size={24} />
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
