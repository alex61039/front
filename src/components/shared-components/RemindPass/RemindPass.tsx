import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Input } from 'antd';
import routes from 'src/routes';
import { authApi } from '../../../api/api';
import common from '../Modals/Modals.module.css';
import useActions from '../../../hooks/useActions';

const RemindPass: React.FC = () => {
  const location = useLocation();
  const { showErr } = useActions();

  const [pass, setPass] = useState('');
  const [code, setCode] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pass.length < 6) {
      showErr('Длина пароля должна быть больше 6 символов!');
    } else {
      authApi
        .setNewPassword(pass, code)
        .then((res) => {
          if (res.data.result) {
            showErr('Пароль сменен!');
            setTimeout(() => {
              window.location.href = routes.index;
            }, 3000);
          } else showErr('Ошибка');
        })
        .catch((err) => {
          showErr(err.message);
        });
    }
  }

  useEffect(() => {
    const newCode = location.search.slice(6);
    setCode(newCode);
  }, []);

  return (
    <div style={{ textAlign: 'center', fontSize: '35px' }}>
      <form
        action=""
        onSubmit={(e) => handleSubmit(e)}
        style={{ width: '70%', margin: '0 auto' }}
      >
        Смена пароля
        <div className={common.input_title}>Введите новый пароль</div>
        <Input
          className="input-custom"
          required
          name="password"
          type="password"
          placeholder="Новый пароль"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Button type="primary" htmlType="submit" className={common.button}>
          Отправить
        </Button>
      </form>
    </div>
  );
};

export default RemindPass;
