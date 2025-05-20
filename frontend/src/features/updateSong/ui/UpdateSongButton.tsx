import { openModal } from "@/shared/lib/modal";
import { toast } from "@/shared/lib/toast";
import { ButtonBox } from "@/shared/ui/Button";
import { UpdateSongForm } from "./UpdateSongForm";
import { useUpdateSong } from "../hooks/useUpdateCopySong";
import { CopySongDto } from "@/entities/song/types/CopySong.types";

interface UpdateSongButtonProps {
  spaceId: number;
  song?: CopySongDto;
}

export const UpdateSongButton = ({ spaceId, song }: UpdateSongButtonProps) => {
  const updateMutation = useUpdateSong();

  const handleConfirm = (formData: FormData) => {
    if (!song?.song_id) {
      toast.error({
        title: "수정 실패",
        message: "수정할 곡이 선택되지 않았습니다.",
      });
      return;
    }
    updateMutation.mutate({ spaceId, songId: song.song_id, formData });
  };

  return (
    <ButtonBox
      className="text-left"
      disabled={updateMutation.isPending}
      onClick={() =>
        openModal({
          title: "악보 수정하기",
          children: <UpdateSongForm song={song} />,
          okText: "수정하기",
          onConfirm: () => {
            const formData = new FormData(); // 실제로는 UpdateSongForm에서 받아와야 함
            handleConfirm(formData);
          },
        })
      }
    >
      수정하기
    </ButtonBox>
  );
};
