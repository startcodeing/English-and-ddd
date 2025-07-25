import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './utils/dayjs';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 开发环境禁用严格模式
if (import.meta.env.PROD) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(<App />);
}

// 替代 reportWebVitals
if (import.meta.env.DEV) {
  console.log('Running in development mode');
}