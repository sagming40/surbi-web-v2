import type { BuildingDetailMock } from '@/features/building/BuildingDetailPanel/types';

export const buildingMock: BuildingDetailMock = {
  buildingId: 'BLD_11680_000182',
  buildingName: '강남파이낸스빌딩',
  roadAddress: '서울특별시 강남구 테헤란로 152',
  lotAddress: '서울특별시 강남구 역삼동 737',
  location: { lat: 37.5006, lng: 127.0366 },

  stores: [
    { storeId: 'S001', name: '스타벅스 역삼점', categoryLargeCode: 'Q', categoryLargeName: '음식', categoryCode: 'CS100008', categoryName: '커피-음료', floor: '1',
      roadAddress: '서울특별시 강남구 테헤란로 152 (역삼동)', openedDate: '201803', closedDate: null },

    { storeId: 'S002', name: '김밥천국', categoryLargeCode: 'Q', categoryLargeName: '음식', categoryCode: 'CS100001', categoryName: '한식음식점', floor: '1',
      roadAddress: '서울특별시 강남구 테헤란로 152 (역삼동)', openedDate: '201111', closedDate: null },

    { storeId: 'S003', name: '역삼우동', categoryLargeCode: 'Q', categoryLargeName: '음식', categoryCode: 'CS100003', categoryName: '일식음식점', floor: 'B1',
      roadAddress: '서울특별시 강남구 테헤란로 152 지하1층 (역삼동)', openedDate: '202105', closedDate: '202409' },

    { storeId: 'S004', name: 'GS25 역삼점', categoryLargeCode: 'D', categoryLargeName: '소매', categoryCode: 'CS300001', categoryName: '편의점', floor: '1',
      roadAddress: '서울특별시 강남구 테헤란로 152 (역삼동)', openedDate: '201607', closedDate: null },

    { storeId: 'S005', name: '올리브영', categoryLargeCode: 'D', categoryLargeName: '소매', categoryCode: 'CS300012', categoryName: '화장품', floor: '2',
      roadAddress: '서울특별시 강남구 테헤란로 152 2층 (역삼동)', openedDate: '201912', closedDate: null },

    { storeId: 'S006', name: '강남헤어샵', categoryLargeCode: 'F', categoryLargeName: '서비스', categoryCode: 'CS200001', categoryName: '미용실', floor: '3',
      roadAddress: '서울특별시 강남구 테헤란로 152 3층 (역삼동)', openedDate: '201402', closedDate: null },

    { storeId: 'S007', name: '테헤란필라테스', categoryLargeCode: 'F', categoryLargeName: '서비스', categoryCode: 'CS200015', categoryName: '스포츠클럽', floor: '5',
      roadAddress: '서울특별시 강남구 테헤란로 152 5층 (역삼동)', openedDate: '202203', closedDate: null },

    { storeId: 'S008', name: '역삼약국', categoryLargeCode: 'F', categoryLargeName: '서비스', categoryCode: 'CS200020', categoryName: '약국', floor: '1',
      roadAddress: '서울특별시 강남구 테헤란로 152 (역삼동)', openedDate: '200909', closedDate: null },
  ],

  categoryCounts: [
    { categoryLargeCode: 'Q', categoryLargeName: '음식', count: 3 },
    { categoryLargeCode: 'D', categoryLargeName: '소매', count: 2 },
    { categoryLargeCode: 'F', categoryLargeName: '서비스', count: 3 },
  ],

  dongSummary: {
    quarter: '2026Q1',
    dongCode: '1168010100',
    dongName: '역삼1동',
    sales: 184_600_000_000,
    competitorCount: 412,
    aiScore: 78,
  },
};