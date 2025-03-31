import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，自动附加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 处理 401 未授权错误，可能是令牌过期
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 如果需要，可以在这里添加重定向到登录页面的逻辑
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export default api;