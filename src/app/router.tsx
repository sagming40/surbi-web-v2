import { createBrowserRouter } from 'react-router-dom';
import PreviewPage from '@/pages/PreviewPage';
import WizardPage from '@/pages/WizardPage';
import WizardResultPage from '@/pages/WizardResultPage';
import ReportPage from '@/pages/ReportPage';

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
]);
