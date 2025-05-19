import { CopySongDto } from "@/entities/song/types/CopySong.types";
import { SongForm } from "@/entities/song/ui/SongForm";

interface UpdateSongFormProps {
  spaceId?: number;
  song?: CopySongDto;
}

export const UpdateSongForm = ({ spaceId, song }: UpdateSongFormProps) => {
  return <SongForm spaceId={spaceId} song={song} />;
};
