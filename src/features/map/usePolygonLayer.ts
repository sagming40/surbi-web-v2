import { useEffect, useRef } from 'react';
import type { GeoJsonGeometry } from '@/shared/types/common';
import { getKakao } from './useKakaoMap';
import { seoulOutlineGeo } from './mock/seoulOutlineGeo';
import { seoulDistrictsGeo } from './mock/seoulDistrictsGeo';
import { seoulDongsGeo } from './mock/seoulDongsGeo';

/** 지도 배경이 알록달록해서 테두리는 진하게, 채움은 옅게 간다 */
const STYLE = {
  /** 서울 외곽선 — 가장 진하게 */
  outline: { color: '#16233d', weight: 3, opacity: 0.9 },
  /** 자치구·행정동 경계 */
  area: { color: '#1f4bb8', weight: 2, opacity: 0.95 },
  /** 선택된 자치구 테두리 */
  selectedGu: { color: '#f04452', weight: 5, opacity: 1 },
  /** 채움 */
  fill: '#3b6ef3',
} as const;

/** GeoJSON [경도, 위도] → 카카오 LatLng. 조각(섬)별 경로 배열을 돌려준다 */
function toPaths(kakao: any, geometry: GeoJsonGeometry): any[][] {
  const rings =
    geometry.type === 'Polygon'
      ? [(geometry.coordinates as number[][][])[0]]
      : (geometry.coordinates as number[][][][]).map((p) => p[0]);
  return rings.map((ring) => ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng)));
}

/** 경로 여러 조각을 각각 폴리곤으로 만들어 돌려준다 */
function drawPolygons(kakao: any, map: any, geometry: GeoJsonGeometry, opts: object): any[] {
  return toPaths(kakao, geometry).map(
    (path) => new kakao.maps.Polygon({ map, path, ...opts }),
  );
}

/** 지역명 말풍선. 425개를 만들지 않도록 하나를 돌려 쓴다 */
function createTooltip(kakao: any, map: any) {
  const el = document.createElement('div');
  Object.assign(el.style, {
    padding: '4px 9px',
    borderRadius: '6px',
    background: 'rgba(22,35,61,0.9)',
    color: '#fff',
    fontFamily: 'Noto Sans KR, sans-serif',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    // 이게 없으면 말풍선이 커서 아래로 들어가 폴리곤의 mouseout 이 계속 터진다
    pointerEvents: 'none',
  });

  const overlay = new kakao.maps.CustomOverlay({
    content: el,
    xAnchor: 0,
    yAnchor: 1.4,
    zIndex: 10,
  });

  return {
    show(text: string, latLng: any) {
      el.textContent = text;
      overlay.setPosition(latLng);
      overlay.setMap(map);
    },
    move(latLng: any) {
      overlay.setPosition(latLng);
    },
    hide() {
      overlay.setMap(null);
    },
  };
}

interface PolygonLayerOptions {
  /** null 이면 자치구 25개를 그린다 */
  guCode: string | null;
  /** 해당 폴리곤만 강조한다 */
  dongCode: string | null;
  onSelectGu: (guCode: string) => void;
  onSelectDong: (dongCode: string) => void;
}

/**
 * 경계 폴리곤 3층: 서울 외곽선(항상) / 자치구 25개 / 행정동(구 선택 시).
 * 무엇을 그릴지는 줌이 아니라 선택 상태가 정한다.
 */
