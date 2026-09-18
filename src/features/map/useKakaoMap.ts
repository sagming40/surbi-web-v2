import { useEffect, useRef, useState } from 'react';

const SDK_ID = 'kakao-map-sdk';

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 };

export const DEFAULT_LEVEL = 8;
export const MIN_LEVEL = 3;
export const MAX_LEVEL = 8;


export function getKakao(): any | undefined { 
  return (window as unknown as { kakao?: any }).kakao;
}

function loadKakaoSdk(): Promise<any> {
  return new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!key) {
      reject(new Error('카카오 맵 키가 설정되지 않았습니다.'));
      return;
    }

    const done = () => {
      const kakao = getKakao();
      if (!kakao) {
        reject(new Error('SDK가 로드되지 않았습니다.'));
        return;
      }
      kakao.maps.load(() => resolve(kakao));
    };

    if (getKakao()) {
      done();
      return;
    }

    const fail = () => reject(new Error('카카오 맵 SDK를 불러오지 못했습니다.'));
    const existing = document.getElementById(SDK_ID);

    if (existing) {
      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', fail, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SDK_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.addEventListener('load', done, { once: true });
    script.addEventListener('error', fail, { once: true });
    document.head.appendChild(script);
  });
}

export function useKakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadKakaoSdk()
      .then((kakao) => {
        if (cancelled || !containerRef.current) return;
        
        const instance = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
          level: DEFAULT_LEVEL,
        });

        instance.setMinLevel(MIN_LEVEL);
        instance.setMaxLevel(MAX_LEVEL);

        setMap(instance);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { containerRef, map, error };
}
