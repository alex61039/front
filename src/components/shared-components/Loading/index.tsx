import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Icon = <LoadingOutlined style={{ fontSize: 35 }} spin />;

const Loading: React.FC<{ align: string; cover: string; }> = (props) => {
  const { align = 'center', cover = 'inline' } = props;
  return (
    <div className={`loading text-${align} cover-${cover}`}>
      <Spin indicator={Icon} />
    </div>
  );
};

export const LoadingButton: React.FC<{ align?: string; cover?: string; }> = (props) => {
  const icon = <LoadingOutlined style={{ fontSize: 20 }} spin />;
  const { align = 'center', cover = 'inline' } = props;
  return (
    <div className={`loading text-${align} cover-${cover}`}>
      <Spin indicator={icon} />
    </div>
  );
};

export default Loading;
