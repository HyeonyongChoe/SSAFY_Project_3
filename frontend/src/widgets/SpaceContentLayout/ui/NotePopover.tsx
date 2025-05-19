import { ButtonBox } from "@/shared/ui/Button";

export const NotePopover = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <ButtonBox className="text-left">수정하기</ButtonBox>
      <ButtonBox className="text-left">복제하기</ButtonBox>
      <ButtonBox className="text-left">삭제하기</ButtonBox>
    </div>
  );
};
