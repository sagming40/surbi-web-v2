import type { AreaRefDto } from './common';

/** GET /areas?format=selection의 백엔드 원본 응답이다. */
export interface AreaSelectionResponseDto {
  items: Array<AreaRefDto & { parent: AreaRefDto | null }>;
}

/** GET /commercial-areas의 백엔드 원본 응답이다. */
export interface CommercialAreaListResponseDto {
  items: Array<AreaRefDto & {
    type: string | null;
    gu: AreaRefDto | null;
    dong: AreaRefDto | null;
    has_hinterland: boolean;
  }>;
}
