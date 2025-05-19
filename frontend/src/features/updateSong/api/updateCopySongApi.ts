import axiosInstance from "@/shared/api/axiosInstance";
import { ResponseDto } from "@/shared/types/Response.types";
import { UpdateSongRequestDto } from "../types/updateCopySong.types";

export const updateSongApi = async (
  spaceId: number,
  songId: number,
  formData: FormData
): Promise<ResponseDto<UpdateSongRequestDto>> => {
  console.log("호출이 되긴 함?");
  console.log(spaceId);
  console.log(songId);
  console.log(formData);
  const res = await axiosInstance.patch<ResponseDto<UpdateSongRequestDto>>(
    `/api/v1/spaces/${spaceId}/songs/${songId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(res.data);
  return res.data;
};
