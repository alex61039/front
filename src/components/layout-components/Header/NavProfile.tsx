import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';

import { Link, useHistory } from 'react-router-dom';
import {
  SettingOutlined, FileTextOutlined, LogoutOutlined, DownOutlined,
} from '@ant-design/icons';
import routes from 'src/routes';
import useTypedSelector from '../../../hooks/useTypedSelector';
import Icon from '../../util-components/Icon';
import './NavProfile.css';

function NavProfile() {
  const history = useHistory();
  const user = useTypedSelector((state: { userProfile: any; }) => state.userProfile);

  const menuItem = [
    {
      title: user.isProvider ? 'Мои предложения' : 'Мои заявки',
      icon: FileTextOutlined,
      path: routes.personal,
    },
    {
      title: 'Настройки',
      icon: SettingOutlined,
      path: routes.settings,
    },
  ];
  const profileImg = '/img/avatars/thumb-1.jpg';
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar
            style={{ background: '#918aff' }}
            size={55}
            src={profileImg}
          >
            {user.name ? user.name[0].toUpperCase() : ''}
          </Avatar>
          <div className="pl-3">
            <h4 className="mb-0">{user.name ? user.name : ''}</h4>
            <span className="text-muted">{user.isProvider ? 'Поставщик' : 'Заказчик'}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          {menuItem.map((el) => (
            <Menu.Item key={el.title}>
              <Link to={el.path}>
                <Icon className="mr-3" type={el.icon as any} />
                <span className="font-weight-normal">{el.title}</span>
              </Link>
            </Menu.Item>
          ))}
          <Menu.Item
            key={menuItem.length + 1}
            onClick={() => {
              history.push(routes.logout);
            }}
          >
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">Выход</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown arrow placement="bottomRight" overlay={profileMenu} trigger={['click']}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <span className="user-name-dropdown">{user.name ? user.name : ''}</span>
          <Avatar
            style={{ background: '#918aff' }}
            size={40}
            src={profileImg}
          >
            {user.name[0] ? user.name[0].toUpperCase() : ''}
          </Avatar>
          <DownOutlined className="navArrow" />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}

export default NavProfile;
