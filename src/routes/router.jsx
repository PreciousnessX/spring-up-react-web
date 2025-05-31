import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Login/Login';
import AuthGuard from '@/components/AuthGuard/AuthGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: (
       <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  }
]);

export default router;
