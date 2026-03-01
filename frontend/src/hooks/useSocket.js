import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocket = () => {
  const { token } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socket = useMemo(() => {
    if (!token) return null;
    return io(SOCKET_URL, {
      auth: { token },
    });
  }, [token]);

  useEffect(() => {
    if (!socket) return undefined;
    socket.on('onlineUsers', (users) => setOnlineUsers(users));
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return { socket, onlineUsers };
};
