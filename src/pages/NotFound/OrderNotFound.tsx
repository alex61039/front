import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes';
import s from './NotFounds.module.css';

function OrderNotFound() {
  return (
    <div className={s.notfound_container}>
      <div className={s.notfound}>
        <div className={s.notfound_404}>
          <h1>404</h1>
        </div>
        <h2>Заказ не найден</h2>
        <p />
        <Link to={routes.index}>Вернуться на главную</Link>
      </div>
    </div>
  );
}

export default OrderNotFound;
