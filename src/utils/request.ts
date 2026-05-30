import { notification } from 'antd';
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

import type { ApiResponse } from '../types/api';
import { clearAuth, getToken } from './auth';
import { handleUnauthorized } from './tokenRefresh';

// 扩展 InternalAxiosRequestConfig 类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** 是否显示错误提示，默认 true */
    showError?: boolean;
    /** 是否显示成功提示，默认 false */
    showSuccess?: boolean;
    /** 是否跳过 401 自动刷新 */
    _skipTokenRefresh?: boolean;
    /** 是否为刷新后的重试请求 */
    _retry?: boolean;
    /** 是否不携带 Authorization（登录、刷新 token 等） */
    _skipAuth?: boolean;
  }
}

export type { ApiResponse, PaginatedData } from '../types/api';

type RequestConfig = AxiosRequestConfig &
  Pick<InternalAxiosRequestConfig, '_skipAuth' | '_skipTokenRefresh' | 'showError' | 'showSuccess'>;

// 内部 axios 实例（拦截器必须返回 AxiosResponse）
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config._skipAuth) {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return { ...config, showError: true };
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 错误处理映射
// TODO: 后续处理为国际化
const errorHandler = (status: number, message: string) => {
  switch (status) {
    case 400:
      return '请求参数错误';
    case 401:
      return '登录已过期，请重新登录';
    case 403:
      return '没有权限访问该资源';
    case 404:
      return '请求的资源不存在';
    case 500:
      return '服务器内部错误';
    case 502:
      return '网关错误';
    case 503:
      return '服务不可用，请稍后再试';
    default:
      return message || '请求失败';
  }
};

// 响应拦截器：将业务 data 写入 response.data，供外层 request 再解包
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data, config } = response;
    const { code, msg } = data;

    if (config.responseType === 'blob') {
      return response;
    }

    if (code === 0 || code === 200) {
      if (config.showSuccess === true && msg) {
        notification.success({
          message: '操作成功',
          description: msg,
          placement: 'topRight',
        });
      }
      return { ...response, data: data.data };
    }

    if (config.showError !== false) {
      notification.error({
        message: '请求失败',
        description: msg,
        placement: 'topRight',
      });
    }

    return Promise.reject(new Error(msg || '请求失败'));
  },
  async (error: AxiosError<ApiResponse>) => {
    const { response, config } = error;

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // 401：尝试 refresh token 后重试
    if (response?.status === 401 && config) {
      try {
        return await handleUnauthorized(error, (retryConfig) => http.request(retryConfig));
      } catch {
        // handleUnauthorized 内已处理跳转，继续走下方错误提示
      }
    }

    if (!response) {
      if (config?.showError !== false) {
        notification.error({
          message: '网络异常',
          description: '请检查网络连接后重试',
          placement: 'topRight',
        });
      }
      return Promise.reject(new Error('网络异常'));
    }

    const { status, data } = response;
    const errorMsg = errorHandler(status, data?.msg || '');

    if (status === 401) {
      clearAuth();
      window.location.href = '/login';
    } else if (config?.showError !== false) {
      notification.error({
        message: `请求错误 ${status}`,
        description: errorMsg,
        placement: 'topRight',
      });
    }

    return Promise.reject(new Error(errorMsg));
  },
);

/** 对外 request：直接返回业务 data（T），而非 AxiosResponse */
const request = {
  async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const res = await http.get<T>(url, config);
    return res.data;
  },
  async post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const res = await http.post<T>(url, data, config);
    return res.data;
  },
  async put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const res = await http.put<T>(url, data, config);
    return res.data;
  },
  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const res = await http.delete<T>(url, config);
    return res.data;
  },
};

export default request;
export { http };
