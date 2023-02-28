/* eslint-disable prefer-regex-literals */
import React, { useState, useEffect } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {
  Button, Input, Modal, Form,
} from 'antd';
import common from '../Modals.module.css';
import { ModalsTypes } from '../../../../types/popUp';
import useActions from '../../../../hooks/useActions';
import useTypedSelector from '../../../../hooks/useTypedSelector';

interface LoginModalProps {
}

const LoginModal: React.FC<LoginModalProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { authUser, setCurrentModal } = useActions();
  const { isAuth } = useTypedSelector((state) => state.auth);
  const pupups = useTypedSelector((state) => state.popUps);
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);

  function handleSubmit() {
    setConfirmLoading(true);
    setTimeout(() => {
      setIsValid(isAuth);
      setConfirmLoading(!isAuth);
      setConfirmLoading(false);
    }, 1500);
    if (password && email) {
      authUser(email, password, () => setCurrentModal(ModalsTypes.null));
    }
  }

  useEffect(() => {
    setVisible(pupups.currentModal === 'login');
  }, [pupups]);

  useEffect(() => {
    setIsValid(true);
    setConfirmLoading(false);
  }, [isAuth]);

  const handleCancel = () => {
    setVisible(false);
    setCurrentModal(ModalsTypes.null);
  };

  const onFinishFailed = () => {

  };

  const iconRender = (isVisible: boolean) => (isVisible
    ? <EyeTwoTone /> : <EyeInvisibleOutlined />);

  return (
    <Modal
      centered
      title="Вход"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{
        width: '80%',
        margin: '0 auto',
      }}
    >
      <Form onFinishFailed={onFinishFailed} onFinish={handleSubmit}>
        <Form.Item
          name="login"
          className={common.input_title}
          label="Введите почту"
          rules={[{
            required: true,
            message: 'Пожалуйста, введите почту корректно!',
            pattern: new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/),
          },
          ]}
        >
          <Input
            className="input-custom"
            required
            name="login"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          help={!isValid ? 'Неверные данные для входа' : null}
          validateStatus={isValid ? 'success' : 'error'}
          rules={[{ required: true }]}
          className={common.input_title}
          label="Введите пароль"
        >
          <Input.Password
            className="input-custom"
            required
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
            iconRender={iconRender}
          />
        </Form.Item>
        <div style={{ fontSize: '12px', paddingTop: '7px', color: '#505050' }}>
          <span>Забыли пароль? </span>
          <span
            className={common.link}
            onClick={async () => {
              await handleCancel();
              await setCurrentModal(ModalsTypes.remindPass);
            }}
          >
            Восстановить
          </span>
        </div>
        <div className={common.footer}>
          <Button
            type="primary"
            className={common.button}
            loading={confirmLoading}
            htmlType="submit"
          >
            Войти
          </Button>
          <div>
            Нет аккаунта?
            {' '}
            <span
              className={common.link}
              onClick={async () => {
                await handleCancel();
                await setCurrentModal(ModalsTypes.reg);
              }}
            >
              Регистрация
            </span>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;
