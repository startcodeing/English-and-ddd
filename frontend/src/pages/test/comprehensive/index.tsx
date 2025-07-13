import React from 'react';
import { Typography, Card } from 'antd';
import './style.css';

const { Title } = Typography;

const ComprehensiveTestPage: React.FC = () => {
  return (
    <div className="test-container">
      <div className="test-header">
        <div className="menu-title">
          <Title level={4}>综合测试</Title>
        </div>
      </div>
      
      <div className="test-content">
        <Card className="developing-card">
          <div className="developing-message">
            under active developing...
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveTestPage;