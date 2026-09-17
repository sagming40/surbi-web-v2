import { useEffect, useState } from 'react';
import { getKakao, DEFAULT_LEVEL } from './useKakaoMap';

export type MapScope = 'si' | 'gu' | 'dong';

export function levelToScope(level: number): MapScope {
  if (level >= 8) return 'si';
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


