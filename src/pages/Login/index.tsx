import { useNavigate } from 'react-router-dom';

import { DashboardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';

import type { ILoginParams } from '@/api/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, selectUserLoading } from '@/store/slices/userSlice';

import './index.css';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectUserLoading);

  const onFinish = async (values: ILoginParams) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success('登录成功');
      navigate('/dashboard', { replace: true });
    } catch {
      // 错误提示由 request 拦截器统一处理
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-brand">
        <div className="login-page-brand-content">
          <div className="login-page-brand-logo">
            <DashboardOutlined />
          </div>
          <h1>Speedster 管理后台</h1>
          <p>外卖平台运营管理中枢，统一管理用户、商家、订单与配送业务。</p>
          <div className="login-page-features">
            <div className="login-page-feature-item">
              <span className="login-page-feature-dot" />
              实时掌握平台核心运营数据
            </div>
            <div className="login-page-feature-item">
              <span className="login-page-feature-dot" />
              高效管理商家入驻与商品信息
            </div>
            <div className="login-page-feature-item">
              <span className="login-page-feature-dot" />
              全流程订单跟踪与权限管控
            </div>
          </div>
        </div>
      </div>

      <div className="login-page-panel">
        <Card className="login-page-card" variant={'borderless'}>
          <div className="login-page-card-header">
            <h2>欢迎登录</h2>
            <p>请输入您的账号和密码</p>
          </div>
          <Form
            name="login"
            size="large"
            className="login-page-form"
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
              <Input prefix={<UserOutlined />} placeholder="请输入账号" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
            </Form.Item>

            <Form.Item className="login-page-form-submit">
              <Button type="primary" htmlType="submit" block loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
