import type { BootstrapResponseDto } from '../dto/bootstrap';
import type { Bootstrap, CategoryGroup } from '@/shared/types';
import { toQuarter, toMetricKey } from '../convert';
import type { IndustryRefDto } from '../dto/common';

const CATEGORY_GROUPS = [
  { groupCode: 'CS1', groupName: '외식업' },
];

function toCategoryGroups(industries: IndustryRefDto[]): CategoryGroup[] {
  return CATEGORY_GROUPS.map(g => ({
    groupCode: g.groupCode,
    groupName: g.groupName,
    items: industries
      .filter(i => i.code.startsWith(g.groupCode))
      .map(i => ({ categoryCode: i.code, categoryName: i.name })),
  }));
}

export function toBootstrap(dto: BootstrapResponseDto): Bootstrap {
  return {
    latestQuarter: dto.latest_period ? toQuarter(dto.latest_period.code) : null,
    previousQuarter: dto.previous_period ? toQuarter(dto.previous_period.code) : null,
    availableQuarters: dto.periods.map(p => toQuarter(p.code)),
    categoryGroups: toCategoryGroups(dto.industries),
    commercialAreaTypes: dto.commercial_area_types,
    rankingMetrics: dto.ranking_metrics.map(m => toMetricKey(m)),
    capabilities: {
      buildingDetail: dto.capabilities.building_detail,
      startupAnalysis: dto.capabilities.startup_analysis,
      mlAnalysis: dto.capabilities.ml_analysis,
      favorites: dto.capabilities.favorites,
      auth: dto.capabilities.auth,
    },
  };
}



