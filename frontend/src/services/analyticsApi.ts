import api from './api';

// 收藏总价值接口
export interface CollectionValueData {
  total_value: string;
  currency: string;
}

// 流派分布接口
export interface GenreDistributionData {
  labels: string[];
  data: number[];
}

// 分析数据 API
export const analyticsApi = {
  // 获取收藏总价值
  getCollectionValue: async (userId: number) => {
    try {
      const response = await api.get(`/data/collection-value?user_id=${userId}`);
      console.log('Collection value API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching collection value:', error);
      throw error;
    }
  },

  // 获取按流派的收藏分布
  getGenreDistribution: async (userId: number) => {
    try {
      const response = await api.get(`/data/genre-distribution?user_id=${userId}`);
      console.log('Genre distribution API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching genre distribution:', error);
      throw error;
    }
  }
};