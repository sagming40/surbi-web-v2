import { apiClient } from "./client";
import { toSeoulMap } from "./adapters/explore";
import type { SeoulMapResponse } from "@/shared/types";
import type { ExploreOverviewResponseDto } from "./dto/explore";

export async function getSeoulMap(): Promise<SeoulMapResponse> {
  const response = await apiClient.get<ExploreOverviewResponseDto> (
    '/explore/overview', {
      params: {
        level: 'GU'
      }
    }
  );
  return toSeoulMap(response.data);
}
