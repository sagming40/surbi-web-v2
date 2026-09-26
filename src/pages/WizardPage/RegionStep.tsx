import { useEffect, useMemo, useRef, useState } from 'react';

import type { DistrictGeo } from '@/shared/types';

import { getDistricts } from './wizard.api';
import { getDistrictDisplayName } from './wizard.presenter';
import { wizardRegionStyles } from './wizard.styles';

interface RegionStepProps {
  query: string;
  region: DistrictGeo | null;
  onQueryChange: (value: string) => void;
  onRegionChange: (value: DistrictGeo) => void;
}

export function RegionStep({ query, region, onQueryChange, onRegionChange }: RegionStepProps) {
  // 이 컴포넌트 안에서만 필요한 서버 목록과 로딩 상태다.
  // 사용자가 고른 지역은 부모(WizardPage)가 관리해 다음 단계에서도 유지한다.
  const [districts, setDistricts] = useState<DistrictGeo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const regionRef = useRef(region);

  // 비동기 응답이 도착할 때 최신 선택값을 참조할 수 있게 effect에서 갱신한다.
  useEffect(() => { regionRef.current = region; }, [region]);

  useEffect(() => {
    let cancelled = false;

    // API 모듈을 통해 목록을 받는다. 화면은 mock인지 실제 서버인지 알 필요가 없다.
    getDistricts().then((response) => {
      // 페이지를 이미 벗어난 뒤 도착한 응답은 상태에 반영하지 않는다.
      if (cancelled) return;
      setDistricts(response.districts);
      setIsLoading(false);

      // 처음 진입했을 때만 첫 지역을 기본 선택한다.
      if (!regionRef.current && response.districts[0]) onRegionChange(response.districts[0]);
    });

    return () => { cancelled = true; };
  // ref로 최신 선택값을 읽어, 기본값 설정 후 같은 목록을 다시 요청하지 않는다.
  // onRegionChange는 부모의 useState setter라 렌더 사이에 동일한 함수다.
  }, [onRegionChange]);

  // API 응답 원본은 유지하고, 사용자가 입력한 검색어로 화면에서만 필터링한다.
  const filteredDistricts = useMemo(() => districts.filter((district) => getDistrictDisplayName(district).includes(query.trim())), [districts, query]);

  return <>
    <StepTitle accent={'어느 지역구에서\n'}>창업하시는지 알려주세요.</StepTitle>
    <label className={wizardRegionStyles.search}>
      <span aria-hidden="true">⌕</span>
      <input value={query} onChange={(event) => onQueryChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-body font-medium text-text outline-none" aria-label="창업 지역 검색" />
      <button type="button" aria-label="검색어 지우기" onClick={() => onQueryChange('')} className="text-xl leading-none">×</button>
    </label>
    {/* 로딩·빈 결과·목록 상태를 한 곳에서 처리한다. */}
    <div className="mt-5" aria-live="polite">
      {isLoading && <p className="py-6 text-body text-sub">지역 목록을 불러오는 중입니다.</p>}
      {!isLoading && filteredDistricts.map((district) => <button key={district.guCode} type="button" onClick={() => onRegionChange(district)} className={`${wizardRegionStyles.result} ${region?.guCode === district.guCode ? wizardRegionStyles.resultSelected : wizardRegionStyles.resultDefault}`}>{getDistrictDisplayName(district)}</button>)}
      {!isLoading && filteredDistricts.length === 0 && <p className="py-6 text-body text-sub">검색 결과가 없습니다.</p>}
    </div>
    <p className="mt-4 text-body text-sub">또는 지금 위치 <button type="button" className="font-bold text-blue">인천시 미추홀구에서 시작</button></p>
  </>;
}

function StepTitle({ accent, children }: { accent: string; children: string }) {
  return <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text"><span className="text-blue">{accent}</span>{children}</h1>;
}
