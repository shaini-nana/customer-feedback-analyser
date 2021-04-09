import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import NotFound from 'src/pages/NotFound';
import Analytics from 'src/pages/Analytics';
import FoodAnalytics from 'src/pages/FoodAnalytics';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'analytics', element: <Analytics /> },
      { path: 'detailAnalytics', element: <FoodAnalytics /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/analytics" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
