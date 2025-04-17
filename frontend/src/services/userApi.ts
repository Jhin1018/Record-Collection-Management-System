import api from './api';

// 用户信息接口
export interface UserData {
  id: number;
  username: string;
  email: string;
}

// 用户API服务
export const userApi = {
  // 修改用户名
  updateUsername: async (userId: number, username: string): Promise<UserData> => {
    try {
      const response = await api.put('/user', {
        user_id: userId,
        username
      });
      return response.data;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  }
};