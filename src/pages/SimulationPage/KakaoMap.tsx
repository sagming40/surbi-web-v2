import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: { center: unknown; level: number }) => unknown;
        LatLng: new (latitude: number, longitude: number) => unknown;
      };
    };
  }
}

const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

export function KakaoMap() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing-key' | 'error'>(
    KAKAO_MAP_KEY ? 'loading' : 'missing-key',
  );

  useEffect(() => {
    if (!KAKAO_MAP_KEY || !mapElementRef.current) return;

    let cancelled = false;

    function initializeMap() {
      if (cancelled || !mapElementRef.current || !window.kakao) return;

      window.kakao.maps.load(() => {
        if (cancelled || !mapElementRef.current || !window.kakao) return;

        new window.kakao.maps.Map(mapElementRef.current, {
          center: new window.kakao.maps.LatLng(37.5446, 127.0561),
          level: 4,
        });
        setStatus('ready');
      });
    }

    const existingScript = document.getElementById('kakao-map-sdk');

    function handleLoadError() {
      if (!cancelled) setStatus('error');
    }

    if (window.kakao) {
      initializeMap();
    } else if (existingScript) {
      existingScript.addEventListener('load', initializeMap, { once: true });
      existingScript.addEventListener('error', handleLoadError, { once: true });
    } else {
      const script = document.createElement('script');
      script.id = 'kakao-map-sdk';
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
      script.onload = initializeMap;
      script.onerror = handleLoadError;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={mapElementRef} className="absolute inset-0 bg-surface">
      {status === 'missing-key' && (
        <div className="flex h-full items-center justify-center bg-surface text-center">
          <p className="text-body text-sub">카카오 지도 키를 설정하면 실제 지도를 불러옵니다.</p>
        </div>
      )}
      {status === 'loading' && (
        <div className="flex h-full items-center justify-center bg-surface text-body text-sub">지도를 불러오는 중입니다.</div>
      )}
      {status === 'error' && (
        <div className="flex h-full items-center justify-center bg-surface text-body text-red">카카오 지도를 불러오지 못했습니다.</div>
      )}
    </div>
  );
}
