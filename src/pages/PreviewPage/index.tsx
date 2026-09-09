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
import { BarChart } from '@/shared/ui/charts/BarChart';
import { ColumnChart } from '@/shared/ui/charts/ColumnChart';
import { TrendChart } from '@/shared/ui/charts/TrendChart';
import { GaugeChart } from '@/shared/ui/charts/GaugeChart';
import { DonutChart } from '@/shared/ui/charts/DonutChart';
import { MultiLineChart } from '@/shared/ui/charts/MultiLineChart';
import { PieChart } from '@/shared/ui/charts/PieChart';
import { TrdarQuickPreview } from '@/features/map/TrdarQuickPreview';

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

      <Section title="BarChart">
        <div className="w-72">
          <BarChart
            data={[
              { label: '유동인구', value: 24, displayValue: '24%' },
              { label: '경쟁업체수', value: 21, displayValue: '21%' },
              { label: '임대료', value: 18, displayValue: '18%' },
            ]}
          />
        </div>
      </Section>

      <Section title="ColumnChart">
        <div className="w-72">
          <ColumnChart
            data={[
              { label: '06-09', value: 12 },
              { label: '09-12', value: 28 },
              { label: '12-15', value: 46 },
              { label: '15-18', value: 39 },
              { label: '18-21', value: 72, highlighted: true },
              { label: '21-24', value: 41 },
            ]}
          />
        </div>
      </Section> 

      <Section title="TrendChart">
        <div className="w-72">
          <TrendChart
            data={[
              { label: '23Q1', value: 320 }, { label: '23Q2', value: 340 },
              { label: '23Q3', value: 310 }, { label: '23Q4', value: 380 },
              { label: '24Q1', value: 400 }, { label: '24Q2', value: 420 },
              { label: '24Q3', value: 450 }, { label: '24Q4', value: 485 },
            ]}
          />
        </div>
        <div className="w-72">
          <TrendChart
            data={[
              { label: '23Q1', value: 320 }, { label: '23Q2', value: 340 },
              { label: '23Q3', value: 310 }, { label: '23Q4', value: 380 },
              { label: '24Q1', value: 400 }, { label: '24Q2', value: 420 },
              { label: '24Q3', value: 450 }, { label: '24Q4', value: 485 },
            ]}
            filled
          />
        </div>
      </Section> 

      <Section title="GaugeChart">
        <GaugeChart score={78} />
        <GaugeChart score={45} />
      </Section> 

      <Section title="DonutChart">
        <DonutChart data={[{ label: '프랜차이즈', value: 41.5 }, { label: '일반', value: 58.5 }]} />
          <DonutChart
            data={[{ label: '일반점포', value: 691 }, { label: '프랜차이즈', value: 152 }]}
            showLegend
          />
        <DonutChart
          data={[{ label: '음식점', value: 38 }, { label: '카페', value: 24 }, { label: '기타', value: 38 }]}
          centerLabel="412개"
        />
      </Section>   

      <Section title="MultiLineChart">
        <div className="w-96">
          <MultiLineChart
            data={[
              { label: "25.2Q", 사근동: 37681, 자치구: 43185, 서울시: 38153 },
              { label: "25.3Q", 사근동: 36428, 자치구: 42683, 서울시: 37485 },
              { label: "25.4Q", 사근동: 39306, 자치구: 43330, 서울시: 37509 },
              { label: "26.1Q", 사근동: 36754, 자치구: 43663, 서울시: 37868 },
              { label: "26.2Q", 사근동: 44564, 자치구: 40869, 서울시: 37818 },
            ]}
            series={[
              { key: '사근동', label: '사근동', color: 'var(--color-blue)' },
              { key: '자치구', label: '자치구', color: 'var(--color-warn)' },
              { key: '서울시', label: '서울시', color: 'var(--color-sub)' },
            ]}
          />
        </div>
      </Section>

      <Section title="PieChart">
        <PieChart data={[{ label: '프랜차이즈', value: 41.5 }, { label: '일반', value: 58.5 }]} />
          <PieChart
            data={[{ label: '일반점포', value: 691 }, { label: '프랜차이즈', value: 152 }]}
            showLegend
          />
      </Section>

      <Section title="TrdarQuickPreview">
        <TrdarQuickPreview
          trdarName="신당역 3번"
          trdarTypeCode="A"
          trdarTypeName="골목상권"
          onViewDetail={() => alert('상세 분석으로 이동')}
          onClose={() => alert('닫기')}
        />
        <TrdarQuickPreview
          trdarName="성수동 카페거리"
          trdarTypeCode="B"
          trdarTypeName="발달상권"
          areaM2={129607.345}
          onViewDetail={() => alert('상세 분석으로 이동')}
          onClose={() => alert('닫기')}
        />
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
