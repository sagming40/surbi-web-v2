import { SurbiCard } from '@/shared/ui/SurbiCard';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface TrdarQuickPreviewProps {
  trdarName: string;
  /** 상권 구분 코드 (예: "A") — 배지 색 매핑 기준 */
  trdarTypeCode: string;
  /** 상권 구분명 (골목상권 / 발달상권 / 전통시장 / 관광특구) — 화면 표시용 */
  trdarTypeName: string;
  /** ㎡ 단위. 아직 안 왔으면 undefined */
  areaM2?: number;
  onViewDetail: () => void;
  onClose: () => void;
}

type BadgeVariant = 'info' | 'warning' | 'success' | 'neutral';

/**
 * 상권 구분 코드 → 배지 색.
 * 코드 체계(A/B/C/D 등)는 서버 값을 그대로 키로 쓴다 — 표시명(한글)이
 * 바뀌어도 이 매핑은 안 깨지도록 코드 기준으로 잡았다.
 * 실제 코드-이름 대응표가 오면 이 객체만 갱신하면 된다.
 */
const TYPE_BADGE_VARIANT: Record<string, BadgeVariant> = {
  A: 'neutral',   // 골목상권
  B: 'info',      // 발달상권
  C: 'success',   // 전통시장
  D: 'warning',   // 관광특구
};

export function TrdarQuickPreview({
  trdarName,
  trdarTypeCode,
  trdarTypeName,
  areaM2,
  onViewDetail,
  onClose,
}: TrdarQuickPreviewProps) {
  const badgeVariant = TYPE_BADGE_VARIANT[trdarTypeCode] ?? 'neutral';

  return (
    <SurbiCard elevated className="p-4 w-64 relative">
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-3 right-3 text-sub hover:text-text text-caption"
      >
        ✕
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Badge variant={badgeVariant}>{trdarTypeName}</Badge>
      </div>

      <h3 className="text-headline font-bold text-navy mb-1">{trdarName}</h3>

      <p className="text-caption text-sub mb-3">
        {areaM2 != null ? `면적 ${areaM2.toLocaleString()}㎡` : '면적 정보 없음'}
      </p>

      <Button variant="primary" className="w-full" onClick={onViewDetail}>
        상세 분석 보기
      </Button>
    </SurbiCard>
  );
}
