import { ResponseDto } from "@/shared/types/Response.types";
import { useQuery } from "@tanstack/react-query";
import { SongCategory } from "../api/songApi";
import { getAllSheetsBySpace } from "../services/songService";

export const useAllSheetsBySpace = (spaceId: string) => {
  return useQuery<ResponseDto<SongCategory[]>, Error>({
    queryKey: ["allSheetsBySpace", spaceId],
    queryFn: () => getAllSheetsBySpace(spaceId),
    enabled: !!spaceId,
  });
};
