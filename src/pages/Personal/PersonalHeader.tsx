import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';

import routes from 'src/routes';
import useTypedSelector from '../../hooks/useTypedSelector';

import s from './PersonalHeader.module.css';

function PersonalHeader() {
  const { isProvider } = useTypedSelector((state) => state.userProfile);

  return (
    <div className={s.personal}>
      <div className={s.settingHeader}>
        {isProvider !== null && !isProvider
          ? (
            <Link to={routes.new}>
              <Button type="default" icon={<PlusOutlined />} size="large">
                Создать
                заявку
              </Button>
            </Link>
          )
          : <div />}

        {isProvider !== null && !isProvider ? (
          <Link to={routes.settings}>
            <div className={s.settingsContainer}>
              <Button type="default" icon={<SettingOutlined />} size="large">Настройки</Button>
            </div>
          </Link>
        ) : ''}
      </div>
    </div>
  );
}

export default PersonalHeader;
