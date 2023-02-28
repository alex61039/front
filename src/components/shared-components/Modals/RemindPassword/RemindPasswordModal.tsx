/* eslint-disable prefer-regex-literals */
import React, {
  LegacyRef, useEffect, useRef, useState,
} from 'react';
import {
  Button, Form, Input, Modal,
} from 'antd';
import { authApi } from 'src/api/api';
import ReCAPTCHA from 'react-google-recaptcha';
import { ModalsTypes } from '../../../../types/popUp';
import common from '../Modals.module.css';
import useActions from '../../../../hooks/useActions';
import useTypedSelector from '../../../../hooks/useTypedSelector';

interface RemindPasswordModalProps {
}

const RemindPasswordModal: React.FC<RemindPasswordModalProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [captchaData, setCaptchaData] = useState<null | string>('');
  const [isUserMatch, setIsUserMatch] = useState<null | boolean>(true);

  const reRef = useRef();

  const { setCurrentModal } = useActions();
  const pupups = useTypedSelector((state) => state.popUps);
  const { showErr } = useActions();
  useEffect(() => {
    setVisible(pupups.currentModal === ModalsTypes.remindPass);
  }, [pupups]);

  const handleCancel = () => {
    setVisible(false);
    setCurrentModal(ModalsTypes.null);
  };

  const handleSubmit = () => {
    authApi.remindPassword(email, captchaData).then((res) => {
      if (res.data.result) {
        showErr('Письмо с подтверждением отправлено вам на почту!');
        setCurrentModal(ModalsTypes.null);
        setIsUserMatch(true);
      } else {
        setCaptchaData(null);

        if (reRef.current) {
          (reRef.current as unknown as HTMLFormElement).reset();
        }

        setIsUserMatch(false);
      }
    });
  };

  return (
    <Modal
      centered
      onCancel={handleCancel}
      title="Восстановление пароля"
      visible={visible}
      footer={null}
      bodyStyle={{
        width: '80%',
        margin: '0 auto',
      }}
    >
      <Form
        action=""
        onFinish={handleSubmit}
      >
        <div className={common.body}>
          <div className={common.body_inner}>
            <div className={common.input_wrap}>
              <Form.Item
                label="Введите почту для восстановления пароля:"
                name="login"
                extra={!isUserMatch
                  ? <span style={{ color: '#FF4D4F' }}>Пользователь не найден!</span> : ''}
                rules={[{
                  required: true,
                  message: 'Пожалуйста, введите свою почту корректно!',
                  pattern: new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/),
                }]}
              >
                <Input
                  className={common.input_item}
                  name="login"
                  type="email"
                  placeholder="Почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

            </div>
            <Form.Item
              name="captcha"
              rules={[{
                required: true,
                message: 'Пожалуйста, введите капчу!',
              }]}
            >
              <ReCAPTCHA
                ref={reRef as unknown as LegacyRef<ReCAPTCHA> | undefined}
                sitekey="6LfCI9UZAAAAADF8YxsMgiAfN51CoJ5TNRu8J8fU"
                onChange={(value) => setCaptchaData(value)}
              />
            </Form.Item>
          </div>
        </div>
        <div className={common.footer}>
          <Button
            type="primary"
            htmlType="submit"
            className={common.button}
          >
            Отправить
          </Button>
          <span>
            Уже есть аккаунт?
            {' '}
            <span
              className={common.link}
              onClick={async () => {
                await setCurrentModal(ModalsTypes.login);
              }}
            >
              Войти
            </span>
          </span>
        </div>
      </Form>
    </Modal>
  );
};

export default RemindPasswordModal;
