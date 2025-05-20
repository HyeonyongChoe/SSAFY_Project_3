// features/createBand/ui/CreateBandButton.tsx
import { IconButton } from "@/shared/ui/Icon";
import { openModal } from "@/shared/lib/modal";
import { CreateBandForm } from "./CreateBandForm";
import { toast } from "@/shared/lib/toast";
import { BandFormHandle } from "@/entities/band/ui/BandForm";
import { useRef } from "react";

export const CreateBandButton = () => {
  const createBandFormRef = useRef<BandFormHandle>(null);

  const handleConfirm = () => {
    const formData = createBandFormRef.current?.getFormData();
    if (!formData) {
      toast.error({
        title: "폼 데이터 없음",
        message: "밴드 정보를 입력해주세요.",
      });
      return;
    }

    // 여기에 API 호출 또는 로직 처리
    // console.log("밴드 만들기 폼 데이터:");
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    toast.success({
      title: "밴드 만들기 완료",
      message: "API 연결 후 실제 동작이 가능합니다.",
    });
  };

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
          children: <CreateBandForm ref={createBandFormRef} />,
          okText: "만들기",
          onConfirm: handleConfirm,
        })
      }
    />
  );
};
