import { CopySongDto } from "@/entities/song/types/CopySong.types";
import { SongForm } from "@/entities/song/ui/SongForm";

interface UpdateSongFormProps {
  song?: CopySongDto;
}

export const UpdateSongForm = ({ song }: UpdateSongFormProps) => {
  return <SongForm song={song} />;
};
