import { CopySongDto } from "@/entities/song/types/CopySong.types";
import { DeleteSongButton } from "@/features/deleteSong/ui/DeleteSongButton";
import { UpdateSongButton } from "@/features/updateSong/ui/UpdateSongButton";
import { ButtonBox } from "@/shared/ui/Button";

interface NotePopoverProps {
  spaceId: number;
  song?: CopySongDto;
}

export const NotePopover = ({ spaceId, song }: NotePopoverProps) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <UpdateSongButton spaceId={spaceId} song={song} />
      <ButtonBox className="text-left">복제하기</ButtonBox>
      <DeleteSongButton songId={song?.song_id} spaceId={spaceId} />
    </div>
  );
};
