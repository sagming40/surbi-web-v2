import { useMemo, useState } from 'react';
import { TopNav } from '@/shared/ui/TopNav';
import { useKakaoMap } from '@/features/map/useKakaoMap';
import { useMapScope, SCOPE_LABEL } from '@/features/map/mapScope';
import { usePolygonLayer, useFitSelection } from '@/features/map/usePolygonLayer';
import { RankingPanel, type RankingRow } from '@/features/map/RankingPanel';
import { MapSideMenu, type MapTool } from '@/features/map/MapSideMenu';
import { CategoryFilter } from '@/features/map/CategoryFilter';
import { TrdarFilter } from '@/features/map/TrdarFilter';
import { findCategory } from '@/features/map/mock/categories';
import { seoulMapMock } from '@/features/map/mock/seoulMapMock';
import { getDongMock } from '@/features/map/mock/seoulDongMock';

/** 01 지도 탐색. 헤더 아래를 지도가 채우고 패널들은 그 위에 absolute 로 얹는다 */
export default function MapExplorePage() {
  // 어디를 보는지는 줌이 아니라 이 두 상태가 정한다
  const [guCode, setGuCode] = useState<string | null>(null);
  const [dongCode, setDongCode] = useState<string | null>(null);

  // 우측 메뉴에서 열려 있는 도구. 한 번에 하나만 연다
  const [activeTool, setActiveTool] = useState<MapTool | null>(null);
  const selectTool = (t: MapTool) => setActiveTool((prev) => (prev === t ? null : t));

  // null 이면 전체 업종 (SeoulMapRequest 의 categoryCode)
  const [categoryCode, setCategoryCode] = useState<string | null>(null);
  // 겹쳐 보일 상권 구분. 기본은 전부 꺼둔다
  const [trdarTypes, setTrdarTypes] = useState<string[]>([]);

  const { containerRef, map, error } = useKakaoMap();
  const { level, scope } = useMapScope(map);

  // 폴리곤을 그리고, 선택이 바뀌면 그쪽으로 이동·확대한다
  usePolygonLayer(map, {
    guCode,
    dongCode,
    onSelectGu: (code) => {
      setGuCode(code);
      setDongCode(null);
    },
    onSelectDong: setDongCode,
  });
  useFitSelection(map, guCode, dongCode);

  /**
   * 자치구를 고르기 전에는 자치구 25개(01), 고른 뒤에는 그 구의 행정동(01b).
   * 두 응답의 행이 RankingMetrics 를 공유해서 같은 패널로 그릴 수 있다.
   */
  const dongData = guCode ? getDongMock(guCode) : null;

  const panel = useMemo(() => {
    if (dongData) {
      const rows: RankingRow[] = dongData.dongRanking.map((d) => ({
        ...d,
        code: d.dongCode,
        name: d.dongName,
      }));
      return { rows, unitLabel: '행정동', quarter: dongData.quarter };
    }
    const rows: RankingRow[] = seoulMapMock.districtRanking.map((d) => ({
      ...d,
      code: d.guCode,
      name: d.guName,
    }));
    return { rows, unitLabel: '자치구', quarter: seoulMapMock.quarter };
  }, [dongData]);

  // 필터 목록은 01 응답에 담긴 자치구를 그대로 쓴다 — 별도 조회가 필요 없다
  const guOptions = useMemo(
    () =>
      seoulMapMock.districtRanking
        .map((d) => ({ value: d.guCode, label: d.guName }))
        .sort((a, b) => a.label.localeCompare(b.label, 'ko')),
    [],
  );

  const dongOptions = useMemo(
    () => dongData?.dongRanking.map((d) => ({ value: d.dongCode, label: d.dongName })) ?? [],
    [dongData],
  );

  const guName = guOptions.find((o) => o.value === guCode)?.label;

  return (
    <div className="h-screen bg-white font-sans">
      {/* 지도는 분기 셀렉터를 쓰지 않는다 — 분기는 좌측 패널의 부제로만 표시 */}
      <TopNav />

      <div className="relative h-[calc(100vh-4rem)] w-full">
        <div ref={containerRef} className="h-full w-full" />

        {/* 좌측 랭킹 패널 — 지도 위에 떠 있다.
            래퍼는 위치·최대높이만 잡고, 투명한 부분이 지도 조작을 막지 않게 비워 둔다 */}
        <div className="pointer-events-none absolute top-4 bottom-4 left-4 z-10">
          <RankingPanel
            title={guName ?? '서울시 전체'}
            quarter={panel.quarter}
            unitLabel={panel.unitLabel}
            rows={panel.rows}
            highlightedCode={dongCode ?? guCode}
            onRowClick={(code) => {
              // 자치구 목록에서 누르면 그 구로 들어가고, 행정동 목록에서 누르면 그 동을 고른다
              if (guCode) setDongCode(code);
              else setGuCode(code);
            }}
            guOptions={guOptions}
            selectedGuCode={guCode}
            onSelectGu={(code) => {
              setGuCode(code);
              setDongCode(null); // 구가 바뀌면 동 선택은 버린다
            }}
            dongOptions={dongOptions}
            selectedDongCode={dongCode}
            onSelectDong={setDongCode}
          />
        </div>

        {/* 우측 플로팅 메뉴 + 업종 패널 */}
        <div className="pointer-events-none absolute top-4 right-4 z-10 flex items-start gap-2">
          {activeTool === 'trdar' && (
            <TrdarFilter
              value={trdarTypes}
              onChange={setTrdarTypes}
              onClose={() => setActiveTool(null)}
            />
          )}
          {activeTool === 'category' && (
            <CategoryFilter
              value={categoryCode}
              onChange={setCategoryCode}
              onClose={() => setActiveTool(null)}
            />
          )}
          <MapSideMenu
            active={activeTool}
            onSelect={selectTool}
            categoryLabel={findCategory(categoryCode)?.name}
          />
        </div>

        {/* 임시 확인용 */}
        {map && (
          <div className="absolute right-4 bottom-4 z-10 rounded bg-white/90 px-3 py-1.5 text-caption shadow">
            level {level} · {SCOPE_LABEL[scope]}
          </div>
        )}

        {!map && (
          <div className="absolute inset-0 grid place-items-center bg-white/80 text-body text-sub">
            {error ?? '지도를 불러오는 중…'}
          </div>
        )}
      </div>
    </div>
  );
}
