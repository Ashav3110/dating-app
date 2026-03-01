import { mediaUrl } from '../utils/media.js';

const ProfileCard = ({ user, onLike, onDislike }) => (
  <div className="glass rounded-3xl p-6 shadow-card">
    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 mb-4">
      {user.avatar ? (
        <img src={mediaUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full grid place-items-center text-4xl text-slate-500">{user.name?.charAt(0)}</div>
      )}
    </div>
    <div className="flex items-center justify-between mb-2">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{user.name}, {user.age || '—'}</h3>
        <p className="text-sm text-slate-500 capitalize">{user.gender}</p>
      </div>
      <div className="flex gap-2">
        <button className="btn-outline" onClick={() => onDislike?.(user.id)}>Dislike</button>
        <button className="btn-primary" onClick={() => onLike?.(user.id)}>Like</button>
      </div>
    </div>
    <p className="text-slate-700 mb-3">{user.bio || 'No bio yet'}</p>
    {user.interests?.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {user.interests.map((interest) => (
          <span key={interest} className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">{interest}</span>
        ))}
      </div>
    )}
  </div>
);

export default ProfileCard;
