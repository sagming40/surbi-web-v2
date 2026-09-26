import { createBrowserRouter } from 'react-router-dom';
import PreviewPage from '@/pages/PreviewPage';
import WizardPage from '@/pages/WizardPage';
import WizardResultPage from '@/pages/WizardResultPage';
import ReportPage from '@/pages/ReportPage';
import SimulationPage from '@/pages/SimulationPage';
import DashboardPage from '@/pages/DashboardPage';
import BuildingPage from '@/pages/BuildingPage';
import MapExplorePage from '@/pages/MapExplorePage';

export const router = createBrowserRouter([
  {
    path: '/preview',
    element: <PreviewPage />,
  },
  {
    path: '/wizard',
    element: <WizardPage />,
  },
  {
    path: '/wizard/result',
    element: <WizardResultPage />,
  },
  {
    path: '/report',
    element: <ReportPage />,
  },
  {
    path: '/simulation',
    element: <SimulationPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/building',
    element: <BuildingPage />, // 개발용 임시 페이지
  },
  { 
    path: '/map',
    element: <MapExplorePage />,
  }
]);
