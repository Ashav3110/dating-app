import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { mediaUrl } from '../utils/media.js';

const ChatWindow = ({ messages = [], onSend, currentUser, otherUser, online }) => {
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="glass rounded-3xl p-6 shadow-card flex flex-col h-[70vh]">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
          {otherUser?.avatar ? (
            <img src={mediaUrl(otherUser.avatar)} alt={otherUser.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full grid place-items-center font-semibold text-slate-700">
              {otherUser?.name?.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{otherUser?.name}</p>
          <p className="text-sm text-slate-500">{online ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg) => {
          const isMine = msg.from === currentUser?.id;
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[65%] rounded-2xl px-4 py-3 text-sm shadow ${isMine ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800'}`}>
                <p>{msg.content}</p>
                <span className="block text-[10px] mt-1 opacity-70">
                  {format(new Date(msg.createdAt), 'p')}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say hello..."
          className="flex-1 rounded-full border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button type="submit" className="btn-primary">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
