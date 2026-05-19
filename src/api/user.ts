import request from '../utils/request';

export interface ILoginParams {
  username: string;
  password: string;
}

export interface ILoginResult {
  token: string;
}

export const fetchLogin = (values: ILoginParams) => {
  return request.post<ILoginResult>('/api/user/login', values);
};
