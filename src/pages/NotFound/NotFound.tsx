import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes';
import s from './NotFounds.module.css';

function NotFound() {
  return (
    <div className={s.notfound_container}>
      <div className={s.notfound}>
        <div className={s.notfound_404}>
          <h1>404</h1>
        </div>
        <h2>Страница не найдена!</h2>
        <p>
          Эта страница не найдена или была удалена, пожалуйста,
          пройдите на главную по кнопке ниже

        </p>
        <Link to={routes.index}>Вернуться на главную</Link>
      </div>
    </div>
  );
}

export default NotFound;
