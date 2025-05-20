import { useMutation } from "@tanstack/react-query";
import { UrlRequestDto } from "../types/createSheet.types";
import { requestCreateSheet } from "../services/createSheetService";
import { toast } from "@/shared/lib/toast";

interface UseCreateSheetParams {
  spaceId: number;
}

export const useCreateSheet = ({ spaceId }: UseCreateSheetParams) => {
  return useMutation({
    mutationFn: (data: UrlRequestDto) => requestCreateSheet(spaceId, data),
    onSuccess: () => {
      toast.success({
        title: "악보 생성 성공",
        message: "유튜브 링크로부터 악보를 성공적으로 생성했습니다.",
      });
    },
    onError: () => {
      toast.error({
        title: "악보 생성 실패",
        message: "링크가 올바른지 확인해주세요.",
      });
    },
  });
};
