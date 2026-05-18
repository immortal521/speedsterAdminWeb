import request from '../utils/request';

export interface ILoginParams {
  username: string;
  password: string;
}

export interface ILoginResult {
  token: string;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
}

export const fetchLogin = async (values: ILoginParams) => {
  const response = await request.post<ILoginResult>('/api/user/login', values);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await request.get<ILoginResult['user']>('/api/user/profile');
  return response.data;
};
