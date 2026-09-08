import { createBrowserRouter } from 'react-router-dom';
import PreviewPage from '@/pages/PreviewPage';

export const router = createBrowserRouter([
  {
    path: '/preview',
    element: <PreviewPage />,
  },
]);
