import { openConfirm } from "@/shared/lib/modal";
import { ButtonBox } from "@/shared/ui/Button";

export const UserSettingModal = () => {
  return (
    <div className="flex flex-col gap-3 px-2 pb-2 pt-3">
      <ButtonBox className="w-full text-left">
        <div className="font-medium">성이름</div>
        <div className="text-neutral500 font-light text-sm">
          email@email.com
        </div>
      </ButtonBox>
      <ButtonBox className="w-full text-left">로그아웃</ButtonBox>
      <div
        onClick={() =>
          openConfirm({
            title: "정말 밴드를 나가시겠습니까?",
            info: "다시 밴드에 들어가기 위해서는 밴드 관리자의 초대가 필요합니다",
            cancelText: "머무르기",
            okText: "탈퇴하기",
            onConfirm: () => console.log("탈퇴 구현 예정"),
            onCancel: () => console.log("취소됨"),
          })
        }
        className="text-right text-sm text-neutral600 px-5 pt-1"
      >
        회원탈퇴
      </div>
    </div>
  );
};
