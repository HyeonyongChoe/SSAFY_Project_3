import { ResponseDto } from "@/shared/types/Response.types";
import { useQuery } from "@tanstack/react-query";
import { SpacePreDto } from "../types/Space.types";
import { getSpaces } from "../services/SpaceService";

export const useSpace = () => {
  return useQuery<ResponseDto<SpacePreDto[]>, Error>({
    queryKey: ["spaces"],
    queryFn: getSpaces,
  });
};
