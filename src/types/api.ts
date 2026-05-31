/** 统一 API 响应结构（与后端约定） */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg: string;
  success?: boolean;
}

/** 登录 / 刷新 token 返回的 data 结构 */
export interface AuthTokenData {
  accessToken: string;
  refreshToken: string;
  time?: string;
}

/** 分页响应结构 */
export interface PaginatedData<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
