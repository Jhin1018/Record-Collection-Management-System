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
    secret: discogsSecret,
    // 可以添加用户代理作为查询参数而不是头
    user_agent: 'SpinArchiveApp/1.0'
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

// 修改或添加更详细的接口来匹配 Discogs API 的响应
export interface ReleaseDetails {
  id: number;
  title: string;
  artists: Array<{
    name: string;
    id: number;
    resource_url: string;
  }>;
  formats: Array<{
    name: string;
    qty: string;
    descriptions?: string[];
  }>;
  images?: Array<{
    type: string;
    uri: string;
    resource_url: string;
    uri150: string;
    width: number;
    height: number;
  }>;
  thumb: string;
  year: number;
  country: string;
  genres: string[];
  styles: string[];
  labels: Array<{
    name: string;
    catno: string;
    id: number;
    resource_url: string;
  }>;
  tracklist: Array<{
    position: string;
    title: string;
    duration: string;
    artists?: Array<{
      name: string;
      id: number;
      resource_url: string;
    }>;
  }>;
  notes?: string;
  videos?: Array<{
    uri: string;
    title: string;
    description: string;
    duration: number;
  }>;
  community?: {
    have: number;
    want: number;
    rating: {
      count: number;
      average: number;
    };
  };
  released?: string;
}

export interface MasterDetails {
  id: number;
  title: string;
  artists: Array<{
    name: string;
    id: number;
    resource_url: string;
  }>;
  images?: Array<{
    type: string;
    uri: string;
    resource_url: string;
    uri150: string;
    width: number;
    height: number;
  }>;
  thumb: string;
  year: number;
  genres: string[];
  styles: string[];
  tracklist: Array<{
    position: string;
    title: string;
    duration: string;
  }>;
  main_release: number;
  main_release_url: string;
  versions_url: string;
}

export interface ArtistDetails {
  id: number;
  name: string;
  realname?: string;
  profile?: string;
  images?: Array<{
    type: string;
    uri: string;
    resource_url: string;
    uri150: string;
    width: number;
    height: number;
  }>;
  urls?: string[];
  members?: Array<{
    id: number;
    name: string;
    resource_url: string;
    active: boolean;
  }>;
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
  async getRelease(releaseId: number): Promise<ReleaseDetails> {
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
  async getMaster(masterId: number): Promise<MasterDetails> {
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
  async getArtist(artistId: number): Promise<ArtistDetails> {
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
  },

  /**
   * 获取母带的所有版本
   * @param masterId 母带 ID
   * @param page 页码
   * @param perPage 每页结果数量
   */
  async getMasterVersions(masterId: number, page = 1, perPage = 20) {
    try {
      const response = await discogsClient.get(`/masters/${masterId}/versions`, {
        params: {
          page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      console.error('Discogs get master versions error:', error);
      throw new Error(`Failed to fetch versions for master ${masterId}`);
    }
  }
};