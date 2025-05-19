import axiosInstance from "@/shared/api/axiosInstance";
import { PlayStateResponseDto } from "../types/Play.types";

export const fetchPlayState = async (
  spaceId: string
): Promise<PlayStateResponseDto> => {
  const res = await axiosInstance.get<PlayStateResponseDto>(
    `/api/v1/play/state/${spaceId}`
  );
  return res.data;
};
