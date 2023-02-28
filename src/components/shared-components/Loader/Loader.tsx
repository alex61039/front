import React from 'react';
import s from './Loader.module.css';

const Loader: React.FC = () => (
  <div className={s.lds_ellipsis}>
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default Loader;
