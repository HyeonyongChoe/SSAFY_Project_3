import axiosInstance from "@/shared/api/axiosInstance";
import { CreateBandRequest, CreateBandResponse } from "../types/createBand.types";

export const createBandApi = async (
  data: CreateBandRequest
): Promise<CreateBandResponse> => {
  const hasImage = !!data.image;

  let body: FormData | string;
  const headers: Record<string, string> = {};

  if (hasImage && data.image) {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("image", data.image);
    body = formData;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({
      name: data.name,
      description: data.description,
    });
  }

  // ✅ 임시 유저 ID — 나중에 Zustand 등에서 가져올 것
  headers["X-USER-ID"] = "1";

  const response = await axiosInstance.post<CreateBandResponse>(
    "/api/v1/spaces",
    body,
    { headers }
  );

  return response.data;
};
