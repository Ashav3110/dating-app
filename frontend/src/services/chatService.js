import api from './api';

const getMessages = async (id) => {
  const res = await api.get(`/api/chat/${id}`);
  return res.data;
};

const sendMessage = async (payload) => {
  const res = await api.post('/api/chat', payload);
  return res.data;
};

export default { getMessages, sendMessage };
