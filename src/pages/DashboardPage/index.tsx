import { useState } from 'react';
import { MOCK_QUARTERS } from '@/shared/mock/quarters';
import { TopNav } from '@/shared/ui/TopNav';
import { DropdownSelect } from '@/shared/ui/DropdownSelect';
import { formatQuarter } from '@/shared/lib/format';
import { useBootstrap } from '@/shared/api/useBootstrap';
import { useDashboard } from '@/shared/api/useDashboard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Skeleton } from '@/shared/ui/Skeleton';
import { DashboardBody } from './components/DashboardBody';
import type { Quarter } from '@/shared/types/common';


/**
 * 03 종합 대시보드.
 *
 * 좌측 컬럼에 자치구 계열(분포 격자 + TOP 10)을 모으고, 우측은 전체 지표와 업종 비교를 둔다.
 * 목업은 TOP 10이 우측 하단이지만, 같은 자치구 데이터를 붙여두는 편이 비교하기 좋다는 의견을 반영했다.
 * 타일 격자는 TOP 10 자리를 내주려고 목업 크기(타일 41px)로 되돌렸다.
 *
 * 헤더는 화면 끝까지 닿아야 하므로 여백은 바깥이 아니라 본문 grid에만 준다.
 */
export default function DashboardPage() {
  const { data: bootstrap } = useBootstrap();

  const [picked, setPicked] = useState<Quarter | null>(null);
  const quarters = bootstrap?.availableQuarters ?? MOCK_QUARTERS;
  const quarter = picked ?? bootstrap?.latestQuarter ?? null;
  const { data, isError } = useDashboard(quarter);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 분기 셀렉터는 대시보드에서만 쓴다. 헤더 자체는 로고·탭만 책임진다 */}
      <TopNav>
        <DropdownSelect
          label="분기 선택"
          options={quarters.map((q) => ({ value: q, label: formatQuarter(q) }))}
          value={quarter}
          onChange={(q) => q && setPicked(q)}
        />
      </TopNav>

      {isError ? (
        <EmptyState message="데이터를 불러올 수 없습니다." />
      ) : !data ? (
        <Skeleton className="h-[calc(100vh-64px)]" />
      ) : (
        <DashboardBody data={data} />
      )}
    </div>
  );
}
