import { fetchPlayState } from "../api/PlayApi";
import { PlayStateResponseDto } from "../types/Play.types";

export const getPlayState = async (
  spaceId: string
): Promise<PlayStateResponseDto> => {
  try {
    return await fetchPlayState(spaceId);
  } catch (error) {
    console.error("Failed to get play state", error);
    throw error;
  }
};
