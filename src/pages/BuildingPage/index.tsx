import { buildingMock } from './mock';
import { BuildingDetailPanel } from '@/features/building/BuildingDetailPanel';
import { useNavigate } from 'react-router-dom';

export default function BuildingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface font-sans p-8">
      {/* 실제로는 지도 위에 뜨는 패널. 개발 중에는 이 자리에 홀로 띄워둔다 */}
      <div className="w-[420px] h-[720px]">
        <BuildingDetailPanel
          data={buildingMock}
          onAnalyzeTrdar={(guCode) => {
            navigate(`/wizard?step=2&guCode=${guCode}`);
          }}
        />
      </div>
    </div>
  );
}