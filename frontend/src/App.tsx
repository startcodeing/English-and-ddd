import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import zhCN from 'antd/lib/locale/zh_CN';
import router from './routes';
import store from './store';
import InitializeAuth from './components/InitializeAuth';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <InitializeAuth />
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
};

export default App;
