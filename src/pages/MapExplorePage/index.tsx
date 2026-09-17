import { useKakaoMap } from '@/features/map/useKakaoMap';
import { useMapScope } from '@/features/map/mapScope';

export default function MapExplorePage() {
  const { containerRef, map, error } = useKakaoMap();
  const { level, scope } = useMapScope(map);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* 임시 확인용 */}
      {map && (
        <div className="absolute left-3 top-3 z-10 rounded bg-white/90 px-3 py-1.5 text-caption shadow">
          level {level} · {scope}
        </div>
      )}

      {!map && (
        <div className="absolute inset-0 grid place-items-center bg-white/80 text-body text-gray-500">
          {error ?? '지도를 불러오는 중입니다...'}
        </div>
      )}
    </div>
  );
}