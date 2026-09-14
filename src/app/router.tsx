import { createBrowserRouter } from 'react-router-dom';
import PreviewPage from '@/pages/PreviewPage';
import DashboardPage from '@/pages/DashboardPage';
import BuildingPage from '@/pages/BuildingPage';

export const router = createBrowserRouter([
  {
    path: '/preview',
    element: <PreviewPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/building',
    element: <BuildingPage />, // 개발용 임시 페이지
  },
]);
