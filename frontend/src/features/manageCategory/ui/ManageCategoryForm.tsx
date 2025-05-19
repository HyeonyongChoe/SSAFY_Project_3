import { LineBasic } from "@/shared/ui/LineBasic";

export const ManageCategoryForm = () => {
  // 컴포넌트 variant 확인을 위해 둔 임시 폼 내용입니다, 실제 API를 연결해야 합니다
  return (
    <div>
      <LineBasic />
      <LineBasic editable />
      <LineBasic selected />
      <LineBasic selected editable />
      <LineBasic mode="create" />
      <LineBasic mode="create" selected />
    </div>
  );
};
