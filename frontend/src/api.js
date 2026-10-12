import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('sis_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const errorMessage = error => error.response?.data?.message || 'Something went wrong. Please try again.';
