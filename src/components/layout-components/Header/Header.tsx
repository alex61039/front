import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes';
import s from './Header.module.css';
import Loader from '../../shared-components/Loader/Loader';
import { ModalsTypes } from '../../../types/popUp';
import useActions from '../../../hooks/useActions';
import useTypedSelector from '../../../hooks/useTypedSelector';
import NavProfile from './NavProfile';

function Header() {
  const { isAuth, isFetching } = useTypedSelector((state) => state.auth);
  const { setCurrentModal } = useActions();
  return (
    <header className={s.header}>
      <div className={s.left}>
        <Link to={routes.index} className={s.logo}>
          DentMarketPlace
        </Link>
        <Link to={routes.about} className={s.link}>
          О нас
        </Link>
        <Link to={routes.contacts} className={`${s.link} ${s.link_contacts}`}>
          Контакты
        </Link>
      </div>
      <div className="header-right">
        {isFetching && (
          <div className={s.loader}>
            <Loader />
          </div>
        )}
        {!isFetching && isAuth && (
          <NavProfile />
        )}
        {!isFetching && !isAuth && (
          <>
            <div
              className="link-reg"
              onClick={() => setCurrentModal(ModalsTypes.reg)}
            >
              Регистрация
            </div>
            <div
              className="link-reg"
              onClick={() => setCurrentModal(ModalsTypes.login)}
            >
              Вход
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
