import React from 'react';

const Icon: React.FC<{ type: string; className: string }> = (props) => {
  const { type, className } = props;
  return (
    <>{React.createElement(type, { className })}</>
  );
};

export default Icon;
