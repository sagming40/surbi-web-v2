import { buildingMock } from './mock';
import { BuildingDetailPanel } from '@/features/building/BuildingDetailPanel';

export default function BuildingPage() {
  return (
    <div className="min-h-screen bg-surface font-sans p-8">
      <div className="w-[420px] h-[720px]">
        <BuildingDetailPanel data={buildingMock} />
      </div>
    </div>
  );
}