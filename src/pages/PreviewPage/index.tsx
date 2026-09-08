import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { Badge } from '@/shared/ui/Badge';

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
