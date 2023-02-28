import React from 'react';
import s from './LoaderCentered.module.css';

const LoaderCentered: React.FC = () => (
  <div className={s.lds_ellipsis}>
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default LoaderCentered;
