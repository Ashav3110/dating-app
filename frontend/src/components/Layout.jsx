import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pb-16 pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
