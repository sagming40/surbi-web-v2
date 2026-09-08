import type { ReactNode } from 'react';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { Badge } from '@/shared/ui/Badge';

interface InsightCardProps {
  label: string;
  headline: ReactNode;
  note?: string;
  /** DB 확인 중인 미확정 지표일 때 true */
  pending?: boolean;
}

export function InsightCard({ label, headline, note, pending = false }: InsightCardProps) {
  return (
    <SurbiCard className="p-4 bg-surface">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-label text-sub font-medium">{label}</span>
        {pending && <Badge variant="warning">DB 확인 중</Badge>}
      </div>
      <p className="text-headline font-bold text-navy">{headline}</p>
      {note && <p className="text-caption text-sub mt-1">{note}</p>}
    </SurbiCard>
  );
}
