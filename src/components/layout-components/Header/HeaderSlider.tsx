import React, { useEffect, useState } from 'react';
import { slide as Slide } from 'react-burger-menu';
import './HeaderSide.css';
import { Link, useHistory } from 'react-router-dom';
import {
  ContactsOutlined,
  FileTextOutlined,
  HomeOutlined, LoginOutlined, LogoutOutlined,
  QuestionCircleOutlined, SettingOutlined,
} from '@ant-design/icons';
import routes from 'src/routes';
import { ActionsTypes, ModalsTypes } from '../../../types/popUp';
import { store } from '../../../store';
import { logOut } from '../../../store/action-creators/auth';
import useActions from '../../../hooks/useActions';
import useTypedSelector from '../../../hooks/useTypedSelector';

const HeaderSlider: React.FC = () => {
  const { setCurrentModal } = useActions();
  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuth } = useTypedSelector((state) => state.auth);
  const { isProvider } = useTypedSelector((state) => state.userProfile);

  const onClickLogin = () => {
    setIsMenuOpen(false);
    setCurrentModal(ModalsTypes.login);
  };

  const closeModal = () => {
    setIsMenuOpen(false);
  };

  const onLogout = () => {
    closeModal();
    store.dispatch(logOut());
    history.push(routes.index);
  };

  useEffect(() => {
    store.dispatch({
      type: ActionsTypes.SIDEBAR_OPENED,
      payload: isMenuOpen,
    });
  }, [isMenuOpen]);

  return (
    <div className="mobile_header_container">
      {!isAuth
        ? (
          <Slide
            isOpen={isMenuOpen}
            onStateChange={(state) => {
              setIsMenuOpen(state.isOpen);
            }}
          >
            <div onClick={onClickLogin} className="menu-item">
              <LoginOutlined />
              <span className="link-text">Войти</span>
            </div>
            <Link onClick={closeModal} className="menu-item" to={routes.index}>
              <HomeOutlined />
              <span className="link-text">Главная</span>
            </Link>
            <Link onClick={closeModal} className="menu-item" to={routes.about}>
              <QuestionCircleOutlined />
              <span className="link-text">О нас</span>
            </Link>
            <Link onClick={closeModal} className="menu-item" to={routes.contacts}>
              <ContactsOutlined />
              <span className="link-text">Контакты</span>
            </Link>
          </Slide>
        )
        : (
          <Slide isOpen={isMenuOpen} onStateChange={(state) => setIsMenuOpen(state.isOpen)}>
            <Link onClick={closeModal} className="menu-item" to={routes.index}>
              <HomeOutlined />
              <span className="link-text">Главная</span>
            </Link>
            {!isProvider ? (
              <Link onClick={closeModal} className="menu-item" to={routes.personal}>
                <FileTextOutlined />
                <span className="link-text">Мои заявки</span>
              </Link>
            ) : (
              <Link onClick={closeModal} className="menu-item" to={routes.personal}>
                <FileTextOutlined />
                <span className="link-text">Мои предложения</span>
              </Link>
            )}
            <Link onClick={closeModal} className="menu-item" to={routes.about}>
              <QuestionCircleOutlined />
              <span className="link-text">О нас</span>
            </Link>
            <Link onClick={closeModal} className="menu-item" to={routes.contacts}>
              <ContactsOutlined />
              <span className="link-text">Контакты</span>
            </Link>
            <Link onClick={closeModal} className="menu-item" to={routes.settings}>
              <SettingOutlined />
              <span className="link-text">Настройки</span>
            </Link>
            <div onClick={onLogout} className="menu-item">
              <LogoutOutlined />
              <span className="link-text">Выход</span>
            </div>
          </Slide>
        )}
      <div className="header_title"><Link to={routes.index}>DentMarketPlace</Link></div>

    </div>

  );
};

export default HeaderSlider;
