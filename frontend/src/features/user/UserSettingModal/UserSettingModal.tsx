import { openConfirm } from "@/shared/lib/modal";

export const UserSettingModal = () => {
  return (
    <div>
      <div>이름과 이메일</div>
      <div>로그아웃</div>
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
      >
        회원탈퇴
      </div>
    </div>
  );
};
