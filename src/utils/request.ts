import { notification } from 'antd';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import { clearAuth, getToken } from './auth';

// 扩展 InternalAxiosRequestConfig 类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** 是否显示错误提示，默认 true */
    showError?: boolean;
    /** 是否显示成功提示，默认 false */
    showSuccess?: boolean;
  }
}

// 响应数据结构（根据后端实际返回调整）
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 分页响应结构
export interface PaginatedData<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求时间戳防止缓存（仅 GET 请求）
    // if (config.method?.toUpperCase() === 'GET') {
    //   config.params = {
    //     ...config.params,
    //     _t: Date.now(),
    //   };
    // }
    console.log('dayw', config);

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
      clearAuth();
      // 跳转到登录页
      window.location.href = '/login';
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

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data, config } = response;
    console.log('打印', response);
    // debugger;
    const { code, message } = data;

    // 文件下载 / Blob 响应直接返回
    if (config.responseType === 'blob') {
      return response;
    }

    // 业务成功
    if (code === 0 || code === 200) {
      // 成功提示
      if (config.showSuccess && message) {
        notification.success({
          message: '操作成功',
          description: message,
          placement: 'topRight',
        });
      }
      return data;
    }

    // 业务错误
    if (config.showError !== false) {
      notification.error({
        message: '请求失败',
        description: message,
        placement: 'topRight',
      });
    }

    return Promise.reject(new Error(message || '请求失败'));
  },
  (error: AxiosError<ApiResponse>) => {
    const { response, config } = error;

    // 请求被取消，不处理
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // 网络错误（无响应）
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
    const errorMsg = errorHandler(status, data?.message || '');

    // 401 错误已经在上层处理了跳转逻辑
    if (status !== 401 && config?.showError !== false) {
      notification.error({
        message: `请求错误 ${status}`,
        description: errorMsg,
        placement: 'topRight',
      });
    }

    return Promise.reject(new Error(errorMsg));
  },
);

export default request;
