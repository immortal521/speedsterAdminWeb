import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { router } from './router';
import { store } from './store';

import './index.css';

import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>,
);
