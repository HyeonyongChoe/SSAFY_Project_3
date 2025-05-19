import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSong } from "../services/updateCopySongService";
import { toast } from "@/shared/lib/toast";

interface UseUpdateSongParams {
  spaceId: number;
  songId: number;
  formData: FormData;
}

export const useUpdateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, songId, formData }: UseUpdateSongParams) =>
      updateSong(spaceId, songId, formData),

    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: ["copySong", spaceId] });
      toast.success({
        title: "곡 수정 성공",
        message: "곡이 성공적으로 수정되었습니다.",
      });
    },

    onError: () => {
      toast.error({
        title: "곡 수정 실패",
        message: "곡 수정에 실패했습니다. 다시 시도해주세요.",
      });
    },
  });
};
