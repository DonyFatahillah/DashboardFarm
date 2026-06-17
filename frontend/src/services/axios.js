import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Ensure it ends with /api/v1/
    const sanitized = envUrl.replace(/\/$/, '');
    return sanitized.endsWith('/api/v1') ? `${sanitized}/` : `${sanitized}/api/v1/`;
  }
  return '/api/v1/';
};

const instance = axios.create({
  baseURL: getBaseURL(),
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
