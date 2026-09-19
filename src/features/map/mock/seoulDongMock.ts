import type { DistrictMapResponse, DongRankingItem } from '@/shared/types/map';
import type { GuCode, MetricValue } from '@/shared/types/common';
import { seoulDongsGeo } from './seoulDongsGeo';

/**
 * 01b 행정동 랭킹 mock. 동 목록은 경계 파일(seoulDongsGeo)에서 읽어
 * 경계와 랭킹이 어긋나지 않게 한다.
 * ⚠️ 지표는 코드 해시로 만든 임의값. /api/map/districts/{guCode} 가 붙으면 삭제
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

/** rank 는 구 안에서 다시 매긴다 */
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

  // 서버가 하는 일을 흉내 내 지표별로 순위를 따로 매긴다
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
