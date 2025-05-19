import { ImageUploadCircle } from "@/shared/ui/ImageCircle";
import { Input } from "@/shared/ui/Input";
import { ItemField } from "@/shared/ui/ItemField";
import { useEffect, useState } from "react";
import { CopySongDto } from "../types/CopySong.types";

interface SongFormProps {
  song?: CopySongDto;
}

export const SongForm = ({ song }: SongFormProps) => {
  const [noteName, setNoteName] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (song) {
      setNoteName(song.title);
      setCategory(String(song.category_id));
      // 필요한 다른 필드들도 세팅
    }
  }, [song]);

  return (
    <div className="flex flex-col gap-3">
      <div className="self-center mb-2">
        <ImageUploadCircle
          imageUrl={
            imageFile
              ? URL.createObjectURL(imageFile)
              : song?.thumbnail_url || undefined
          }
          alt="곡 이미지"
          onChange={setImageFile}
        />
      </div>
      <ItemField icon="music_note" title="곡 이름" required>
        <Input
          value={noteName}
          onChange={setNoteName}
          placeholder="곡 이름 (ex. 박자로 채우는 우리 사이)"
          maxLength={20}
          showCount={true}
        />
      </ItemField>
    </div>
  );
};
