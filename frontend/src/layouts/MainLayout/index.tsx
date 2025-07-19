import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  ReadOutlined,
  SoundOutlined,
  EditOutlined,
  ExperimentOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { appConfig } from '../../config';
import './style.css';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 菜单项配置
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'vocabulary',
      icon: <BookOutlined />,
      label: '词汇管理',
      children: [
        {
          key: 'part-of-speech',
          label: '词性管理',
          onClick: () => navigate('/vocabulary/part-of-speech'),
        },
        {
          key: 'word',
          label: '单词管理',
          onClick: () => navigate('/vocabulary/word'),
        },
        {
          key: 'word-book',
          label: '单词本管理',
          onClick: () => navigate('/vocabulary/word-book'),
        },
      ],
    },
    {
      key: 'content',
      icon: <ReadOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'sentence',
          label: '句子管理',
          onClick: () => navigate('/content/sentence'),
        },
        {
          key: 'article',
          label: '文章管理',
          onClick: () => navigate('/content/article'),
        },
        {
          key: 'writing-topics',
          label: '写作主题管理',
          onClick: () => navigate('/content/writing-topics'),
        },
      ],
    },
    {
      key: 'practice',
      icon: <SoundOutlined />,
      label: '练习模块',
      children: [
        {
          key: 'dictation',
          label: '听写练习',
          onClick: () => navigate('/practice/dictation'),
        },
        {
          key: 'writing',
          label: '写作练习',
          onClick: () => navigate('/practice/writing'),
        },
      ],
    },
    {
      key: 'test',
      icon: <ExperimentOutlined />,
      label: '测试模块',
      children: [
        {
          key: 'comprehensive',
          label: '综合测试',
          onClick: () => navigate('/test/comprehensive'),
        },
      ],
    },
  ];

  // 用户下拉菜单
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人资料',
      },
      {
        key: 'activities',
        icon: <BookOutlined />,
        label: '我的活动',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        // 处理退出登录逻辑
        navigate('/auth/login');
      } else if (key === 'profile') {
        // 处理个人资料逻辑
        navigate('/profile');
      } else if (key === 'activities') {
        // 跳转到用户活动页面
        navigate('/user/activities');
      }
    },
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    const parts = path.split('/');
    
    if (parts.length >= 3) {
      // 如果是二级菜单，返回二级菜单的key
      return [parts[2]];
    } else if (parts.length === 2 && parts[1]) {
      // 如果是一级菜单，返回一级菜单的key
      return [parts[1]];
    }
    
    // 默认选中仪表盘
    return ['dashboard'];
  };

  // 获取当前展开的子菜单
  const getOpenKeys = () => {
    const path = location.pathname;
    const parts = path.split('/');
    
    if (parts.length >= 2 && parts[1]) {
      return [parts[1]];
    }
    
    return [];
  };
  
  // 当路由变化时更新openKeys
  useEffect(() => {
    const currentOpenKeys = getOpenKeys();
    setOpenKeys(currentOpenKeys);
  }, [location.pathname]);
  
  // 处理子菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div className="logo">
          {!collapsed && <span>{appConfig.appName}</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="header-content">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-button"
            />
            <div className="header-right">
              <Dropdown menu={userMenu} placement="bottomRight">
                <div className="user-info">
                  <Avatar icon={<UserOutlined />} />
                  {!collapsed && <span className="username">管理员</span>}
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          className="main-content"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;