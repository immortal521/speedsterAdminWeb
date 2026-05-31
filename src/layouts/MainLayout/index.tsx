import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  DashboardOutlined,
  LogoutOutlined,
  ShopOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, type MenuProps, Space, Typography } from 'antd';

import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/userSlice';

import './index.css';

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: '用户管理',
    disabled: true,
  },
  {
    key: '/merchants',
    icon: <ShopOutlined />,
    label: '商家管理',
    disabled: true,
  },
  {
    key: '/orders',
    icon: <ShoppingOutlined />,
    label: '订单管理',
    disabled: true,
  },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="main-layout">
      <Sider width={220} theme="dark">
        <div className="main-layout-logo">
          <DashboardOutlined className="main-layout-logo-icon" />
          <span>Speedster 管理后台</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="main-layout-header">
          <Typography.Text className="main-layout-header-title">外卖平台运营管理</Typography.Text>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="main-layout-user-trigger">
              <Avatar size="small" icon={<UserOutlined />} />
              <span>管理员</span>
            </Space>
          </Dropdown>
        </Header>
        <Content className="main-layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
