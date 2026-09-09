import { createBrowserRouter } from 'react-router-dom';
import PreviewPage from '@/pages/PreviewPage';
import WizardPage from '@/pages/WizardPage';

export const router = createBrowserRouter([
  {
    path: '/preview',
    element: <PreviewPage />,
  },
  {
    path: '/wizard',
    element: <WizardPage />,
  },
]);
