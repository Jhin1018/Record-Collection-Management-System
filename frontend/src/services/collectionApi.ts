import api from './api';

// 收藏项目接口
export interface CollectionItem {
  collection_id: number;
  release: {
    id: number;
    title: string;
    artist: string;
    year: number;
    format: string;
    cover_url?: string;
    genres: string[];
  };
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  description: string;
}

// 添加到收藏的请求参数
export interface AddToCollectionParams {
  release_id: number;
  user_id: number;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  description?: string;
}

// 更新收藏的请求参数
export interface UpdateCollectionParams {
  user_id: number;
  collection_id: number;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  description?: string;
}

// 删除收藏的请求参数
export interface DeleteCollectionParams {
  user_id: number;
  collection_id: number;
}

// 收藏管理 API
export const collectionApi = {
  // 添加唱片到收藏
  addToCollection: async (params: AddToCollectionParams) => {
    try {
      return await api.post('/release/collection', params);
    } catch (error) {
      console.error('Error adding to collection:', error);
      throw error;
    }
  },

  // 获取用户收藏列表
  getUserCollection: async (userId: number) => {
    try {
      return await api.get(`/release/collection?user_id=${userId}`);
    } catch (error) {
      console.error('Error fetching user collection:', error);
      throw error;
    }
  },

  // 更新收藏项
  updateCollection: async (params: UpdateCollectionParams) => {
    try {
      return await api.put('/release/collection', params);
    } catch (error) {
      console.error('Error updating collection item:', error);
      throw error;
    }
  },

  // 从收藏中删除
  removeFromCollection: async (params: DeleteCollectionParams) => {
    try {
      return await api.delete('/release/collection', { data: params });
    } catch (error) {
      console.error('Error removing from collection:', error);
      throw error;
    }
  }
};