import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { Badge } from '@/shared/ui/Badge';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { InsightCard } from '@/shared/ui/InsightCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Tabs } from '@/shared/ui/Tabs';
import { SegmentToggle } from '@/shared/ui/SegmentToggle';
import { Skeleton } from '@/shared/ui/Skeleton';
import { RankTable } from '@/shared/ui/RankTable';

// 컴포넌트 확인용 샘플 데이터 (preview 전용 ─ 이외의 코드에선 하드코딩 금지)
const sampleRows = [
  { rank: 1, name: '강남구', sales: '1,240억', change: '+5.2%' },
  { rank: 2, name: '송파구', sales: '892억', change: '+3.8%' },
  { rank: 3, name: '서초구', sales: '811억', change: '+2.1%' },
  { rank: 4, name: '영등포구', sales: '703억', change: '-1.2%' },
];

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-surface p-10 font-sans">
      <header className="mb-10">
        <h1 className="text-title font-bold text-navy">Surbi 컴포넌트 미리보기</h1>
        <p className="text-caption text-sub mt-1">
          shared/ui에 있는 공용 컴포넌트 목록. 새 컴포넌트를 만들면 여기에 추가한다.
        </p>
      </header>
 
      <Section title="준비 중">
        <Button variant="primary">즐겨찾기 저장</Button>
        <Button variant="secondary">나중에</Button>
        <Button variant="outline">PDF 저장</Button>
        <Button variant="primary" disabled>비활성 상태</Button>
      </Section>

      <Section title="Chip">
        <Chip>서울시 전체</Chip>
        <Chip onRemove={() => alert('제거됨')}>성동구 ✕ 가능</Chip>
        <Chip variant="active">한식음식점</Chip>
        <Chip variant="warning">업종 미선택</Chip>
      </Section>

      <Section title="Badge">
        <Badge variant="info">발달상권</Badge>
        <Badge variant="warning">DB 확인 중</Badge>
        <Badge variant="success">우위</Badge>
        <Badge variant="neutral">D-30</Badge>
      </Section>

      <Section title="SurbiCard">
        <SurbiCard className="p-4 w-64">기본 카드</SurbiCard>
        <SurbiCard elevated className="p-4 w-64">그림자 강조 카드</SurbiCard>
      </Section>

      <Section title="InsightCard">
        <InsightCard
          label="분기 매출"
          headline="485억 원 · 전분기 대비 +12.4%"
          note="성동구 17개 동 중 1위"
        />
        <InsightCard
          label="시간대별 결제"
          headline="오후 6~9시에 결제가 가장 몰립니다"
          pending
        />
      </Section>

      <Section title="EmptyState">
        <EmptyState
          message="배후지 데이터가 없습니다"
          description="관광특구 등 일부 지역은 배후지 분석을 제공하지 않습니다"
        />
      </Section>

      <Section title="Tabs">
        <Tabs
          tabs={[
            { label: '요약', content: <p className="text-body">요약 탭 내용</p> },
            { label: '업종', content: <p className="text-body">업종 탭 내용</p> },
            { label: '매출', content: <p className="text-body">매출 탭 내용</p> },
          ]}
        />
      </Section>

      <Section title="SegmentToggle">
        <SegmentToggle options={['점포수', '매출', '유동인구', '주거인구']} defaultIndex={1} />
      </Section>

      <Section title="Skeleton">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-6" />
      </Section>

      <Section title="RankTable">
        <div className="w-96 border border-border rounded-xl overflow-hidden">
          <RankTable
            rows={sampleRows}
            isHighlighted={(row) => row.name === '서초구'}
            onRowClick={(row) => alert(`${row.name} 클릭`)}
            columns={[
              {
                header: '순위',
                width: 'w-8',
                render: (row, i) => (
                  <span className={`text-caption ${i < 3 ? 'text-blue font-bold' : 'text-sub'}`}>
                    {row.rank}
                  </span>
                 ),
               },
               {
                 header: '자치구',
                 render: (row) => <span className="text-body text-text">{row.name}</span>,
               },
               {
                 header: '매출',
                 width: 'w-20',
                 align: 'right',
                 render: (row) => <span className="text-body font-bold text-text">{row.sales}</span>,
               },
               {
                 header: '증감률',
                 width: 'w-16',
                 align: 'right',
                 render: (row) => (
                   <span className={`text-caption font-medium ${row.change.startsWith('+') ? 'text-blue' : 'text-red'}`}>
                     {row.change}
                   </span>
                 ),
               },
            ]}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-headline font-bold text-navy mb-3 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}
