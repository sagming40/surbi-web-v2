import { useEffect, useState } from 'react';
import { getKakao, DEFAULT_LEVEL } from './useKakaoMap';

export type MapScope = 'si' | 'gu' | 'dong';
export const SCOPE_LABEL: Record<MapScope, string> = {
  si: '시',
  gu: '구',
  dong: '동',
};

export function levelToScope(level: number): MapScope {
  if (level >= 7) return 'si';
  if (level >= 5) return 'gu';
  return 'dong';
}

export function useMapScope(map: any) {
  const [level, setLevel] = useState(DEFAULT_LEVEL);

  useEffect(() => {
    const kakao = getKakao();
    if (!kakao || !map) return;

    const sync = () => setLevel(map.getLevel());
    sync();

    kakao.maps.event.addListener(map, 'zoom_changed', sync);
    return () => kakao.maps.event.removeListener(map, 'zoom_changed', sync);
  }, [map]);

  return { level, scope: levelToScope(level) };
}


