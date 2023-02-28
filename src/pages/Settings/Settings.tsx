/* eslint-disable prefer-regex-literals */
import React, { useEffect, useState, FC } from 'react';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  Button, Form, Input, Tag,
} from 'antd';

import {
  EyeInvisibleOutlined, EyeTwoTone, ContainerOutlined, SettingOutlined,
} from '@ant-design/icons';

import routes from 'src/routes';
import s from './Settings.module.css';
import './Setting.css';
import cities from '../../assets/data/cities';
import { authApi, usersApi } from '../../api/api';

import { IUserData } from '../../types/userProfile';
import { setUserDataAC } from '../../store/action-creators/userProfile';
import useActions from '../../hooks/useActions';
import useTypedSelector from '../../hooks/useTypedSelector';
import getCookie from '../../helpers/getCookie';

const getIconComponent = (visible: boolean) => (
  visible
    ? <EyeTwoTone />
    : <EyeInvisibleOutlined />
);

const Settings: FC = () => {
  const [form] = Form.useForm();

  const {
    isProvider,
    name,
    email,
    phone,
    address,
    region,
    organization,
    website,
    providerTypes,
  } = useTypedSelector((state) => state.userProfile);

  const [settingsData, setSettingsData] = useState<IUserData>({
    name: '',
    isProvider: false,
    address: '',
    email: '',
    phone: '',
    region: '',
    organization: '',
    website: '',
    providerTypes: [],
  });

  const [updatedSettingsData, setUpdatedSettingsData] = useState({});

  const { showErr, changeEmail, changePassword } = useActions();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    setSettingsData({
      name, email, phone, address, region, organization, website, providerTypes, isProvider,
    });

    form.setFieldsValue({
      name, email, phone, address, region, organization, website, providerTypes, isProvider,
    });
  }, [name, email, phone, address, region, organization, website, providerTypes, isProvider, form]);

  const updateSettingsData = (e: any) => {
    const { value } = e.target;
    if (e.target.name !== 'email') {
      setUpdatedSettingsData({
        ...updatedSettingsData,
        [e.target.name]: value,
      });
    }
  };

  const inputsHandler = (e: any) => {
    const { value } = e.target;
    setSettingsData({
      ...settingsData,
      [e.target.name]: value,
    });

    updateSettingsData(e);
  };

  const inputsProviderTypesHandler = async (e: any) => {
    const token: string | null | undefined = getCookie('Authentication');
    const isChecked = e.target.checked;
    const { value } = e.target;

    if (isChecked) {
      dispatch({
        type: 'SET_USER_DATA',
        payload: { providerTypes: [...providerTypes, { name: value }] },
      });
      usersApi.addProviderType(token, value).then(() => {
        showErr('Тип поставщика обновлен!');
      });
    } else {
      dispatch({
        type: 'REMOVE_TYPE_OF_PROVIDER',
        payload: value,
      });
      usersApi.deleteProviderType(token, value).then(() => {
        showErr('Тип поставщика обновлен!');
      });
    }
  };

  useEffect(() => {
    if (
      name === settingsData.name
      && phone === (settingsData.phone || '')
      && address === settingsData.address
      && email === settingsData.email
      && region === settingsData.region
      && organization === settingsData.organization
      && newPassword === (currentPassword || '')
      && website === settingsData.website) {
      setSaveBtnDisabled(true);
    }
    if (name !== settingsData.name
      || phone !== settingsData.phone
      || address !== settingsData.address
      || email !== settingsData.email
      || region !== settingsData.region
      || organization !== settingsData.organization
      || website !== settingsData.website
      || newPassword !== (currentPassword || '')
    ) {
      setSaveBtnDisabled(false);
    }
  }, [
    settingsData.name,
    settingsData.email,
    settingsData.phone,
    settingsData.address,
    settingsData.region,
    settingsData.organization,
    settingsData.website,
    settingsData.providerTypes,
    settingsData.isProvider,
    currentPassword,
    newPassword,
  ]);

  const emailChangeHandler = async () => {
    const token: string | null | undefined = getCookie('Authentication') ? getCookie('Authentication') : window.localStorage.getItem('token');
    if (token) {
      changeEmail(token, settingsData.email);
    } else {
      authApi
        .refresh()
        .then(() => {
          changeEmail(token, settingsData.email);
        });
    }
  };

  const changeUserInfoHandler = async () => {
    const token: string | null | undefined = getCookie('Authentication') ? getCookie('Authentication') : window.localStorage.getItem('token');

    if (Object.keys(updatedSettingsData).length > 0) {
      dispatch(setUserDataAC(updatedSettingsData as IUserData));
      usersApi.updateData(token, updatedSettingsData).then(() => {
        showErr('Данные обновлены!');
      });
    }
  };

  const changePasswordHandler = () => {
    const token: string | null | undefined = getCookie('Authentication') ? getCookie('Authentication') : window.localStorage.getItem('token');
    changePassword(
      currentPassword,
      newPassword,
      token || '',
    );
    if (token) {
      changePassword(
        currentPassword,
        newPassword,
        token || '',
      );
    } else {
      authApi
        .refresh()
        .then(() => {
          changePassword(
            currentPassword,
            newPassword,
            token || '',
          );
        })
        .catch(() => {
          showErr('Большое кол-во запросов!');
        });
    }
  };

  const saveProfileData = async () => {
    if (settingsData.name !== name
      || settingsData.phone !== phone
      || settingsData.address !== address
      || settingsData.organization !== organization
      || settingsData.website !== website
      || settingsData.region !== region
    ) {
      await changeUserInfoHandler();
    }

    if (settingsData.email !== '' && settingsData.email !== email) {
      await emailChangeHandler();
    }

    if (currentPassword !== '' && newPassword !== '' && newPassword !== currentPassword) {
      await changePasswordHandler();
    }
  };

  const regionValue: string | undefined = typeof settingsData.region === 'object' && settingsData.region !== null
    ? settingsData.region.name
    : settingsData.region || '';

  return (
    <div className={s.settings}>
      <div className={s.settingsHeader}>
        <Link to={routes.personal}>
          <Button type="default" icon={<ContainerOutlined />} size="large">Мои заявки</Button>
        </Link>
        <Link to={routes.settings}>
          <div className={s.settingsContainer}>
            <Button type="default" icon={<SettingOutlined />} size="large">Настройки</Button>
          </div>
        </Link>
      </div>
      <div className={s.changeUserInfoBlock}>
        <Form form={form} onFinish={() => saveProfileData()}>
          <div className={`${s.bigTitle} ${s.btwJst}`}>
            <span>Личные данные</span>
            <div className={s.inputGroupPrepend}>

              <Tag color="magenta">{isProvider ? 'Поставщик' : 'Заказчик'}</Tag>
            </div>
          </div>
          <div className={s.changeUserInfoGroupItems}>
            <div className={s.inputGroupItem}>
              <span className={s.inputDescription}>Имя</span>
              <Form.Item
                className={s.inputDescription}
                name="name"
                rules={[{
                  required: true,
                  message: 'Пожалуйста, введите свое имя кириллицей!',
                  pattern: new RegExp('^[А-Яа-я]+$'),
                },
                ]}
              >
                <Input
                  onChange={(e: any) => inputsHandler(e)}
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Имя"
                  maxLength={20}
                />
              </Form.Item>
            </div>
            <div className={s.inputGroupItem}>
              <span className={s.inputDescription}>Телефон</span>
              <Form.Item className={s.formItem} name="phone">
                <InputMask
                  onChange={(e: any) => inputsHandler(e)}
                  placeholder="Телефон"
                  className="ant-input"
                  id="phone"
                  name="phone"
                  mask="+7(999) 999-9999"
                />
              </Form.Item>
            </div>
            <div className={s.inputGroupItem}>
              <span className={s.inputDescription}>Организация</span>
              <Form.Item className={s.formItem}>
                <Input
                  value={settingsData.organization !== null ? settingsData.organization : ''}
                  maxLength={200}
                  id="organization"
                  type="text"
                  name="organization"
                  placeholder="Организация"
                  onChange={(e: any) => inputsHandler(e)}
                />
              </Form.Item>
            </div>
            <div className={s.inputGroupItem}>
              <span className={s.inputDescription}>Сайт компании</span>
              <Form.Item
                className={s.formItem}
                name="website"
                rules={[{
                  message: 'Пожалуйста, введите ссылку на сайт корректно!',
                  pattern: new RegExp(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\\=]*)?/gi),
                },
                ]}
              >
                <Input
                  value={settingsData.website !== null ? settingsData.website : ''}
                  maxLength={200}
                  id="website"
                  type="text"
                  name="website"
                  placeholder="Сайт компании"
                  onChange={(e: any) => inputsHandler(e)}
                />
              </Form.Item>
            </div>
            <Form>
              {isProvider ? (
                <div style={{ width: 200 }} className={s.inputGroupItem}>
                  <span className={s.inputDescription}>Тип поставщика</span>
                  <div className={s.checkboxesItem}>
                    <input
                      onChange={(e: any) => inputsProviderTypesHandler(e)}
                      defaultChecked={
                        !!providerTypes.find((item: any) => item.name === 'Оборудование')
                      }
                      id="checkbox1"
                      type="checkbox"
                      name="provider_type"
                      value="Оборудование"
                    />
                    <span>
                      <label htmlFor="checkbox1">Оборудование</label>
                    </span>
                  </div>
                  <div className={s.checkboxesItem}>
                    <input
                      onChange={(e: any) => inputsProviderTypesHandler(e)}
                      defaultChecked={
                        !!providerTypes.find((item: any) => item.name === 'Материалы')
                      }
                      id="checkbox2"
                      type="checkbox"
                      name="provider_type"
                      value="Материалы"
                    />
                    <span>
                      <label htmlFor="checkbox2">Материалы</label>
                    </span>
                  </div>
                  <div className={s.checkboxesItem}>
                    <input
                      onChange={(e: any) => inputsProviderTypesHandler(e)}
                      defaultChecked={
                        !!providerTypes.find((item: any) => item.name === 'Инструменты')
                      }
                      id="checkbox3"
                      type="checkbox"
                      name="provider_type"
                      value="Инструменты"
                    />
                    <span>
                      <label htmlFor="checkbox3">Инструменты</label>
                    </span>
                  </div>
                  <div className={s.checkboxesItem}>
                    <input
                      onChange={(e: any) => inputsProviderTypesHandler(e)}
                      defaultChecked={
                        !!providerTypes.find((item: any) => item.name === 'Хоз. товары')
                      }
                      id="checkbox4"
                      type="checkbox"
                      name="provider_type"
                      value="Хоз. товары"
                    />
                    <span>
                      <label htmlFor="checkbox4">Хоз. товары</label>
                    </span>
                  </div>
                  <div className={s.checkboxesItem}>
                    <input
                      onChange={(e: any) => inputsProviderTypesHandler(e)}
                      defaultChecked={
                        !!providerTypes.find((item: any) => item.name === 'Ортодонтия')
                      }
                      id="checkbox5"
                      type="checkbox"
                      name="provider_type"
                      value="Ортодонтия"
                    />
                    <span>
                      <label htmlFor="checkbox5">Ортодонтия</label>
                    </span>
                  </div>
                  <div className={s.checkboxesItem}>
                    <input
                      onChange={(e: any) => inputsProviderTypesHandler(e)}
                      defaultChecked={
                        !!providerTypes.find((item: any) => item.name === 'Имплантология')
                      }
                      id="checkbox6"
                      type="checkbox"
                      name="provider_type"
                      value="Имплантология"
                    />
                    <span>
                      <label htmlFor="checkbox6">Имплантология</label>
                    </span>
                  </div>
                </div>
              )
                : (
                  <>
                    <div className={s.inputGroupItem}>
                      <span className={s.inputDescription}>Регион доставки</span>
                      <select
                        className="ant-input"
                        required
                        value={regionValue}
                        name="region"
                        onChange={(e) => inputsHandler(e)}
                      >
                        {cities.map((city) => (
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className={s.inputGroupItem}>
                      <span className={s.inputDescription}>Адрес доставки</span>
                      <Input.TextArea
                        value={settingsData.address !== null ? settingsData.address : ''}
                        maxLength={256}
                        name="address"
                        placeholder="Адрес доставки"
                        onChange={(e) => inputsHandler(e)}
                      />
                    </div>
                  </>
                )}
            </Form>
            <div className={s.inputGroupItem}>
              <span className={s.inputDescription}>
                Электронная почта
              </span>
              <Form.Item
                className={s.formItem}
                name="email"
                rules={[
                  {
                    message: 'Пожалуйста, введите свою почту корректно!',
                    pattern: new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/),
                  }]}
              >
                <Input
                  value={settingsData.email}
                  maxLength={50}
                  type="email"
                  onChange={(e) => inputsHandler(e)}
                  name="email"
                  placeholder="Электронная почта"
                />
              </Form.Item>
            </div>
            <div className={s.inputGroupItem}>
              <div className={`${s.passwordBlock} ${s.w100} password_block`}>
                <span className={s.inputDescription}>Изменить пароль</span>
                <Form.Item
                  className={s.formItem}
                  name="password1"
                  rules={[{
                    message: 'Пароль должен состоять хотя бы из 6 символов!',
                    pattern: new RegExp('^(?=.{6,})'),
                  }]}
                  hasFeedback
                >
                  <Input.Password
                    id="password1"
                    placeholder="Старый пароль"
                    name="password1"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    iconRender={getIconComponent}
                  />
                </Form.Item>

              </div>
            </div>
            <div className={s.inputGroupItem}>
              <div className={`${s.passwordBlock} ${s.w100} password_block`}>
                <span className={s.inputDescription}> </span>
                <Form.Item
                  className={s.formItem}
                  name="password2"
                  dependencies={['password1']}
                  rules={[
                    {
                      message: 'Пожалуйста, введите новый пароль!',
                    },
                    {
                      message: 'Пароль должен состоять хотя бы из 6 символов!',
                      pattern: new RegExp('^(?=.{6,})'),
                    },
                    ({ getFieldValue }) => ({
                      validator(_: any, value: any) {
                        if (!value || getFieldValue('password1') !== value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Пароли совпадают!'));
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    id="password2"
                    placeholder="Новый пароль"
                    name="password2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    iconRender={getIconComponent}
                  />
                </Form.Item>

              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={saveBtnDisabled}
            className={`${s.mainStyleBtn} ${s.btn}`}
          >
            Сохранить

          </button>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
