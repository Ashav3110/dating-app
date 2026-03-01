import { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard.jsx';
import Loader from '../components/Loader.jsx';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth.js';

const HomePage = () => {
  const { user, setUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({ gender: '', search: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await userService.explore(filters);
    setProfiles(res.users);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.gender]);

  const handleLike = async (id) => {
    const res = await userService.likeUser(id);
    setUser({ ...user, likes: res.likes, matches: res.matches });
    load();
  };

  const handleDislike = async (id) => {
    const res = await userService.dislikeUser(id);
    setUser({ ...user, likes: res.likes, matches: res.matches });
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Discover</p>
          <h2 className="text-3xl font-black text-slate-900">Curated people near you</h2>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search by name"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onBlur={load}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); load(); } }}
            className="rounded-full border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="rounded-full border border-slate-200 px-4 py-2"
          >
            <option value="">All</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {profiles.map((p) => (
            <ProfileCard key={p.id} user={p} onLike={handleLike} onDislike={handleDislike} />
          ))}
          {profiles.length === 0 && <p className="text-slate-500">No profiles match your filters yet.</p>}
        </div>
      )}
    </div>
  );
};

export default HomePage;
