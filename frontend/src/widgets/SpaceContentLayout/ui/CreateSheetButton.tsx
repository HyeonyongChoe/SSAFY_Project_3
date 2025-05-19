import { Icon } from "@/shared/ui/Icon";
import { SpaceButtonPanel } from "./SpaceButtonPanel";
import { openModal } from "@/shared/lib/modal";
import { CreateSheetForm } from "@/features/createSheet/ui/CreateSheetForm";
import { toast } from "@/shared/lib/toast";

export const CreateSheetButton = () => {
  return (
    <SpaceButtonPanel
      onClick={() =>
        openModal({
          title: "악보 생성하기",
          info: "유튜브 링크를 입력해서 악보를 생성해 보세요!",
          children: <CreateSheetForm />,
          okText: "생성하기",
          onConfirm: () =>
            toast.warning({
              title: "API 없음",
              message: "아직 API가 연결되지 않았습니다. 연결해주세요.",
            }),
        })
      }
    >
      <div className="flex text-brandcolor200/70">
        <Icon icon="music_note_add" size={40} />
      </div>
      <div className="text-xl font-bold text-brandcolor200">악보 생성하기</div>
    </SpaceButtonPanel>
  );
};
