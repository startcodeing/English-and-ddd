import React from 'react';
import { Typography, Card } from 'antd';
import './style.css';

const { Title } = Typography;

const DictationPage: React.FC = () => {
  return (
    <div className="dictation-container">
      <div className="dictation-header">
        <div className="menu-title">
          <Title level={4}>听写练习</Title>
        </div>
      </div>
      
      <div className="dictation-content">
        <Card className="developing-card">
          <div className="developing-message">
            under active developing...
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DictationPage;