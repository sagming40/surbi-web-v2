import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAreaSelections, useCommercialAreaSelections } from '@/shared/api/useAreas';
import { useBootstrap } from '@/shared/api/useBootstrap';
import { Button } from '@/shared/ui/Button';
import { DataStatusNotice } from '@/shared/ui/DataStatusNotice';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import type { AreaSelectionItem } from '@/shared/types';
import { KakaoMap } from './KakaoMap';
import type { WizardResultNavigationState } from '../WizardPage/wizard.types';

type FilterMenu = 'gu' | 'dong' | 'category' | 'trdar' | null;

interface FilterOption {
  code: string;
  label: string;
}

interface SimulationFilters {
  gu: FilterOption | null;
  dong: FilterOption | null;
  category: FilterOption | null;
  trdar: FilterOption | null;
}

const emptyFilters: SimulationFilters = {
  gu: null,
  dong: null,
  category: null,
  trdar: null,
};

/** 후보 건물 API가 준비되기 전에는 지도 마커 선택을 처리하지 않는다. */
const ignoreCandidateSelection = () => undefined;

/** 위저드에서 전달된 선택값은 화면을 처음 열 때 필터의 기본값으로만 사용한다. */
function createInitialFilters(selection: WizardResultNavigationState['selection'] | undefined): SimulationFilters {
  if (!selection) return emptyFilters;

  return {
    ...emptyFilters,
    gu: { code: selection.area.code, label: selection.area.name },
    category: { code: selection.industry.code, label: selection.industry.name },
  };
}

/** 12 창업 시뮬레이션. 실제 API가 있는 필터 정보와 아직 없는 후보 건물 정보를 분리해 표시한다. */
export default function SimulationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as WizardResultNavigationState | null;
  const wizardSelection = navigationState?.selection;
  // 첫 렌더에서만 위저드 선택값을 적용한다. effect 안에서 setState를 호출하지 않아 불필요한 재렌더를 막는다.
  const [filters, setFilters] = useState<SimulationFilters>(() => createInitialFilters(wizardSelection));
  const [range, setRange] = useState(500);
  const [openMenu, setOpenMenu] = useState<FilterMenu>(null);

  // 실제 백엔드 목록을 각각 캐시한다. 하위 목록은 선택한 자치구 코드를 요청 조건으로 사용한다.
  const { data: bootstrap, isLoading: isCategoryLoading, isError: isCategoryError } = useBootstrap();
  const { data: guAreas, isLoading: isGuLoading, isError: isGuError } = useAreaSelections('GU');
  const { data: dongAreas, isLoading: isDongLoading, isError: isDongError } = useAreaSelections('DONG', filters.gu?.code);
  const { data: commercialAreas, isLoading: isTrdarLoading, isError: isTrdarError } = useCommercialAreaSelections(
    filters.gu?.code,
    filters.dong?.code,
  );

  const categoryOptions = useMemo<FilterOption[]>(
    () => bootstrap?.categoryGroups.flatMap((group) => group.items.map((item) => ({
      code: item.categoryCode,
      label: item.categoryName,
    }))) ?? [],
    [bootstrap],
  );
  // 백엔드가 name 대신 code를 보낸 데이터는 사용자에게 코드로 노출하지 않는다.
  const guOptions = useMemo(() => toReadableOptions(guAreas), [guAreas]);
  const dongOptions = useMemo(() => toReadableOptions(dongAreas), [dongAreas]);
  const trdarOptions = useMemo<FilterOption[]>(
    () => commercialAreas?.filter((item) => item.name !== item.code).map((item) => ({
      code: item.code,
      label: item.name,
    })) ?? [],
    [commercialAreas],
  );

  function selectFilter(menu: Exclude<FilterMenu, null>, item: FilterOption) {
    setFilters((current) => {
      if (menu === 'gu') return { ...current, gu: item, dong: null, trdar: null };
      if (menu === 'dong') return { ...current, dong: item, trdar: null };
      return { ...current, [menu]: item };
    });
    setOpenMenu(null);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setRange(500);
    setOpenMenu(null);
  }

  const menuOptions = openMenu === 'gu'
    ? guOptions
    : openMenu === 'dong'
      ? dongOptions
      : openMenu === 'category'
        ? categoryOptions
        : openMenu === 'trdar'
          ? trdarOptions
          : [];
  const loadingMenu = openMenu === 'gu'
    ? isGuLoading
    : openMenu === 'dong'
      ? isDongLoading
      : openMenu === 'category'
        ? isCategoryLoading
        : openMenu === 'trdar'
          ? isTrdarLoading
          : false;
  const currentScope = filters.trdar?.label ?? filters.dong?.label ?? filters.gu?.label ?? '지역 선택 전';

  return (
    <main className="min-h-screen overflow-hidden bg-[#edf0ed] text-text">
      <header className="relative z-30 flex h-14 items-center border-b border-border bg-white px-5 shadow-sm">
        <button type="button" className="mr-6 text-headline font-extrabold tracking-tight text-navy" onClick={() => navigate('/report', { state: navigationState })}>
          Surbi
        </button>
        <nav className="relative hidden items-center gap-2 md:flex" aria-label="창업 시뮬레이션 필터">
          <FilterButton label={filters.gu?.label ?? '자치구'} active={openMenu === 'gu'} onClick={() => setOpenMenu((menu) => menu === 'gu' ? null : 'gu')} />
          <FilterButton label={filters.dong?.label ?? '행정동'} active={openMenu === 'dong'} disabled={!filters.gu} onClick={() => setOpenMenu((menu) => menu === 'dong' ? null : 'dong')} />
          <FilterButton label={filters.category?.label ?? '업종'} active={openMenu === 'category'} onClick={() => setOpenMenu((menu) => menu === 'category' ? null : 'category')} />
          <FilterButton label={filters.trdar?.label ?? '상권'} active={openMenu === 'trdar'} disabled={!filters.gu} onClick={() => setOpenMenu((menu) => menu === 'trdar' ? null : 'trdar')} />
          <Button variant="outline" className="!h-8 !rounded-md !px-3 !py-0 !text-caption !font-semibold" disabled>
            범위 그리기 준비 중
          </Button>
          {openMenu && (
            <FilterMenuList
              options={menuOptions}
              loading={loadingMenu}
              onSelect={(item) => selectFilter(openMenu, item)}
            />
          )}
        </nav>
        <button type="button" className="ml-auto text-caption text-sub" onClick={resetFilters}>초기화</button>
      </header>

      <section className="relative h-[calc(100vh-3.5rem)] min-h-[650px] overflow-hidden">
        {/* 후보 건물 API가 없으므로 지도에는 실제 카카오맵과 반경만 표시하고 가짜 마커는 만들지 않는다. */}
        <KakaoMap candidates={[]} rangeM={range} selectedId="" onSelect={ignoreCandidateSelection} />

        <SurbiCard className="absolute left-1 top-1 z-20 w-[404px] overflow-hidden rounded-[10px] p-0 shadow-lg">
          <div className="flex min-h-[70px] items-center px-[18px]">
            <div>
              <h1 className="text-body font-bold text-navy">창업 시뮬레이션</h1>
              <p className="mt-1 text-label text-sub">{currentScope} · {filters.category?.label ?? '업종 선택 전'} 기준</p>
            </div>
          </div>

          <div className="bg-[#f9fafc] px-[18px] py-3">
            <div className="flex items-center justify-between text-caption text-sub">
              <span>탐색 반경</span>
              <strong className="font-semibold text-blue">{range}m</strong>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={range}
              onChange={(event) => setRange(Number(event.target.value))}
              className="mt-3 block h-[5px] w-full cursor-pointer accent-blue"
              aria-label="탐색 반경"
            />
            <div className="mt-2 flex justify-between text-label text-sub"><span>100m</span><span>300m</span><span>500m</span><span>1km</span></div>
          </div>

          <div className="space-y-3 px-[18px] py-4">
            {(isCategoryError || isGuError || isDongError || isTrdarError) && (
              <DataStatusNotice status="unavailable">
                필터 정보를 불러오지 못했습니다. 백엔드가 실행 중인지 확인해 주세요.
              </DataStatusNotice>
            )}
            {guAreas && guAreas.length > 0 && guOptions.length === 0 && (
              <DataStatusNotice status="temporary">
                자치구 API가 현재 이름 대신 코드만 제공하고 있어, 지역 선택은 데이터 수정 후 활성화됩니다.
              </DataStatusNotice>
            )}
            <DataStatusNotice status="unavailable">
              조건을 만족하는 후보 건물, 경쟁 매장 수, 예상 매출, 임대료, AI 점수 API는 아직 백엔드에 없습니다. 실제 후보 건물 API가 준비되면 이 영역과 지도 마커를 연결합니다.
            </DataStatusNotice>
          </div>
        </SurbiCard>
      </section>
    </main>
  );
}

