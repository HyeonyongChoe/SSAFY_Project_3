import { Icon } from "@/shared/ui/Icon";
import { SpaceButtonPanel } from "../../../widgets/SpaceContentLayout/ui/SpaceButtonPanel";

export const CreateSheetButton = () => {
  return (
    <SpaceButtonPanel>
      <div className="flex text-brandcolor200/70">
        <Icon icon="music_note_add" size={40} />
      </div>
      <div className="text-xl font-bold text-brandcolor200">악보 생성하기</div>
    </SpaceButtonPanel>
  );
};
