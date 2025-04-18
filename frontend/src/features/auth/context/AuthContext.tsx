// src/features/auth/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { jwtDecode } from "jwt-decode"; // 请确保已安装此依赖

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 检查本地存储中的用户会话
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      try {
        // 检查本地存储的令牌和用户数据
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // 先恢复用户状态，避免短暂的未认证状态
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          try {
            // 验证令牌是否过期
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp && decodedToken.exp < currentTime) {
              console.log('Token expired, logging out');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setUser(null);
            } else {
              // 令牌有效，验证会话
              try {
                const response = await authService.checkLoginStatus();
                if (response.code !== 200) {
                  console.log('Session invalid, logging out');
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  setUser(null);
                }
              } catch (apiError) {
                // API 调用失败，但不要立即登出用户
                // 在开发环境中，这可以提高开发体验
                console.error('API error during session validation:', apiError);
                // 如果是生产环境可以取消下面的注释
                // localStorage.removeItem('user');
                // localStorage.removeItem('token');
                // setUser(null);
              }
            }
          } catch (tokenError) {
            console.error('Invalid token:', tokenError);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // 登录函数
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ username, password });
      console.log('Login response in context:', response);
      
      if (response.code === 200) {
        // 成功响应，从正确位置提取 token 和用户数据
        const userData: User = {
          id: response.id || 0,
          username: response.username || username
        };
        
        // 存储 token
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/collection');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error in context:', err);
      setError(err.error || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // 注册函数
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({ username, email, password });
      console.log('Register response:', response);
      
      if (response.code === 200) {
        // 注册成功，自动登录
        await login(username, password);
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.error || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;