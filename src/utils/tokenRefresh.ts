import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { fetchRefreshToken } from '../api/user';
import type { ApiResponse } from '../types/api';
import { applyTokenPair, clearAuth, getRefreshToken } from './auth';

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason: Error) => void;
}> = [];

const flushQueue = (error: Error | null, token: string | null = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  pendingQueue = [];
};

/** 使用 refreshToken 换取新的 accessToken */
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('无 refresh token');
  }

  const data = await fetchRefreshToken(refreshToken);
  applyTokenPair(data);
  return data.accessToken;
};

const shouldSkipRefresh = (config?: InternalAxiosRequestConfig): boolean => {
  if (!config) {
    return true;
  }
  if (config._skipTokenRefresh) {
    return true;
  }
  const url = config.url ?? '';
  return url.includes('/login') || url.includes('/refresh');
};

/** 401 时尝试刷新 token 并重试原请求 */
export const handleUnauthorized = async (
  error: AxiosError<ApiResponse>,
  retry: (config: InternalAxiosRequestConfig) => Promise<unknown>,
): Promise<unknown> => {
  const { config, response } = error;

  if (response?.status !== 401 || !config || shouldSkipRefresh(config) || config._retry) {
    return Promise.reject(error);
  }

  const originalConfig = config;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({
        resolve: (token) => {
          originalConfig.headers.set('Authorization', `Bearer ${token}`);
          resolve(retry({ ...originalConfig, _retry: true }));
        },
        reject,
      });
    });
  }

  isRefreshing = true;
  originalConfig._retry = true;

  try {
    const newToken = await refreshAccessToken();
    flushQueue(null, newToken);
    originalConfig.headers.set('Authorization', `Bearer ${newToken}`);
    return retry(originalConfig);
  } catch (refreshError) {
    const err = refreshError instanceof Error ? refreshError : new Error('刷新 token 失败');
    flushQueue(err);
    clearAuth();
    window.location.href = '/login';
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};
