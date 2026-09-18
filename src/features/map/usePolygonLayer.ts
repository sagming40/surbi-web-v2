import { useEffect, useRef } from 'react';
import type { GeoJsonGeometry } from '@/shared/types/common';
import { getKakao } from './useKakaoMap';
import { seoulOutlineGeo } from './mock/seoulOutlineGeo';
import { seoulDistrictsGeo } from './mock/seoulDistrictsGeo';
import { seoulDongsGeo } from './mock/seoulDongsGeo';

/**
 * 레이어별 색. 지도 배경(도로·건물)이 알록달록해서 연한 파랑은 묻힌다.
 * 테두리는 진하게, 채움은 옅게 가져가는 편이 잘 보인다.
 */
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

/**
 * GeoJSON 좌표([경도, 위도])를 카카오 LatLng(위도, 경도)로 뒤집는다.
 * 폴리곤 하나가 여러 조각(섬)일 수 있어 조각별 경로 배열을 돌려준다.
 * 구멍(내부 링)은 쓰지 않는다 — 카카오 Polygon 은 path 배열로 구멍을 표현하지만
 * 서울 경계에는 구멍이 없어서 바깥 링만 그린다.
 */
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

/**
 * 폴리곤 위에 이름을 띄우는 말풍선.
 *
 * 폴리곤마다 오버레이를 만들면 425개가 생기므로 하나를 만들어 돌려 쓴다.
 * 커서를 따라다녀야 해서 mousemove 마다 position 만 갈아끼운다.
 */
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
  /** 선택된 자치구. null 이면 자치구 25개를 그린다 */
  guCode: string | null;
  /** 선택된 행정동. 해당 폴리곤만 강조한다 */
  dongCode: string | null;
  onSelectGu: (guCode: string) => void;
  onSelectDong: (dongCode: string) => void;
}

/**
 * 지도 위에 경계 폴리곤을 그린다. 레이어는 셋이다.
 *
 *   서울 외곽선   항상            굵은 테두리, 채움 없음, 클릭 안 받음
 *   자치구 25개   구 미선택 시    연한 채움
 *   행정동        구 선택 시      연한 채움 + 선택한 구의 테두리 유지
 *
 * 무엇을 그릴지는 줌이 아니라 **선택 상태**가 정한다.
 * 확대만 해서는 사용자가 어느 구를 보려는지 알 수 없기 때문이다.
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

    // ── 자치구 레이어 ──
    // 구를 고른 뒤에도 나머지 구를 옅게 깔아둔다. 그래야 지도에서 바로 다른 구로 넘어갈 수 있다.
    // 선택된 구 자리에는 행정동이 더 위(zIndex)에 덮이므로 안쪽 클릭은 동이 가져간다.
    seoulDistrictsGeo.forEach((gu) => {
      const isSelected = gu.guCode === guCode;
      // 선택된 구는 채움을 비운다 — 그 안의 행정동 폴리곤이 그대로 드러나야 하므로.
      // 대신 테두리를 굵은 빨강으로 둘러 눈에 띄게 한다.
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

    // ── 행정동 레이어 ── 구를 고른 뒤에만, 그 구의 동만
    (isDongLevel ? (seoulDongsGeo[guCode as string] ?? []) : []).forEach((dong) => {
      const selected = dong.dongCode === dongCode;
      // 선택된 구 안에서는 파란 채움을 거의 없앤다 — 빨간 구 테두리와 동 경계선만 남기려는 것.
      // 0 으로 두면 폴리곤이 클릭을 못 받으므로 보이지 않을 만큼만 남긴다.
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

    // 다시 그리기 전에 반드시 지운다. 카카오 오버레이는 React 바깥에 붙어서
    // 컴포넌트가 리렌더된다고 알아서 사라지지 않는다 — 안 지우면 계속 쌓인다
    return () => {
      tooltip.hide();
      drawn.forEach((p) => p.setMap(null));
    };
  }, [map, guCode, dongCode]);
}

/**
 * 선택이 바뀌면 그 영역이 화면에 꽉 차도록 지도를 이동·확대한다.
 * 아무것도 선택 안 됐으면 서울 전체로 되돌린다.
 */
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

    // 좌측 패널(340px + 여백)에 가리지 않도록 왼쪽 여백을 크게 준다
    // 인자 순서: top, right, bottom, left
    map.setBounds(bounds, 24, 24, 24, 380);
  }, [map, guCode, dongCode]);
}
