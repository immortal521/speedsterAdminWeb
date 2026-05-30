import { Spin } from 'antd';

import './index.css';

export const Loading = () => {
  return (
    <div className="loading-page">
      <Spin size="large" />
    </div>
  );
};
