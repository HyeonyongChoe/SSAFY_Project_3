import { ResponseDto } from "@/shared/types/Response.types";
import { fetchAllSheetsBySpace, SongCategory } from "../api/songApi";

export const getAllSheetsBySpace = async (
  spaceId: string
): Promise<ResponseDto<SongCategory[]>> => {
  try {
    return await fetchAllSheetsBySpace(spaceId);
  } catch (error) {
    console.error("❌ getAllSheetsBySpace 실패:", error);
    throw error;
  }
};
