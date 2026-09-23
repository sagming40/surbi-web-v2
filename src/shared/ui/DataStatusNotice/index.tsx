import type { ReactNode } from 'react';

type DataStatus = 'temporary' | 'unavailable';

interface DataStatusNoticeProps {
  status: DataStatus;
  children: ReactNode;
  className?: string;
}

const statusTitle: Record<DataStatus, string> = {
  temporary: '임시 데이터 사용 중',
  unavailable: '데이터 준비 중',
};

/** API가 아직 없거나, 현재 응답에서 제공되지 않는 정보를 같은 형식으로 알린다. */
export function DataStatusNotice({ status, children, className = '' }: DataStatusNoticeProps) {
  return (
    <div className={`rounded-xl border border-border bg-surface px-4 py-3 ${className}`} role="status">
      <p className="text-caption font-bold text-text">{statusTitle[status]}</p>
      <p className="mt-1 text-caption leading-5 text-sub">{children}</p>
    </div>
  );
}
