import type { DistrictMapResponse, DongRankingItem } from '@/shared/types/map';
import type { GuCode, MetricValue } from '@/shared/types/common';
import { seoulDongsGeo } from './seoulDongsGeo';

/**
 * 01b 자치구 내 행정동 랭킹 mock.
 *
 * 행정동 목록(코드·이름)은 경계 파일 seoulDongsGeo 에서 그대로 읽는다.
 * 목록을 따로 들고 있으면 경계와 랭킹이 다른 동을 가리키게 되므로 출처를 하나로 뒀다.
 *
 * ⚠️ 지표 수치는 코드로 만든 임의값이다. 실제 데이터가 아니다.
 * /api/map/districts/{guCode} 가 붙으면 이 파일은 통째로 지운다.
 *
 * 수치를 하드코딩하지 않은 이유: 425개 × 지표 4종을 다 적으면 파일이 수천 줄이 된다.
 * 코드에서 결정적으로 생성하므로 새로고침해도 값은 바뀌지 않는다.
 */

/** 문자열 → 0~1. 같은 입력이면 항상 같은 값이 나온다 */
function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function pick(seed: string, min: number, max: number): number {
  return min + (max - min) * hash01(seed);
}

type MetricField = 'storeCount' | 'sales' | 'flowPopulation' | 'residentPopulation';

const FIELDS: MetricField[] = ['storeCount', 'sales', 'flowPopulation', 'residentPopulation'];

/** 행정동 하나의 지표 원시값. rank 는 구 안에서 다시 매긴다 */
interface RawDong {
  dongCode: string;
  dongName: string;
  values: Record<MetricField, number>;
  rates: Record<MetricField, number>;
}

function buildRaw(dongCode: string, dongName: string): RawDong {
  return {
    dongCode,
    dongName,
    values: {
      storeCount: Math.round(pick(dongCode + 'a', 220, 2600)),
      sales: Math.round(pick(dongCode + 'b', 8, 180)) * 10 ** 8,
      flowPopulation: Math.round(pick(dongCode + 'c', 40000, 900000)),
      residentPopulation: Math.round(pick(dongCode + 'd', 5000, 42000)),
    },
    rates: {
      storeCount: Math.round(pick(dongCode + 'e', -60, 90)) / 10,
      sales: Math.round(pick(dongCode + 'f', -80, 140)) / 10,
      flowPopulation: Math.round(pick(dongCode + 'g', -50, 70)) / 10,
      residentPopulation: Math.round(pick(dongCode + 'h', -30, 30)) / 10,
    },
  };
}

/** 자치구 코드로 행정동 랭킹 응답을 만든다. 경계 데이터에 없는 구면 null */
export function getDongMock(guCode: GuCode): DistrictMapResponse | null {
  const geos = seoulDongsGeo[guCode];
  if (!geos) return null;

  const raws = geos.map((g) => buildRaw(g.dongCode, g.dongName));

  // 순위는 지표별로 따로 매긴다 — 서버가 하는 일을 mock 에서 흉내 낸 것
  const rankOf = {} as Record<MetricField, Map<string, number>>;
  FIELDS.forEach((f) => {
    const m = new Map<string, number>();
    [...raws]
      .sort((a, b) => b.values[f] - a.values[f])
      .forEach((r, i) => m.set(r.dongCode, i + 1));
    rankOf[f] = m;
  });

  const metric = (r: RawDong, f: MetricField): MetricValue => ({
    value: r.values[f],
    changeRate: r.rates[f],
    rank: rankOf[f].get(r.dongCode) ?? null,
  });

  const dongRanking: DongRankingItem[] = raws.map((r) => ({
    dongCode: r.dongCode,
    dongName: r.dongName,
    storeCount: metric(r, 'storeCount'),
    sales: metric(r, 'sales'),
    flowPopulation: metric(r, 'flowPopulation'),
    residentPopulation: metric(r, 'residentPopulation'),
  }));

  return {
    quarter: '2026Q1',
    guCode,
    guName: '',
    dongCount: dongRanking.length,
    category: { code: null, name: '전체 업종' },
    dongRanking,
  };
}
