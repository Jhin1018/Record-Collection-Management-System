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

// 价格比较项目接口
export interface PriceComparisonItem {
  release_id: number;
  title: string;
  purchase_price: number;
  quantity: number;
  purchase_date: string;
  market_price_cad: number;
  estimated_value: number;
  total_spent: number;
  gain_loss: number;
  request_time: string;
  num_for_sale: number;
  community_have: number;
  community_want: number;
}

// 月度消费接口
export interface MonthlySpendingData {
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
  },

  // 获取价格比较数据
  getPriceComparison: async (userId: number) => {
    try {
      const response = await api.get(`/data/price-comparison?user_id=${userId}`);
      console.log('Price comparison API response:', response);
      return response; // 这里直接返回完整响应，包括 code 和 data 字段
    } catch (error) {
      console.error('Error fetching price comparison data:', error);
      throw error;
    }
  },

  // 获取月度消费数据
  getMonthlySpending: async (userId: number) => {
    try {
      const response = await api.get(`/data/monthly-spending?user_id=${userId}`);
      console.log('Monthly spending API raw response:', response);
      
      // 确保我们返回正确的数据结构
      // 根据API文档，应该返回 response.data.data
      const data = response.data || null;
      console.log('Monthly spending processed data:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching monthly spending data:', error);
      throw error;
    }
  }
};