import { useState } from 'react';
import authService from '../services/authService';
import { useAuth } from '../hooks/useAuth.js';
import { mediaUrl } from '../utils/media.js';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    gender: user?.gender || 'other',
    age: user?.age || '',
    bio: user?.bio || '',
    interests: user?.interests?.join(', ') || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError('');
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (avatar) data.append('avatar', avatar);
    try {
      const res = await authService.updateProfile(data);
      setUser(res.user);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Profile</p>
        <h2 className="text-3xl font-black text-slate-900">Your details</h2>
      </div>
      <div className="glass rounded-3xl p-8 shadow-card">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
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
            <div>
              <label className="block text-sm text-slate-600 mb-1">Interests</label>
              <input name="interests" value={form.interests} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <p className="text-xs text-slate-500 mt-1">Comma-separated</p>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-200">
              {user?.avatar ? (
                <img src={mediaUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-lg font-semibold text-slate-700">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Profile picture</label>
              <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0])} className="text-sm text-slate-600" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && <p className="text-sm text-green-600">Profile updated.</p>}
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
