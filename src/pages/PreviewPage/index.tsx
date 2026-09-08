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
        <p className="text-body text-sub">아직 컴포넌트가 없습니다.</p>
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
