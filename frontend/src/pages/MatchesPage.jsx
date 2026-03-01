import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import { mediaUrl } from '../utils/media.js';
import Loader from '../components/Loader.jsx';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await userService.getMatches();
      setMatches(res.matches);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Matches</p>
        <h2 className="text-3xl font-black text-slate-900">You both liked each other</h2>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {matches.map((m) => (
            <Link key={m.id} to={`/chat/${m.id}`} className="glass rounded-2xl p-4 shadow-card hover:-translate-y-1 transition">
              <div className="h-32 rounded-xl overflow-hidden bg-slate-200 mb-3">
                {m.avatar ? (
                  <img src={mediaUrl(m.avatar)} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-2xl font-semibold text-slate-700">
                    {m.name?.charAt(0)}
                  </div>
                )}
              </div>
              <p className="font-semibold text-slate-900">{m.name}</p>
              <p className="text-sm text-slate-500">{m.bio || 'No bio yet'}</p>
            </Link>
          ))}
          {matches.length === 0 && <p className="text-slate-500">No matches yet. Keep exploring!</p>}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
