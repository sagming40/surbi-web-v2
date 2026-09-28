import { useEffect, useRef } from 'react';
import type { GeoJsonGeometry } from '@/shared/types/common';
import type { DistrictGeo, DongGeo } from '@/shared/types/map';
import { getKakao } from './useKakaoMap';

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
  /** 서울 외곽선. 서버 응답 전에는 undefined */
  outline: GeoJsonGeometry | undefined;
  /** 자치구 경계 25개. 서버 응답 전에는 undefined */
  districts: DistrictGeo[] | undefined;
  /** 선택한 구의 행정동 경계. 구 선택 전이나 서버 응답 전에는 undefined */
  dongs: DongGeo[] | undefined;
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
  const { outline, districts, dongs, guCode, dongCode, onSelectGu, onSelectDong } = options;

  // 콜백이 매 렌더 새로 만들어져도 폴리곤을 다시 그리지 않도록 ref 에 담아 둔다
  const handlers = useRef({ onSelectGu, onSelectDong });
  handlers.current = { onSelectGu, onSelectDong };

  useEffect(() => {
    const kakao = getKakao();
    if (!map || !kakao) return;

    const drawn: any[] = [];
    const tooltip = createTooltip(kakao, map);

    // ── 서울 외곽선 ── 응답이 오기 전에는 건너뛴다
    if (outline) {
      drawn.push(
        ...drawPolygons(kakao, map, outline, {
          strokeWeight: STYLE.outline.weight,
          strokeColor: STYLE.outline.color,
          strokeOpacity: STYLE.outline.opacity,
          strokeStyle: 'solid',
          fillOpacity: 0,
          zIndex: 1,
        }),
      );
    }

    const isDongLevel = Boolean(guCode);

    // ── 자치구 ── 구를 고른 뒤에도 나머지를 옅게 깔아둬야 지도에서 다른 구로 넘어갈 수 있다
    (districts ?? []).forEach((gu) => {
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
    (isDongLevel ? (dongs ?? []) : []).forEach((dong) => {
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
  }, [map, outline, districts, dongs, guCode, dongCode]);
}

/**
 * 지도 위에 떠 있는 패널이 가리는 폭(px). 선택 영역은 이 여백을 뺀 "보이는 영역" 가운데에 온다.
 * - 왼쪽: 랭킹 패널 (left-4 + w-[340px]) + 여유
 * - 오른쪽: 드로어가 열리면 드로어 (right-4 + w-[380px]), 닫혀 있으면 도구 메뉴 (right-4 + w-[150px])
 */
function getPadding(drawerOpen: boolean) {
  return { top: 24, right: drawerOpen ? 420 : 190, bottom: 24, left: 380 };
}

type Padding = ReturnType<typeof getPadding>;

function boundsOf(kakao: any, geometry: GeoJsonGeometry): any {
  const bounds = new kakao.maps.LatLngBounds();
  toPaths(kakao, geometry).forEach((path) => path.forEach((ll) => bounds.extend(ll)));
  return bounds;
}

/** setBounds 를 인자 순서(top, right, bottom, left)대로 부른다 */
function fitBounds(map: any, bounds: any, pad: Padding) {
  map.setBounds(bounds, pad.top, pad.right, pad.bottom, pad.left);
}

/**
 * 후보 영역이 전부 들어가는 줌 레벨 중 가장 큰 값(= 가장 멀리 본 값).
 * 카카오 줌은 정수 단계라서 영역마다 setBounds 를 따로 하면 비슷한 크기라도
 * 어떤 곳은 꽉 차고 어떤 곳은 절반 크기가 된다. 같은 단위끼리는 레벨을 맞춘다.
 * 레벨 계산은 화면 크기에 따라 달라서 미리 정해 둘 수 없다 — setBounds 로 재 본다.
 */
function commonLevel(map: any, kakao: any, candidates: GeoJsonGeometry[], pad: Padding): number {
  let level = 1;
  candidates.forEach((geometry) => {
    fitBounds(map, boundsOf(kakao, geometry), pad);
    level = Math.max(level, map.getLevel());
  });
  return level;
}

/** 영역 중심을 화면 가운데가 아니라 패널을 뺀 "보이는 영역" 가운데에 둔다 */
function centerInVisibleArea(map: any, kakao: any, bounds: any, pad: Padding) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  map.setCenter(
    new kakao.maps.LatLng((sw.getLat() + ne.getLat()) / 2, (sw.getLng() + ne.getLng()) / 2),
  );

  // 지금은 영역 중심이 화면 정중앙에 있다. 보이는 영역의 중심은 (왼쪽 여백 - 오른쪽 여백) / 2 만큼
  // 오른쪽에 있으므로, 지도 중심을 그만큼 반대(왼쪽)로 옮기면 영역이 보이는 영역 가운데로 온다
  const proj = map.getProjection();
  const center = proj.containerPointFromCoords(map.getCenter());
  const shifted = new kakao.maps.Point(
    center.x - (pad.left - pad.right) / 2,
    center.y - (pad.top - pad.bottom) / 2,
  );
  map.setCenter(proj.coordsFromContainerPoint(shifted));
}

interface FitSelectionOptions {
  outline: GeoJsonGeometry | undefined;
  districts: DistrictGeo[] | undefined;
  dongs: DongGeo[] | undefined;
  guCode: string | null;
  dongCode: string | null;
  /** 01c 드로어가 열려 있으면 오른쪽 여백을 드로어 폭만큼 잡는다 */
  drawerOpen: boolean;
}

/**
 * 선택이 바뀌면 그 영역으로 이동·확대한다. 선택이 없으면 서울 전체.
 * 자치구끼리, 같은 구 안의 행정동끼리는 줌 레벨을 맞춰서 선택할 때마다 크기가 들쭉날쭉하지 않게 한다.
 */
export function useFitSelection(map: any, options: FitSelectionOptions) {
  const { outline, districts, dongs, guCode, dongCode, drawerOpen } = options;

  useEffect(() => {
    const kakao = getKakao();
    // 외곽선이 없으면 기준으로 삼을 범위가 없어서 이동하지 않는다
    if (!map || !kakao || !outline) return;

    const pad = getPadding(drawerOpen);

    // 비교 대상: 동을 골랐으면 같은 구의 동 전체, 구를 골랐으면 자치구 전체
    const siblings: { code: string; geometry: GeoJsonGeometry }[] =
      dongCode && guCode
        ? (dongs ?? []).map((d) => ({ code: d.dongCode, geometry: d.geometry }))
        : guCode
          ? (districts ?? []).map((d) => ({ code: d.guCode, geometry: d.geometry }))
          : [];
    const target = siblings.find((s) => s.code === (dongCode ?? guCode));

    // 선택이 없거나 아직 경계가 없으면 서울 전체를 보여 준다
    if (!target) {
      fitBounds(map, boundsOf(kakao, outline), pad);
      return;
    }

    const level = commonLevel(
      map,
      kakao,
      siblings.map((s) => s.geometry),
      pad,
    );
    map.setLevel(level);
    centerInVisibleArea(map, kakao, boundsOf(kakao, target.geometry), pad);
  }, [map, outline, districts, dongs, guCode, dongCode, drawerOpen]);
}
