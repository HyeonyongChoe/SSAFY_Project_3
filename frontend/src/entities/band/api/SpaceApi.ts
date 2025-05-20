import { ResponseDto } from "@/shared/types/Response.types";
import { SpacePreDto } from "../types/Space.types";
import axiosInstance from "@/shared/api/axiosInstance";

export const fetchSpaces = async (): Promise<ResponseDto<SpacePreDto[]>> => {
  const res = await axiosInstance.get<ResponseDto<SpacePreDto[]>>(
    `/api/v1/spaces/`
  );
  return res.data;
};
