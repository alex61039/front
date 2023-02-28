/* eslint-disable prefer-regex-literals */
import React, {
  LegacyRef, useEffect, useRef, useState,
} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Button, Form, Input, Modal,
} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import common from '../Modals.module.css';
import s from './RegModal.module.css';
import customerImg from '../../../../assets/img/customer.svg';
import providerImg from '../../../../assets/img/provider.svg';
import { authApi } from '../../../../api/api';
import { ModalsTypes } from '../../../../types/popUp';
import useActions from '../../../../hooks/useActions';
import useTypedSelector from '../../../../hooks/useTypedSelector';

interface RegModalProps {
}

const RegModal: React.FC<RegModalProps> = () => {
  const [registrationData, setRegistrationData] = useState<{
    name: string;
    email: string;
    organization: string;
    password: string;
    passwordRepeated: string;
    userType: 'customer' | 'provider',
    providerType: Array<string>
  }>({
    name: '',
    email: '',
    organization: '',
    password: '',
    passwordRepeated: '',
    userType: 'customer',
    providerType: [],
  });

  const [captchaData, setCaptchaData] = useState<string | null>(null);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const reRef = useRef<HTMLFormElement | undefined>();

  const { showErr, authUser, setCurrentModal } = useActions();
  const pupups = useTypedSelector((state) => state.popUps);

  useEffect(() => {
    setVisible(pupups.currentModal === ModalsTypes.reg);
  }, [pupups]);

  useEffect(() => {
    if (registrationData.userType === 'customer') {
      setRegistrationData({ ...registrationData, providerType: [] });
    }
  }, [registrationData.userType]);

  const handleCancel = () => {
    setVisible(false);
    setCurrentModal(ModalsTypes.null);
  };

  const inputHandler = (e: any) => {
    const { value } = e.target;
    setRegistrationData({
      ...registrationData,
      [e.target.name]: value.trim(),
    });
  };

  function addMaterial(name: string, checked: boolean) {
    if (checked) {
      setRegistrationData({
        ...registrationData,

        providerType: [...registrationData.providerType, name],
      });
    } else {
      setRegistrationData({
        ...registrationData,
        providerType: [...registrationData.providerType.filter((material) => material !== name)],
      });
    }
  }

  function handleSubmit() {
    setConfirmLoading(true);
    if (registrationData.userType === 'provider') {
      if (registrationData.providerType.length > 0) {
        authApi
          .reg(
            registrationData.name,
            registrationData.email,
            registrationData.password,
            registrationData.userType,
            registrationData.providerType,
            registrationData.organization,
            captchaData,
          )
          .then((response: any) => {
            if (response.data.result) {
              setIsValid(true);
              authUser(
                registrationData.email,
                registrationData.password,

                () => setCurrentModal(ModalsTypes.null),
              );
              setConfirmLoading(false);
              setCurrentModal(ModalsTypes.confirmEmail);
            } else if (response.data.msg === 'Пользователь уже зарегистрирован!') {
              setIsValid(false);
              setCaptchaData(null);

              reRef.current?.reset();
              setConfirmLoading(false);
            } else if (response.data.msg === 'Ошибка!') {
              setCaptchaData(null);

              reRef.current?.reset();
              setConfirmLoading(false);
            } else if (response.data.msg === 'Пройдите капчу!') {
              setCaptchaData(null);

              reRef.current?.reset();
              setConfirmLoading(false);
            }
          })
          .catch(() => {
            setCaptchaData(null);

            reRef.current?.reset();
            setConfirmLoading(false);
            showErr('Ошибка!');
          });
      } else {
        reRef.current?.reset();
        setConfirmLoading(false);
        showErr('Выберите хотя бы один тип поставщика!');
      }
    } else if (registrationData.userType === 'customer') {
      authApi
        .reg(
          registrationData.name,
          registrationData.email,
          registrationData.password,
          registrationData.userType,
          registrationData.providerType,
          registrationData.organization,
          captchaData,
        )
        .then((response: any) => {
          if (response.data.result) {
            setIsValid(true);
            authUser(
              registrationData.email,
              registrationData.password,

              () => setCurrentModal(ModalsTypes.null),
            );
            setConfirmLoading(false);
            setCurrentModal(ModalsTypes.confirmEmail);
          } else if (response.data.msg === 'Пользователь уже зарегистрирован!') {
            reRef.current?.reset();
            setIsValid(false);
            setConfirmLoading(false);
          } else if (response.data.msg === 'Ошибка!') {
            reRef.current?.reset();
            setConfirmLoading(false);
            showErr('Ошибка!');
          } else if (response.data.msg === 'Пройдите капчу!') {
            setCaptchaData(null);

            reRef.current?.reset();
            setConfirmLoading(false);
          }
        })
        .catch(() => {
          reRef.current?.reset();
          setConfirmLoading(false);
          showErr('Ошибка!');
        });
    }
  }

  const iconRender = (isVisible: boolean) => (isVisible
    ? <EyeTwoTone /> : <EyeInvisibleOutlined />);

  return (
    <Modal
      centered
      title="Регистрация"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{
        width: '80%',
        margin: '0 auto',
      }}
    >
      <Form onFinish={handleSubmit}>
        <div className={common.input_wrap}>
          <Form.Item
            label="Имя"
            name="name"
            rules={[{
              required: true,
              message: 'Пожалуйста, введите свое имя кириллицей!',
              pattern: new RegExp('^[А-Яа-я]+$'),
            }]}
          >
            <Input
              placeholder="Имя"
              maxLength={50}
              className="input-custom"
              name="name"
              type="text"
              onChange={(e) => inputHandler(e)}
            />
          </Form.Item>
        </div>
        <div className={common.input_wrap}>
          <Form.Item
            label="Почта"
            name="email"
            extra={!isValid
              ? <span style={{ color: '#FF4D4F' }}>Такой пользователь уже существует!</span> : ''}
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите свою почту корректно!',
                pattern: new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/),
              },
            ]}
          >
            <Input
              placeholder="Почта"
              className="input-custom"
              name="email"
              type="text"
              onChange={(e: any) => inputHandler(e)}
            />
          </Form.Item>
        </div>
        <div className={common.input_wrap}>
          <div className={common.input_title} style={{ padding: '7px 0' }}>
            Наименование компании
            <span
              style={{ fontSize: '10px', color: 'gray' }}
            >
              (*необязательно к заполнению)
            </span>
          </div>
          <Input
            placeholder="Наименование компании"
            maxLength={50}
            className="input-custom"
            name="organization"
            type="text"
            onChange={(e: any) => inputHandler(e)}
          />
        </div>
        <div className={common.input_wrap}>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{
              required: true,
              message: 'Пароль должен состоять хотя бы из 6 символов!',
              pattern: new RegExp('^(?=.{6,})'),
            }]}
            hasFeedback
          >
            <Input.Password
              className="input-custom"
              name="password"
              onChange={(e: any) => inputHandler(e)}
              placeholder="Пароль"
              iconRender={iconRender}
            />
          </Form.Item>
        </div>
        <div className={common.input_wrap}>
          <Form.Item
            label="Подтверждение пароля"
            name="passwordRepeated"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Пожалуйста, подтвердите пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_: any, value: any) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              className="input-custom"
              name="passwordRepeated"
              onChange={(e: any) => inputHandler(e)}
              placeholder="Пароль ещё раз"
              iconRender={iconRender}
            />
          </Form.Item>

        </div>
        <div className={s.checkbox_container} style={{ display: 'flex' }}>
          <input
            required
            onClick={() => {
              setRegistrationData({
                ...registrationData,
                userType: 'customer',
              });
            }}
            type="radio"
            name="userType"
          />
          <div className={s.checkbox_img}>
            <img src={customerImg} alt="customerImg" />
            <div>Заказчик</div>
          </div>
          <div className={s.checkbox_item}>
            <div className={s.checkbox_input}>
              <input
                onClick={() => {
                  setRegistrationData({
                    ...registrationData,
                    userType: 'provider',
                  });
                }}
                required
                type="radio"
                name="userType"
              />
            </div>
            <div className={s.checkbox_img}>
              <img src={providerImg} alt="providerImg" />
              <div>Поставщик</div>
            </div>
          </div>
        </div>
        {registrationData.userType === 'provider' && (
        <div className={s.extra_menu}>
          <div className={common.input_title}>Тип поставщика</div>
          <label className={s.checkbox_material}>
            <input
              type="checkbox"
              value="Оборудование"
              onChange={(e) => addMaterial(e.target.value, e.target.checked)}
            />
            Оборудование
          </label>
          <label className={s.checkbox_material}>
            <input
              type="checkbox"
              value="Материалы"
              onChange={(e) => addMaterial(e.target.value, e.target.checked)}
            />
            Материалы
          </label>
          <label className={s.checkbox_material}>
            <input
              type="checkbox"
              value="Инструменты"
              onChange={(e) => addMaterial(e.target.value, e.target.checked)}
            />
            Инструменты
          </label>
          <label className={s.checkbox_material}>
            <input
              type="checkbox"
              value="Хоз. товары"
              onChange={(e) => addMaterial(e.target.value, e.target.checked)}
            />
            Хоз. товары
          </label>
          <label className={s.checkbox_material}>
            <input
              type="checkbox"
              value="Ортодонтия"
              onChange={(e) => addMaterial(e.target.value, e.target.checked)}
            />
            Ортодонтия
          </label>
          <label className={s.checkbox_material}>
            <input
              type="checkbox"
              value="Имплантология"
              onChange={(e) => addMaterial(e.target.value, e.target.checked)}
            />
            Имплантология
          </label>
        </div>
        )}
        <div className={s.captcha}>
          <Form.Item
            name="captcha"
            validateStatus={captchaData === null ? 'error' : 'validating'}
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
        <div className={common.footer}>
          <Button
            type="primary"
            className={common.button}
            loading={confirmLoading}
            htmlType="submit"
          >
            Регистрация
          </Button>
          <div>
            Уже есть аккаунт?
            {' '}
            <span
              className={common.link}
              onClick={async () => {
                await handleCancel();
                await setCurrentModal(ModalsTypes.login);
              }}
            >
              Войти
            </span>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default RegModal;
