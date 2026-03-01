import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MatchesPage from './pages/MatchesPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import Layout from './components/Layout.jsx';
import Loader from './components/Loader.jsx';
import { useAuth } from './hooks/useAuth.js';

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullscreen />;
  return user ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<Layout />}>
        <Route index element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/matches" element={<RequireAuth><MatchesPage /></RequireAuth>} />
        <Route path="/chat/:id" element={<RequireAuth><ChatPage /></RequireAuth>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
