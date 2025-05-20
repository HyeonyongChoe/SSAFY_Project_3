import { ImageUploadCircle } from "@/shared/ui/ImageCircle";
import { Input } from "@/shared/ui/Input";
import { ItemField } from "@/shared/ui/ItemField";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { CopySongDto } from "../types/CopySong.types";
import { useCategoriesBySpace } from "@/entities/category/hooks/useCategories";
import { Select } from "@/shared/ui/Select";

export interface SongFormHandle {
  getFormData: () => FormData;
}

interface SongFormProps {
  spaceId?: number;
  song?: CopySongDto;
}

export const SongForm = forwardRef<SongFormHandle, SongFormProps>(
  ({ spaceId, song }, ref) => {
    const { data: categoryData, isLoading } = useCategoriesBySpace(
      Number(spaceId)
    );

    const [noteName, setNoteName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
      if (song) {
        setNoteName(song.title);
        setCategoryId(song.category_id);
      }
    }, [song]);

    useImperativeHandle(ref, () => ({
      getFormData() {
        const formData = new FormData();
        formData.append("songName", noteName);
        formData.append(
          "categoryId",
          categoryId !== null ? String(categoryId) : ""
        );
        if (imageFile) formData.append("thumbnail", imageFile);
        return formData;
      },
    }));

    if (categoryData && !categoryData.success)
      return (
        <div className="py-6 text-warning font-bold">
          상정 가능한 범위의 오류 발생: {categoryData.error?.message}
        </div>
      );

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
        <ItemField icon="folder" fill title="카테고리" required>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            disabled={isLoading}
            className="text-neutral1000 rounded-xl w-full"
          >
            <option value="">카테고리를 선택하세요</option>
            {categoryData?.data.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </Select>
        </ItemField>
      </div>
    );
  }
);
