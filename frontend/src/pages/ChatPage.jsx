import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import chatService from '../services/chatService';
import userService from '../services/userService';
import ChatWindow from '../components/ChatWindow.jsx';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useSocket } from '../hooks/useSocket';

const ChatPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [target, setTarget] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [matchRes, msgRes] = await Promise.all([
        userService.getMatches(),
        chatService.getMessages(id),
      ]);
      setTarget(matchRes.matches.find((m) => m.id === id) || null);
      setMessages(msgRes.messages);
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!socket) return undefined;
    const handleIncoming = (msg) => {
      if (msg.from === id || msg.to === id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('message', handleIncoming);
    return () => socket.off('message', handleIncoming);
  }, [socket, id]);

  const handleSend = async (content) => {
    if (socket) {
      socket.emit('sendMessage', { to: id, content });
    } else {
      const res = await chatService.sendMessage({ to: id, content });
      setMessages((prev) => [...prev, res.message]);
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <ChatWindow
      messages={messages}
      onSend={handleSend}
      currentUser={user}
      otherUser={target}
      online={onlineUsers.includes(id)}
    />
  );
};

export default ChatPage;
