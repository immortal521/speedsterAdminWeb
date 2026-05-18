import { useNavigate } from 'react-router-dom';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';

import type { ILoginParams } from '../../api/user';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, selectUserLoading } from '../../store/slices/userSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectUserLoading);

  // 登录表单提交
  const onFinish = async (values: ILoginParams) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success('登录成功');
      navigate('/');
    } catch {
      // 错误提示由 request 拦截器统一处理
    }
  };

  return (
    <div className="login-box">
      <Card title="系统登录" style={{ width: 400 }}>
        <Form name="login" autoComplete="off" onFinish={onFinish}>
          {/* 账号输入框 */}
          <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
            <Input prefix={<UserOutlined />} placeholder="请输入账号" />
          </Form.Item>

          {/* 密码输入框 */}
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          {/* 登录按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
