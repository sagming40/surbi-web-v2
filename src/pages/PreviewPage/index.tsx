import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { Badge } from '@/shared/ui/Badge';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { InsightCard } from '@/shared/ui/InsightCard';
import { EmptyState } from '@/shared/ui/EmptyState';

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
