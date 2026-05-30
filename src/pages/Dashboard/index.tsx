import { DollarOutlined, ShopOutlined, ShoppingOutlined, UserAddOutlined } from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';

import './index.css';

const statCards = [
  { label: '今日订单', value: '1,286', icon: <ShoppingOutlined /> },
  { label: '今日成交额', value: '¥ 86,420', icon: <DollarOutlined /> },
  { label: '新增用户', value: '328', icon: <UserAddOutlined /> },
  { label: '商家总数', value: '156', icon: <ShopOutlined /> },
];

const quickEntries = [
  { title: '订单管理', desc: '查看与处理平台订单' },
  { title: '商家管理', desc: '审核入驻与运营状态' },
  { title: '用户管理', desc: '维护 C 端用户信息' },
  { title: '系统设置', desc: '配置平台基础参数' },
];

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-page-welcome">
        <h2>欢迎回来，管理员</h2>
        <p>这里是 Speedster 外卖平台管理后台，你可以在此查看核心运营数据并管理业务模块。</p>
      </div>

      <Row gutter={[16, 16]}>
        {statCards.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.label}>
            <Card className="dashboard-page-stat-card" bordered={false}>
              <div className="dashboard-page-stat-row">
                <div>
                  <div className="dashboard-page-stat-value">{item.value}</div>
                  <div className="dashboard-page-stat-label">{item.label}</div>
                </div>
                <span className="dashboard-page-quick-icon">{item.icon}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="数据概览" bordered={false} className="dashboard-page-quick-card">
            <Typography.Paragraph type="secondary" className="dashboard-page-overview-desc">
              当前为演示数据，后续接入接口后将展示订单趋势、热门商品等图表。
            </Typography.Paragraph>
            <div className="dashboard-page-chart-placeholder">图表区域（待接入）</div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="快捷入口" bordered={false} className="dashboard-page-quick-card">
            {quickEntries.map((item) => (
              <div className="dashboard-page-quick-item" key={item.title}>
                <div className="dashboard-page-quick-icon">
                  <ShopOutlined />
                </div>
                <div>
                  <div className="dashboard-page-quick-title">{item.title}</div>
                  <div className="dashboard-page-quick-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
