import { apiClient } from "./client";
import { toDistrictMap, toSeoulMap } from "./adapters/explore";
import type { DistrictMapResponse, SeoulMapResponse } from "@/shared/types";
import type { ExploreOverviewResponseDto } from "./dto/explore";



async function fetchOverview(params: { level: 'GU' | 'DONG'; parent_code?: string }): Promise<ExploreOverviewResponseDto> {
  const response = await apiClient.get<ExploreOverviewResponseDto> (
    '/explore/overview', { params }
  );
  return response.data;
}

export async function getSeoulMap(): Promise<SeoulMapResponse> {
  const dto = await fetchOverview({ level: 'GU' });
  return toSeoulMap(dto);
}

export async function getDistrictMap(guCode: string, guName: string): Promise<DistrictMapResponse> {
  const dto = await fetchOverview({ level: 'DONG', parent_code: guCode });
  return toDistrictMap(dto, guName);
}
