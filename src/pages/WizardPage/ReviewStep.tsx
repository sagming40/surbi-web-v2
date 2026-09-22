import { wizardReviewStyles } from './wizard.styles';

interface ReviewStepProps {
  region: string;
  category: string;
  storeSize: { label: string; detail: string };
  floor: string;
  staffRange: { label: string };
  works15Hours: boolean;
}

/**
 * 마지막 단계는 새 데이터를 조회하지 않고 부모가 모은 입력값을 읽기 쉽게 보여 준다.
 * 사용자가 이전 단계로 돌아가 값을 고치면 props가 바뀌어 표도 자동으로 갱신된다.
 */
export function ReviewStep({ region, category, storeSize, floor, staffRange, works15Hours }: ReviewStepProps) {
  const rows = [
    ['지역', region],
    ['업종', category],
    ['매장 크기', `${storeSize.label} ${storeSize.detail.replace('\n', ' ')}`],
    ['층수', floor],
    ['직원 수', `${staffRange.label}${works15Hours ? ' (주 15시간 이상)' : ''}`],
  ];

  return (
    <>
      <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text">
        <span className="text-blue">{'입력한 조건을\n'}</span>확인해 주세요.
      </h1>
      <dl className={wizardReviewStyles.table}>
        {rows.map(([label, value], index) => (
          <div key={label} className={`${wizardReviewStyles.row} ${index % 2 === 0 ? wizardReviewStyles.rowMuted : wizardReviewStyles.rowDefault}`}>
            <dt className="text-headline text-sub">{label}</dt>
            <dd className="text-headline font-bold text-text">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
