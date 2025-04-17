import api from './api';

// Wantlist 项目接口
export interface WantlistItem {
  wantlist_id: number;
  release: {
    id: number;
    title: string;
    artist: string;
    year: number;
    format: string;
    cover_url?: string;
    genres: string[];
  };
  note: string;
  added_date: string;
  // 新增市场价格相关字段
  market_price_cad?: number;
  num_for_sale?: number;
  community_have?: number;
  community_want?: number;
  request_time?: string;
}

// 添加到心愿单的请求参数
export interface AddToWantlistParams {
  user_id: number;
  release_id: number;
  note?: string;
}

// 从心愿单移动到收藏的请求参数
export interface MoveToCollectionParams {
  wantlist_id: number;
  user_id: number;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  description?: string;
}

// 删除心愿单项目的请求参数
export interface DeleteWantlistParams {
  user_id: number;
  wantlist_id: number;
}

// 心愿单 API
export const wantlistApi = {
  // 添加唱片到心愿单
  addToWantlist: async (params: AddToWantlistParams) => {
    try {
      const response = await api.post('/release/wantlist', params);
      return response.data;
    } catch (error) {
      console.error('Error adding to wantlist:', error);
      throw error;
    }
  },

  // 获取用户心愿单列表
  getUserWantlist: async (userId: number) => {
    try {
      const response = await api.get(`/release/wantlist?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user wantlist:', error);
      throw error;
    }
  },

  // 从心愿单移动到收藏
  moveToCollection: async (params: MoveToCollectionParams) => {
    try {
      const response = await api.put('/release/wantlist', params);
      return response.data;
    } catch (error) {
      console.error('Error moving from wantlist to collection:', error);
      throw error;
    }
  },

  // 从心愿单中删除
  removeFromWantlist: async (params: DeleteWantlistParams) => {
    try {
      const response = await api.delete('/release/wantlist', { data: params });
      return response.data;
    } catch (error) {
      console.error('Error removing from wantlist:', error);
      throw error;
    }
  }
};