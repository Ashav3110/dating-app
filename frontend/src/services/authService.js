import api from './api';

const login = async (data) => {
  const res = await api.post('/api/auth/login', data);
  return res.data;
};

const register = async (data) => {
  const res = await api.post('/api/auth/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

const me = async () => {
  const res = await api.get('/api/auth/me');
  return res.data;
};

const updateProfile = async (data) => {
  const res = await api.put('/api/auth/me', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export default { login, register, me, updateProfile };
