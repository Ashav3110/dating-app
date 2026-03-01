import api from './api';

const explore = async (params = {}) => {
  const res = await api.get('/api/users/explore', { params });
  return res.data;
};

const likeUser = async (id) => {
  const res = await api.post(`/api/users/${id}/like`);
  return res.data;
};

const dislikeUser = async (id) => {
  const res = await api.post(`/api/users/${id}/dislike`);
  return res.data;
};

const getMatches = async () => {
  const res = await api.get('/api/users/matches');
  return res.data;
};

export default { explore, likeUser, dislikeUser, getMatches };
