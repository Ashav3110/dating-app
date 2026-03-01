import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { mediaUrl } from '../utils/media.js';

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-full text-sm font-semibold transition ${
    isActive ? 'bg-primary text-white shadow-card' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="backdrop-blur-xl bg-white/80 border-b border-slate-100 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary grid place-items-center font-black">❤</div>
          <span className="text-xl font-bold text-slate-900">HeartLink</span>
        </Link>
        {user && (
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navClass}>Discover</NavLink>
            <NavLink to="/matches" className={navClass}>Matches</NavLink>
            <NavLink to="/profile" className={navClass}>Profile</NavLink>
            <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
              {user.avatar ? (
                <img src={mediaUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-sm font-semibold text-slate-700">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            <button className="btn-outline text-sm" onClick={handleLogout}>Logout</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
