import type { AuthTokenData } from '@/types/api';
import request from '@/utils/request';

export interface ILoginParams {
  username: string;
  password: string;
}

export type ILoginResult = AuthTokenData;

export const fetchLogin = (values: ILoginParams) => {
  return request.post<ILoginResult>('/api/user/login', values, { _skipAuth: true });
};

/** POST /user/refresh，body: { refreshToken } */
export const fetchRefreshToken = (refreshToken: string) => {
  return request.post<AuthTokenData>(
    '/api/user/refresh',
    { refreshToken },
    {
      _skipAuth: true,
      _skipTokenRefresh: true,
      showError: false,
    },
  );
};
