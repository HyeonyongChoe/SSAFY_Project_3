import { useQuery } from "@tanstack/react-query";
import { getPlayState } from "../services/PlayService";
import { PlayStateResponseDto } from "../types/Play.types";

export const usePlayState = (spaceId?: string) => {
  return useQuery<PlayStateResponseDto, Error>({
    queryKey: ["playState", spaceId],
    queryFn: () => getPlayState(spaceId!),
    enabled: !!spaceId,
  });
};
