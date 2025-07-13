import React from 'react';
import { Typography, Card } from 'antd';
import './style.css';

const { Title } = Typography;

const WritingPage: React.FC = () => {
  return (
    <div className="writing-container">
      <div className="writing-header">
        <div className="menu-title">
          <Title level={4}>写作练习</Title>
        </div>
      </div>
      
      <div className="writing-content">
        <Card className="developing-card">
          <div className="developing-message">
            under active developing...
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WritingPage;