/** 코드만 name으로 내려오는 미완성 데이터를 필터 선택지에서 제외한다. */
function toReadableOptions(items: AreaSelectionItem[] | undefined): FilterOption[] {
  return items?.filter((item) => item.name !== item.code).map((item) => ({
    code: item.code,
    label: item.name,
  })) ?? [];
}

function FilterButton({
  label,
  active,
  disabled = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 text-caption font-medium shadow-sm ${active ? 'border-blue bg-blue text-white' : 'border-[#d9dee6] bg-white text-navy'} disabled:cursor-not-allowed disabled:opacity-45`}
    >
      {label}<span aria-hidden="true" className={active ? 'text-white/80' : 'text-sub'}>⌄</span>
    </button>
  );
}

function FilterMenuList({ options, loading, onSelect }: { options: FilterOption[]; loading: boolean; onSelect: (item: FilterOption) => void }) {
  return (
    <SurbiCard className="absolute left-0 top-10 z-40 w-48 overflow-hidden rounded-md p-1 shadow-lg">
      {loading && <p className="px-3 py-2 text-caption text-sub">목록을 불러오는 중입니다.</p>}
      {!loading && options.length === 0 && <p className="px-3 py-2 text-caption text-sub">표시할 데이터가 없습니다.</p>}
      {options.map((item) => (
        <button key={item.code} type="button" onClick={() => onSelect(item)} className="flex w-full rounded px-3 py-2 text-left text-caption text-text hover:bg-[#f1f5fe] hover:text-blue">
          {item.label}
        </button>
      ))}
    </SurbiCard>
  );
}
