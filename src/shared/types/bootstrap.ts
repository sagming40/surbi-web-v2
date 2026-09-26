import type { Quarter, CategoryGroup, RankingMetricKey } from './common';

export type CapabilityState = 'READY' | 'PARTIAL' | 'NOT_READY';

export interface Bootstrap {
  latestQuarter: Quarter | null;
  previousQuarter: Quarter | null;
  availableQuarters: Quarter[];
  categoryGroups: CategoryGroup[];
  commercialAreaTypes: string[];
  rankingMetrics: RankingMetricKey[];
  capabilities: {
    buildingDetail: CapabilityState;
    startupAnalysis: CapabilityState;
    mlAnalysis: CapabilityState;
    favorites: CapabilityState;
    auth: CapabilityState;
  };
}
