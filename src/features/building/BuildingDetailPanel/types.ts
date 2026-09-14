import type { BuildingDetailResponse, BuildingStore } from '@/shared/types';

export interface StoreExtra {
  roadAddress: string;
  openedDate: string;
  /** 영업중일시 null */
  closedDate: string | null;
}

export type BuildingStoreMock = BuildingStore & StoreExtra;

export type BuildingDetailMock = Omit<BuildingDetailResponse, 'stores'> & {
  stores: BuildingStoreMock[];
};

