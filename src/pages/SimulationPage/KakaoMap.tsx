import { useEffect, useRef, useState } from 'react';

export type MapCandidate = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  expectedMonthlySales: number | null;
  competitorCount: number;
  isNew?: boolean;
  tone?: 'blue' | 'red';
};

type KakaoMapInstance = object;
type KakaoOverlay = { setMap: (map: KakaoMapInstance | null) => void };

declare global {
  interface Window {
    kakao?: { maps: {
      load: (callback: () => void) => void;
      Map: new (container: HTMLElement, options: { center: unknown; level: number }) => KakaoMapInstance;
      LatLng: new (latitude: number, longitude: number) => unknown;
      Circle: new (options: { map: KakaoMapInstance; center: unknown; radius: number; strokeWeight: number; strokeColor: string; strokeOpacity: number; strokeStyle: string; fillColor: string; fillOpacity: number }) => KakaoOverlay;
      CustomOverlay: new (options: { map: KakaoMapInstance; position: unknown; content: HTMLElement; clickable: boolean; xAnchor: number; yAnchor: number; zIndex: number }) => KakaoOverlay;
    }};
  }
}

const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
const CENTER = { lat: 37.5446, lng: 127.0561 };

function formatSales(value: number | null) {
  if (value === null) return '정보 없음';
  return value >= 10000 ? `${(value / 10000).toFixed(1)}억` : `${value.toLocaleString('ko-KR')}만`;
}

function createCandidateOverlay(candidate: MapCandidate, selected: boolean, onClick: () => void) {
  const root = document.createElement('button');
  const color = candidate.tone === 'red' ? '#f04452' : '#3b6ef3';
  root.type = 'button';
  root.setAttribute('aria-label', `${candidate.name} 후보지 선택`);
  Object.assign(root.style, { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '0', background: 'transparent', padding: '0', cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif', filter: selected ? 'drop-shadow(0 0 0.45rem rgba(59, 110, 243, 0.7))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.18))', transform: selected ? 'scale(1.08)' : 'none', transformOrigin: 'bottom center' });

  if (candidate.isNew) {
    const badge = document.createElement('span');
    badge.textContent = 'N 신규매장';
    Object.assign(badge.style, { marginBottom: '4px', borderRadius: '999px', background: '#6e2bf5', color: '#fff', padding: '4px 10px', fontSize: '12px', fontWeight: '700', lineHeight: '1.2' });
    root.appendChild(badge);
  }

  const callout = document.createElement('span');
  Object.assign(callout.style, { position: 'relative', minWidth: '78px', overflow: 'visible', border: '3px solid #fff', borderRadius: '3px', background: color, color: '#fff', textAlign: 'center', fontWeight: '700', lineHeight: '1' });
  const sales = document.createElement('strong');
  sales.textContent = formatSales(candidate.expectedMonthlySales);
  Object.assign(sales.style, { display: 'block', padding: '6px 9px 5px', fontSize: '18px', whiteSpace: 'nowrap' });
  const stores = document.createElement('span');
  stores.textContent = `${candidate.competitorCount}개`;
  Object.assign(stores.style, { display: 'block', margin: '0 2px 2px', background: '#fff', color: '#212630', padding: '4px 7px', fontSize: '14px' });
  const tail = document.createElement('span');
  Object.assign(tail.style, { position: 'absolute', bottom: '-10px', left: '16px', width: '14px', height: '14px', background: color, borderRight: '3px solid #fff', borderBottom: '3px solid #fff', transform: 'rotate(45deg)' });
  callout.append(sales, stores, tail);
  root.appendChild(callout);
  root.addEventListener('click', onClick);
  return root;
}

interface KakaoMapProps { candidates: MapCandidate[]; rangeM: number; selectedId: string; onSelect: (id: string) => void }

export function KakaoMap({ candidates, rangeM, selectedId, onSelect }: KakaoMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const overlaysRef = useRef<KakaoOverlay[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing-key' | 'error'>(KAKAO_MAP_KEY ? 'loading' : 'missing-key');

  useEffect(() => {
    if (!KAKAO_MAP_KEY || !mapElementRef.current) return;
    let cancelled = false;
    function initializeMap() {
      if (cancelled || !mapElementRef.current || !window.kakao) return;
      window.kakao.maps.load(() => {
        if (cancelled || !mapElementRef.current || !window.kakao) return;
        mapRef.current = new window.kakao.maps.Map(mapElementRef.current, { center: new window.kakao.maps.LatLng(CENTER.lat, CENTER.lng), level: 4 });
        setStatus('ready');
      });
    }
    const existingScript = document.getElementById('kakao-map-sdk');
    const handleLoadError = () => !cancelled && setStatus('error');
    if (window.kakao) initializeMap();
    else if (existingScript) { existingScript.addEventListener('load', initializeMap, { once: true }); existingScript.addEventListener('error', handleLoadError, { once: true }); }
    else {
      const script = document.createElement('script');
      script.id = 'kakao-map-sdk'; script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
      script.onload = initializeMap; script.onerror = handleLoadError;
      document.head.appendChild(script);
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const maps = window.kakao?.maps;
    if (status !== 'ready' || !map || !maps) return;
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    const center = new maps.LatLng(CENTER.lat, CENTER.lng);
    const radius = new maps.Circle({ map, center, radius: rangeM, strokeWeight: 2, strokeColor: '#3b6ef3', strokeOpacity: 0.75, strokeStyle: 'dash', fillColor: '#3b6ef3', fillOpacity: 0.06 });
    const markers = candidates.map((candidate) => new maps.CustomOverlay({ map, position: new maps.LatLng(candidate.location.lat, candidate.location.lng), content: createCandidateOverlay(candidate, candidate.id === selectedId, () => onSelect(candidate.id)), clickable: true, xAnchor: 0.5, yAnchor: 1, zIndex: candidate.id === selectedId ? 4 : 3 }));
    overlaysRef.current = [radius, ...markers];
    return () => overlaysRef.current.forEach((overlay) => overlay.setMap(null));
  }, [candidates, onSelect, rangeM, selectedId, status]);

  return <div ref={mapElementRef} className="absolute inset-0 bg-surface">
    {status === 'missing-key' && <MapMessage>카카오 지도 키를 설정하면 실제 지도를 불러옵니다.</MapMessage>}
    {status === 'loading' && <MapMessage>지도를 불러오는 중입니다.</MapMessage>}
    {status === 'error' && <MapMessage error>카카오 지도를 불러오지 못했습니다.</MapMessage>}
  </div>;
}

function MapMessage({ children, error = false }: { children: string; error?: boolean }) {
  return <div className={`flex h-full items-center justify-center bg-surface text-body ${error ? 'text-red' : 'text-sub'}`}>{children}</div>;
}
