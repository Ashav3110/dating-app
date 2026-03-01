import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader.jsx';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'other',
    age: '',
    bio: '',
    interests: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        if (avatar) data.append('avatar', avatar);
        await register(data);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="bg-gradient-to-br from-primary via-slate-900 to-slate-950 text-white flex flex-col justify-between p-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Dating, reimagined</p>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight">Meet Shiavam  ad KING you actually vibe with.</h1>
          <p className="mt-6 text-white/70 text-lg">HeartLink keeps it simple with clean design, real-time chat, and thoughtful matches.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-10">
          {['Coffee', 'Hiking', 'Tech', 'Art', 'Music', 'Travel'].map((tag) => (
            <div key={tag} className="glass text-center text-slate-900 rounded-2xl py-4 font-semibold">{tag}</div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md glass rounded-3xl p-8 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-primary font-semibold"
            >
              {mode === 'login' ? 'New here? Register' : 'Have an account? Login'}
            </button>
          </div>

          {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
          {loading ? <Loader /> : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Age</label>
                    <input name="age" type="number" min="18" value={form.age} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows="2" className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Interests (comma separated)</label>
                  <input name="interests" value={form.interests} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Profile picture</label>
                  <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0])} className="w-full text-sm text-slate-600" />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button type="submit" className="btn-primary w-full mt-2">
              {mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
