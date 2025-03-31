// src/services/discogsApi.ts
import axios from 'axios';

const discogsBaseUrl = 'https://api.discogs.com';
const discogsKey = import.meta.env.VITE_DISCOGS_KEY;
const discogsSecret = import.meta.env.VITE_DISCOGS_SECRET;

// 创建 axios 实例
const discogsClient = axios.create({
  baseURL: discogsBaseUrl,
  params: {
    key: discogsKey,
    secret: discogsSecret
  },
  headers: {
    'User-Agent': 'SpinArchiveApp/1.0' // Discogs 需要 User-Agent 标识
  }
});

// 搜索结果接口
export interface SearchResult {
  id: number;
  type: string; // release, master, artist
  title: string;
  thumb: string; // 缩略图 URL
  cover_image?: string; // 封面图片 URL
  year?: string | number;
  format?: string[];
  label?: string[];
  genre?: string[];
  style?: string[];
  country?: string;
  barcode?: string[];
  uri: string; // Discogs URL
  resource_url: string; // API URL
  master_id?: number;
  master_url?: string;
  artist?: string;
}

// API 服务
export const discogsApi = {
  /**
   * 搜索 Discogs 数据库
   * @param query 搜索关键词
   * @param type 搜索类型: release, master, artist, label
   * @param page 页码
   * @param perPage 每页结果数量
   */
  async search(
    query: string,
    type: 'release' | 'master' | 'artist' | 'label' = 'release',
    page = 1,
    perPage = 20
  ) {
    try {
      const response = await discogsClient.get('/database/search', {
        params: {
          q: query,
          type,
          page,
          per_page: perPage
        }
      });
      
      return {
        results: response.data.results as SearchResult[],
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Discogs search error:', error);
      throw new Error('Failed to search Discogs');
    }
  },

  /**
   * 获取发行版详情
   * @param releaseId 发行版 ID
   */
  async getRelease(releaseId: number) {
    try {
      const response = await discogsClient.get(`/releases/${releaseId}`);
      return response.data;
    } catch (error) {
      console.error('Discogs get release error:', error);
      throw new Error(`Failed to fetch release ${releaseId}`);
    }
  },

  /**
   * 获取母带详情
   * @param masterId 母带 ID
   */
  async getMaster(masterId: number) {
    try {
      const response = await discogsClient.get(`/masters/${masterId}`);
      return response.data;
    } catch (error) {
      console.error('Discogs get master error:', error);
      throw new Error(`Failed to fetch master ${masterId}`);
    }
  },

  /**
   * 获取艺术家详情
   * @param artistId 艺术家 ID
   */
  async getArtist(artistId: number) {
    try {
      const response = await discogsClient.get(`/artists/${artistId}`);
      return response.data;
    } catch (error) {
      console.error('Discogs get artist error:', error);
      throw new Error(`Failed to fetch artist ${artistId}`);
    }
  },

  /**
   * 获取艺术家发行版列表
   * @param artistId 艺术家 ID
   * @param page 页码
   * @param perPage 每页结果数量
   */
  async getArtistReleases(artistId: number, page = 1, perPage = 20) {
    try {
      const response = await discogsClient.get(`/artists/${artistId}/releases`, {
        params: {
          page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      console.error('Discogs get artist releases error:', error);
      throw new Error(`Failed to fetch releases for artist ${artistId}`);
    }
  }
};