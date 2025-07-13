import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/authSlice';
import { appConfig } from '../../../config';
import { saveToken, saveUserInfo } from '../../../utils/auth';
import './style.css';

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // 这里应该调用实际的登录API
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      // 在实际应用中，这里应该保存从后端获取的token
      const token = 'mock-token';
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      
      // 使用auth工具函数保存token
      saveToken(token, expiryTime);
      
      // 模拟用户信息
      const mockUser = {
        id: '1',
        username: values.username,
        email: `${values.username}@example.com`,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // 保存用户信息到localStorage，使用UserInfo格式
      saveUserInfo({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        roles: [mockUser.role]
      });
      
      // 更新Redux状态
      dispatch(loginSuccess({ user: mockUser, token }));
      
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>{appConfig.appName}</h1>
          <p>欢迎回来，请登录您的账号</p>
        </div>
        
        <Card className="login-card">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="密码" 
              />
            </Form.Item>
            
            <Form.Item>
              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                
                <a className="login-forgot" href="#">
                  忘记密码
                </a>
              </div>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="login-button"
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
            
            <div className="login-footer">
              还没有账号？ <Link to="/auth/register">立即注册</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;