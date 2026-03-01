const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const mediaUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${base}${path}`;
};
