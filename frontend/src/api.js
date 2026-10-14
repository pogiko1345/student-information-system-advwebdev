import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL?.trim() || (import.meta.env.DEV ? 'http://localhost:5000/api' : null);
export const api = axios.create({ baseURL: apiBaseURL || undefined });
api.interceptors.request.use(config => {
  if (!apiBaseURL) throw new Error('Production API URL is not configured. Set VITE_API_URL in the frontend deployment.');
  const token = sessionStorage.getItem('sis_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && sessionStorage.getItem('sis_token')) {
    sessionStorage.removeItem('sis_token');
    window.dispatchEvent(new Event('sis:session-expired'));
  }
  return Promise.reject(error);
});
export const errorMessage = error => error.response?.data?.message || (error.message?.startsWith('Production API URL') ? error.message : 'Could not reach the API. Check that the backend is running and the API URL is correct.');
