// src/features/auth/services/authService.ts
import api from '../../../services/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
}

// 更新接口以匹配实际后端响应
interface LoginResponse {
  code: number;
  username?: string;
  id?: number;
  data?: {
    token: string;
  };
  error?: string;
}

interface RegisterResponse {
  code: number;
  userid?: number;
  error?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/user/userlogin', credentials);
      console.log('Login API response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await api.post('/user', credentials);
      console.log('Register API response:', response);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async checkLoginStatus(): Promise<{ code: number; error?: string }> {
    try {
      return await api.get('/user/userlogin');
    } catch (err) {
      // 在开发模式下，如果服务器不可用，默认假设会话有效
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Assuming session is valid when API is unavailable');
        return { code: 200 };
      }
      throw err;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};