export function usePolygonLayer(map: any, options: PolygonLayerOptions) {
  const { guCode, dongCode, onSelectGu, onSelectDong } = options;

  // 콜백이 매 렌더 새로 만들어져도 폴리곤을 다시 그리지 않도록 ref 에 담아 둔다
  const handlers = useRef({ onSelectGu, onSelectDong });
  handlers.current = { onSelectGu, onSelectDong };

  useEffect(() => {
    const kakao = getKakao();
    if (!map || !kakao) return;

    const drawn: any[] = [];
    const tooltip = createTooltip(kakao, map);

    // ── 서울 외곽선 ──
    drawn.push(
      ...drawPolygons(kakao, map, seoulOutlineGeo, {
        strokeWeight: STYLE.outline.weight,
        strokeColor: STYLE.outline.color,
        strokeOpacity: STYLE.outline.opacity,
        strokeStyle: 'solid',
        fillOpacity: 0,
        zIndex: 1,
      }),
    );

    const isDongLevel = Boolean(guCode);

    // ── 자치구 ── 구를 고른 뒤에도 나머지를 옅게 깔아둬야 지도에서 다른 구로 넘어갈 수 있다
    seoulDistrictsGeo.forEach((gu) => {
      const isSelected = gu.guCode === guCode;
      // 선택된 구는 채움을 비운다. 안쪽 행정동이 드러나야 하므로
      const base = isSelected ? 0 : isDongLevel ? 0.03 : 0.07;

      drawPolygons(kakao, map, gu.geometry, {
        strokeWeight: isSelected ? STYLE.selectedGu.weight : STYLE.area.weight,
        strokeColor: isSelected ? STYLE.selectedGu.color : STYLE.area.color,
        strokeOpacity: isSelected
          ? STYLE.selectedGu.opacity
          : isDongLevel
            ? 0.4
            : STYLE.area.opacity,
        strokeStyle: 'solid',
        fillColor: STYLE.fill,
        fillOpacity: base,
        zIndex: isSelected ? 3 : 2,
      }).forEach((polygon) => {
        if (isSelected) {
          drawn.push(polygon);
          return;
        }
        kakao.maps.event.addListener(polygon, 'mouseover', (e: any) => {
          polygon.setOptions({ fillOpacity: base + 0.1 });
          tooltip.show(gu.guName, e.latLng);
        });
        kakao.maps.event.addListener(polygon, 'mousemove', (e: any) => tooltip.move(e.latLng));
        kakao.maps.event.addListener(polygon, 'mouseout', () => {
          polygon.setOptions({ fillOpacity: base });
          tooltip.hide();
        });
        kakao.maps.event.addListener(polygon, 'click', () =>
          handlers.current.onSelectGu(gu.guCode),
        );
        drawn.push(polygon);
      });
    });

    // ── 행정동 ── 구를 고른 뒤에만
    (isDongLevel ? (seoulDongsGeo[guCode as string] ?? []) : []).forEach((dong) => {
      const selected = dong.dongCode === dongCode;
      // 채움을 거의 없애 경계선만 남긴다. 0 이면 클릭을 못 받아서 0.02
      const base = selected ? 0.35 : 0.02;

      drawPolygons(kakao, map, dong.geometry, {
        strokeWeight: selected ? STYLE.area.weight + 1 : STYLE.area.weight,
        strokeColor: STYLE.area.color,
        strokeOpacity: STYLE.area.opacity,
        strokeStyle: 'solid',
        fillColor: STYLE.fill,
        fillOpacity: base,
        zIndex: selected ? 5 : 4,
      }).forEach((polygon) => {
        kakao.maps.event.addListener(polygon, 'mouseover', (e: any) => {
          polygon.setOptions({ fillOpacity: base + 0.1 });
          tooltip.show(dong.dongName, e.latLng);
        });
        kakao.maps.event.addListener(polygon, 'mousemove', (e: any) => tooltip.move(e.latLng));
        kakao.maps.event.addListener(polygon, 'mouseout', () => {
          polygon.setOptions({ fillOpacity: base });
          tooltip.hide();
        });
        kakao.maps.event.addListener(polygon, 'click', () =>
          handlers.current.onSelectDong(dong.dongCode),
        );
        drawn.push(polygon);
      });
    });

    // 카카오 오버레이는 React 바깥에 붙어서 직접 지워야 한다. 안 지우면 쌓인다
    return () => {
      tooltip.hide();
      drawn.forEach((p) => p.setMap(null));
    };
  }, [map, guCode, dongCode]);
}

/** 선택된 영역이 꽉 차도록 이동·확대. 선택이 없으면 서울 전체 */
export function useFitSelection(map: any, guCode: string | null, dongCode: string | null) {
  useEffect(() => {
    const kakao = getKakao();
    if (!map || !kakao) return;

    let geometry: GeoJsonGeometry = seoulOutlineGeo;

    if (dongCode && guCode) {
      geometry =
        seoulDongsGeo[guCode]?.find((d) => d.dongCode === dongCode)?.geometry ?? geometry;
    } else if (guCode) {
      geometry = seoulDistrictsGeo.find((d) => d.guCode === guCode)?.geometry ?? geometry;
    }

    const bounds = new kakao.maps.LatLngBounds();
    toPaths(kakao, geometry).forEach((path) => path.forEach((ll) => bounds.extend(ll)));

    // 좌측 패널에 가리지 않게 왼쪽 여백을 크게. 인자 순서: top, right, bottom, left
    map.setBounds(bounds, 24, 24, 24, 380);
  }, [map, guCode, dongCode]);
}
