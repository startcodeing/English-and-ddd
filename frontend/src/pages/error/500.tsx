import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import './error.css';

const ServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <Result
        status="500"
        title="500"
        subTitle="抱歉，服务器出现了错误。"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default ServerError;