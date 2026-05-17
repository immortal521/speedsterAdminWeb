import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';

import { setToken } from '../../store/slices/userSlice';
import request from '../../utils/request';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 登录表单提交
  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      // 这里写你的登录接口请求
      const res = await request.post('/api/user/login', values);

      // 登录成功后：存redux + 跳转首页
      dispatch(setToken(res.data.token));
      message.success('登录成功');
      navigate('/');
    } catch {
      // message.error('账号密码错误，请重试');
    } finally {
      setLoading(false);
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
