import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ContainerOutlined,
  CloudServerOutlined,
  ApiOutlined,
  MonitorOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/containers',
      icon: <ContainerOutlined />,
      label: '容器管理',
    },
    {
      key: '/deployments',
      icon: <CloudServerOutlined />,
      label: '部署管理',
    },
    {
      key: '/services',
      icon: <ApiOutlined />,
      label: '服务管理',
    },
    {
      key: '/monitoring',
      icon: <MonitorOutlined />,
      label: '监控告警',
    },
  ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar; 