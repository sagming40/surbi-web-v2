import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { DataStatusNotice } from '@/shared/ui/DataStatusNotice';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { clearWizardResultNavigationState, getWizardResultNavigationState } from '../WizardPage/wizard.navigation';
import type { WizardResultNavigationState } from '../WizardPage/wizard.types';

export default function WizardResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = (location.state as WizardResultNavigationState | null)
    ?? getWizardResultNavigationState();
  const wizardResult = navigationState?.result;
  const selection = navigationState?.selection;

  const overview = wizardResult?.marketContext.overview;
  const salesAmount = overview?.sales?.amount;
  const salesChangeRate = overview?.sales?.changeRate;
  const storeCount = overview?.storeCount;
  const salesRank = overview?.sales?.rank;
  const salesRankTotal = overview?.sales?.rankTotal;
  const selectedConditions = selection
    ? [
        selection.area.name,
        selection.industry.name,
        `${selection.storeSize.label} ${selection.storeSize.areaM2}㎡`,
        selection.floor.label,
        `직원 ${selection.staff.label}`,
      ]
    : [];

  function restartWizard() {
    clearWizardResultNavigationState();
    navigate('/wizard');
  }

  return (
    <main className="min-h-screen bg-surface font-sans text-text sm:py-8">
      <section className="mx-auto min-h-screen w-full max-w-[400px] bg-white shadow-sm sm:min-h-[1100px] sm:rounded-2xl sm:border sm:border-border sm:overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <button type="button" aria-label="위저드로 돌아가기" onClick={restartWizard} className="text-xl leading-none text-text">←</button>
          <p className="text-headline font-bold text-text">창업 분석 결과</p>
          <button type="button" aria-label="처음으로" onClick={restartWizard} className="text-caption font-bold text-blue">다시 계산</button>
        </header>

        <div className="px-6 pb-6 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {selectedConditions.map((condition) => <Chip key={condition}>{condition}</Chip>)}
          </div>

          {!wizardResult && (
            <DataStatusNotice status="unavailable" className="mt-6">
              분석 결과를 찾을 수 없습니다. 위저드에서 조건을 선택한 뒤 분석 결과를 다시 생성해 주세요.
            </DataStatusNotice>
          )}

          <section className="mt-6">
            <p className="text-caption font-bold text-sub">① 상가 유형 임대료</p>
            <h1 className="mt-2 text-headline font-bold text-text">{selection?.area.name ?? '선택 지역'} · {selection?.floor.label ?? '선택 층'} 기준 예상 임대료</h1>
            {wizardResult?.rent.available && wizardResult.rent.value !== null ? (
              <SurbiCard className="mt-3 flex items-center justify-between p-4">
                <span className="text-body font-bold text-text">예상 월 임대료</span>
                <strong className="text-headline text-text">{wizardResult.rent.value.toLocaleString()}원</strong>
              </SurbiCard>
            ) : (
              <DataStatusNotice status="unavailable" className="mt-3">
                현재 분석 API에서 임대료 추정값을 제공하지 않습니다.
              </DataStatusNotice>
            )}
          </section>

          <section className="mt-7 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="text-caption font-bold text-sub">② 상권 통계 요약</p>
              {salesRank !== null && salesRank !== undefined && salesRankTotal !== null && salesRankTotal !== undefined && (
                <Badge variant="info">서울 자치구 매출 {salesRank}위 / {salesRankTotal}개</Badge>
              )}
            </div>
            <div className="mt-2 flex items-end gap-2">
              <strong className="text-display leading-none text-blue">{salesAmount !== null && salesAmount !== undefined ? salesAmount.toLocaleString() : '—'}</strong>
              <span className="pb-0.5 text-caption font-bold text-sub">원 / 분기 매출</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Metric
                label="분기 매출"
                value={salesAmount !== null && salesAmount !== undefined
                  ? `${salesAmount.toLocaleString()}원`
                  : '데이터 없음'
                }
              />

              <Metric
                label="매출 증감률"
                value={salesChangeRate !== null && salesChangeRate !== undefined
                  ? `${salesChangeRate}%`
                  : '데이터 없음'
                }
              />

              <Metric
                label="점포 수"
                value={storeCount !== null && storeCount !== undefined
                  ? `${storeCount.toLocaleString()}곳`
                  : '데이터 없음'
                }
              />
            </div>
            <p className="mt-3 text-label leading-4 text-sub">※ 현재 제공되는 값은 선택 지역·업종의 시장 통계입니다. AI 예측 점수는 모델 준비 후 제공됩니다.</p>
          </section>

          <section className="mt-7 border-t border-border pt-6">
            <p className="text-caption font-bold text-sub">③ 모집 중인 지원 정책</p>
            <h2 className="mt-2 text-headline font-bold text-text">신청 가능한 공고</h2>
            {wizardResult?.supportPolicies.available && wizardResult.supportPolicies.items?.length ? (
              <div className="mt-3 grid gap-2">
                {wizardResult.supportPolicies.items.map((policy) => (
                  <SurbiCard key={policy} className="p-3">
                    <p className="text-body font-bold text-text">{policy}</p>
                  </SurbiCard>
                ))}
              </div>
            ) : (
              <DataStatusNotice status="unavailable" className="mt-3">
                현재 분석 API에서 맞춤 지원 정책을 제공하지 않습니다.
              </DataStatusNotice>
            )}
          </section>

          <Button className="mt-7 w-full !bg-blue" onClick={() => navigate('/report', { state: navigationState })} disabled={!navigationState}>
            AI 분석 보고서 전문 보기
          </Button>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <SurbiCard className="p-3">
      <p className="text-label text-sub">{label}</p>
      <p className={`mt-1 text-body font-bold ${warning ? 'text-red' : 'text-text'}`}>{value}</p>
    </SurbiCard>
  );
}
