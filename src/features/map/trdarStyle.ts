/**
 * 상권 유형별 색. 지도 레이어와 필터 범례가 같이 쓴다.
 * 채움은 연하게, 선은 같은 계열의 진한 색으로 짝을 지어야 지도 배경 위에서 보인다.
 * 키는 백엔드가 주는 상권 유형 이름 그대로다 (bootstrap.commercialAreaTypes).
 */
export const TRDAR_COLORS: Record<string, { fill: string; stroke: string }> = {
  골목상권: { fill: '#b2f2bb', stroke: '#40c057' }, // 연초록
  발달상권: { fill: '#d0bfff', stroke: '#845ef7' }, // 연보라
  전통시장: { fill: '#ffc9c9', stroke: '#fa5252' }, // 연빨강
  관광특구: { fill: '#ffd43b', stroke: '#9c7a00' }, // 노랑 채움 + 진한 황토 선 (연노랑·주황·청록은 배경/전통시장/행정동과 헷갈려서 교체)
};

/** 목록에 없는 유형이 오면 회색으로 그린다 */
export const TRDAR_FALLBACK = { fill: '#e9ecef', stroke: '#868e96' };

/** 이름 라벨을 띄울 유형. 서울 전체에 몇 곳 안 돼서 라벨이 겹치지 않는다 */
export const TRDAR_LABELED_TYPES = ['관광특구'];
