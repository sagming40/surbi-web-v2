import type { ReactNode } from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';

export interface RankTableColumn<T> {
  /** 표 헤더에 표시할 텍스트 */
  header: string;
  /** 이 컬럼의 셀을 어떻게 그릴지 결정하는 함수 */
  render: (row: T, index: number) => ReactNode;
  /** 고정 폭 (예: 'w-12'). 없으면 남는 공간을 차지 */
  width?: string;
  align?: 'left' | 'right';
}

interface RankTableProps<T> {
  columns: RankTableColumn<T>[];
  rows: T[];
  /** true를 반환한 행에 강조 배경을 입힌다 */
  isHighlighted?: (row: T, index: number) => boolean;
  onRowClick?: (row: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function RankTable<T>({
  columns,
  rows,
  isHighlighted,
  onRowClick,
  loading = false,
  emptyMessage = '표시할 데이터가 없습니다',
}: RankTableProps<T>) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-4 py-2 bg-surface">
        {columns.map((col) => (
          <span
            key={col.header}
            className={`text-label text-sub font-medium ${col.width ?? 'flex-1'} ${
              col.align === 'right' ? 'text-right' : ''
            }`}
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* 본문 */}
      {rows.map((row, index) => (
        <div
          key={index}
          onClick={() => onRowClick?.(row, index)}
          className={`flex items-center gap-2 px-4 py-2.5 border-b border-border ${
            isHighlighted?.(row, index) ? 'bg-blue/5' : 'bg-white'
          } ${onRowClick ? 'cursor-pointer hover:bg-surface' : ''}`}
        >
          {columns.map((col) => (
            <div
              key={col.header}
              className={`${col.width ?? 'flex-1'} ${col.align === 'right' ? 'text-right' : ''}`}
            >
              {col.render(row, index)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
