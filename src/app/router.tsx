import { createBrowserRouter } from 'react-router-dom';
import PreviewPage from '@/pages/PreviewPage';
import DashboardPage from '@/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/preview',
    element: <PreviewPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
]);
