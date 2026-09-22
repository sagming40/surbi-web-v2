/**
 * 첫 단계의 시각 표현을 모아 둔 페이지 전용 스타일 토큰이다.
 * 색상·글자 크기는 index.css의 Tailwind 공통 토큰을 사용한다.
 */
export const wizardRegionStyles = {
  search: 'mt-7 flex h-14 items-center gap-3 rounded-xl border border-border px-4 text-sub focus-within:border-blue',
  result: 'block w-full border-b border-border py-6 text-left text-headline font-medium',
  resultSelected: 'text-blue font-bold',
  resultDefault: 'text-text',
} as const;

/** 업종 선택 단계의 Figma 전용 배치. 색상·폰트 토큰은 index.css의 공통 값을 사용한다. */
export const wizardCategoryStyles = {
  // 테두리 색은 선택 상태에서만 지정한다. 기본 색과 선택 색이 동시에 적용되는 것을 막는다.
  card: 'flex min-h-[120px] flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center transition-colors',
  cardSelected: 'border-2 border-blue bg-blue/10 text-blue',
  cardDefault: 'border-border text-text hover:border-blue/50',
  icon: 'mb-3 h-6 w-6 rounded-lg',
  factorPanel: 'mt-6 rounded-2xl bg-surface p-5',
} as const;

/** 매장 크기 선택 카드의 시각 상태. 선택 색과 기본 색을 분리해 충돌을 막는다. */
export const wizardStoreSizeStyles = {
  card: 'flex min-h-[146px] flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center transition-colors',
  cardSelected: 'border-2 border-blue bg-blue/10 text-blue',
  cardDefault: 'border-border text-text hover:border-blue/50',
  icon: 'mb-3 h-6 w-6 rounded-lg',
} as const;

/** 층수 선택 카드의 상태 스타일이다. */
export const wizardFloorStyles = {
  card: 'flex min-h-[96px] flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center transition-colors',
  cardSelected: 'border-2 border-blue bg-blue/10 text-blue',
  cardDefault: 'border-border text-text hover:border-blue/50',
  icon: 'mb-2 h-6 w-6 rounded-lg',
} as const;

/** 직원 수 선택 카드·근무시간 스위치의 상태 스타일이다. */
export const wizardStaffStyles = {
  card: 'flex min-h-[94px] flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center transition-colors',
  cardSelected: 'border-2 border-blue bg-blue/10 text-blue',
  cardDefault: 'border-border text-text hover:border-blue/50',
  icon: 'mb-2 h-6 w-6 rounded-lg',
  legalBadge: 'mt-5 inline-block rounded-lg bg-blue/10 px-2 py-1 text-caption font-bold text-blue',
  hoursSwitch: 'mt-5 flex items-center justify-between rounded-2xl bg-surface px-4 py-5 text-headline font-bold text-text',
} as const;

/** 마지막 확인 표의 레이아웃을 화면 컴포넌트에서 분리한다. */
export const wizardReviewStyles = {
  table: 'mt-10 overflow-hidden rounded-2xl border border-border',
  row: 'grid grid-cols-[116px_1fr] px-6 py-7',
  rowMuted: 'bg-surface',
  rowDefault: 'bg-white',
} as const;
