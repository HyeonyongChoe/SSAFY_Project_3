// features/createBand/ui/CreateBandButton.tsx
import { IconButton } from "@/shared/ui/Icon";
import { openModal } from "@/shared/lib/modal";
import { CreateBandForm } from "./CreateBandForm";

export const CreateBandButton = () => {
  return (
    <IconButton
      icon="add_circle"
      tone="light"
      fill
      round="xl"
      onClick={() =>
        openModal({
          title: "밴드 만들기",
          info: "밴드는 동료들과 악보를 공유하는 공간입니다\n이름과 이미지로 밴드의 개성을 드러내 보세요",
          children: <CreateBandForm />,
          okText: "만들기",
          onConfirm: () => console.log("밴드 만들기 구현 예정"),
        })
      }
    />
  );
};
