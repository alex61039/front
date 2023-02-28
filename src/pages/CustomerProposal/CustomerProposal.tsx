/* eslint-disable no-param-reassign */
/* eslint-disable react/no-children-prop */
import React, {
  ChangeEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import {
  NavLink, Prompt, Redirect, useHistory,
} from 'react-router-dom';
import {
  AutoComplete, Input, Modal, message, Button, Select,
} from 'antd';
import cx from 'classnames';
import InputMask from 'react-input-mask';
import { DebounceInput } from 'react-debounce-input';
import { useDispatch } from 'react-redux';
import CurrencyInput from 'react-currency-input-field';
import ConfirmProposal from 'src/components/shared-components/Modals/ConfirmProposal';
import withHint from 'src/hocs/withHint';
import routes from 'src/routes';
import getCustomerPhone from 'src/helpers/getCustomerPhone';
import { LoadingButton } from 'src/components/shared-components/Loading';
import SaveTemplate from 'src/components/shared-components/Modals/SaveTemplate';
import useLeaveRoute from 'src/hooks/useLeaveRoute';
import useBeforeUnload from 'src/hooks/useBeforeUnload';
import cities from '../../assets/data/cities';
import plusImg from '../../assets/img/plus.png';
import s from './CustomerProposal.module.css';
import common from '../../components/shared-components/Modals/Modals.module.css';
import getCookie from '../../helpers/getCookie';
import useTypedSelector from '../../hooks/useTypedSelector';
import { About } from '../../components';
import {
  IProduct, ProductItemProps, ISearchResult, IOrderData, IAutoComplete,
} from './types';
import { usersApi } from '../../api/api';

const { Option } = Select;

const CustomAutoComplete = withHint<IAutoComplete>(AutoComplete);

const ProductItem: React.FC<ProductItemProps> = ({
  id,
  deleteProduct,
  setProducts,
  products,
}) => {
  const [name, setName] = useState<string>('');
  const [searchResult, setSearchResult] = useState<ISearchResult[]>([]);

  const [isCustomProductName, isSetCustomProductName] = useState(false);

  const { isRefresh } = useTypedSelector((state) => state.refresh);

  const crossBtn = useRef<HTMLImageElement>(null);

  useEffect(() => {
    document.addEventListener('keydown', (e) => e.key === 'Enter' && e.preventDefault());
  });

  const customProductNameHandler = () => {
    isSetCustomProductName(true);
  };

  const amountHandler = (value: string | undefined) => {
    const updatedState = products.map((item: IProduct) => {
      if (item.id === products[id - 1]?.id) {
        return { ...item, amount: value };
      }
      return item;
    });
    setProducts(updatedState);
  };

  const typeHandler = (value: string) => {
    const updatedState = products.map((item: IProduct) => {
      if (item.id === products[id - 1]?.id) {
        return { ...item, type: value };
      }
      return item;
    });
    setProducts(updatedState);
  };

  const codeHandler = (value: string) => {
    const updatedState = products.map((item: IProduct) => {
      if (item.id === products[id - 1]?.id) {
        return { ...item, code: value };
      }
      return item;
    });
    setProducts(updatedState);
  };

  const clearInput = () => {
    if (products[id - 1]?.name.length > 0) {
      const updatedState = products.map((item: IProduct) => {
        if (item.id === products[id - 1]?.id) {
          return { ...item, name: '' };
        }
        return item;
      });
      setProducts(updatedState);
    }
  };

  const handleClickOutside = (event: any) => {
    if (crossBtn.current && crossBtn.current.contains(event.target)) {
      clearInput();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const productNameItemHandler = (productName: string) => {
    setName(productName);

    const updatedState = products.map((item: IProduct) => {
      if (item.id === products[id - 1]?.id) {
        return { ...item, name: productName };
      }
      return item;
    });
    setProducts(updatedState);
  };

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');
    if (name?.length > 0 && name?.length < 50) {
      usersApi.search(token, name).then((r) => setSearchResult(r.data.items));
    }
  }, [name, isRefresh]);

  return (
    <div className={s.product} key={id + 20}>
      <div className={s.input_bottom}>
        <CustomAutoComplete
          autoFocus={id !== 1}
          allowClear
          children={(
            <DebounceInput
              minLength={0}
              debounceTimeout={300}
              type="text"
              className={s.search_input_autocompelete_debounce}
              value={products[id - 1]?.name}
              suffix="123"
              onChange={(e: any) => productNameItemHandler(e.target.value)}
              required
            />
          )}
          className={s.search_input_autocomplete}
          options={name !== ''
            ? searchResult.map((el, index) => ({
              label: el.name,
              value: el.name,
              key: index + 1,
            })).concat([{ label: `Добавить ${name}`, value: name, key: 0 }])
            : searchResult.map((el, index) => ({
              value: el.name,
              key: index + 1,
            }))}
          value={products[id - 1].name}
          onSelect={(e: string) => {
            if (!searchResult.some((res) => res.name === e)) {
              customProductNameHandler();
            } else {
              productNameItemHandler(e);
            }
          }}
          hint={products[id - 1].name}
        />
      </div>
      <div className={s.input_bottom}>
        <div>
          <Input
            type="text"
            disabled={!isCustomProductName}
            value={products[id - 1]?.code}
            onChange={(e: ChangeEvent<HTMLInputElement>) => codeHandler(e.target.value)}
          />
        </div>
      </div>
      <div className={s.input_bottom}>
        <div>
          <CurrencyInput
            required
            defaultValue={1}
            allowDecimals={false}
            allowNegativeValue={false}
            disableGroupSeparators
            disableAbbreviations
            value={products[id - 1]?.amount}
            onValueChange={(e: string | undefined) => amountHandler(e)}
            pattern="^[1-9][0-9]*$"
            title="Поле не может иметь значений меньше 1"
          />
        </div>

      </div>
      <div className={s.input_bottom}>
        <div>
          <select
            className={s.input_select}
            value={products[id - 1]?.type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => typeHandler(e.target.value)}
          >
            <option value="штука">штука</option>
            <option value="упаковка">упаковка</option>
          </select>
        </div>

      </div>
      <div className={s.delete_button_wrap}>
        {products.length > 1 && (
          <button
            type="button"
            className={s.delete_button}
            onClick={() => deleteProduct(products[id - 1]?.id)}
          >
            <span />
          </button>
        )}
      </div>
    </div>
  );
};

const CustomerProposal: React.FC = () => {
  const { result } = useTypedSelector((state) => state.responseResult);
  const { email } = useTypedSelector((state) => state.userProfile);
  const userInfo = useTypedSelector((state) => state.userProfile);
  const { isRefresh } = useTypedSelector((state) => state.refresh);

  const [organization, setOrganization] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [, setUserEmail] = useState<string>(email);
  const [linkType, setLinkType] = useState<string>('E-mail');
  const [supplierTypes, setSupplierTypes] = useState<string[]>(['Материалы']);
  const [uniqProviderTypes, setUniqProviderTypes] = useState<string[]>(['Материалы']);
  const [uniqProviders, setUniqProviders] = useState<any>({});
  const [exceptionalSuppliers, setExceptionalSuppliers] = useState([]);
  const [region, setRegion] = useState<string>('г. Санкт-Петербург');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('г. Санкт-Петербург');
  const [comment, setComment] = useState<string>('');
  const [fileData, setFileData] = useState<File | null>(null);
  const [goods, setGoods] = useState<IProduct[]>([
    {
      name: '', code: '', quantity: 1, amount: '1', id: 1, type: 'штука',
    },
  ]);
  const formRef = useRef<HTMLFormElement>(null);

  const [isUniqProvidersValid, setIsUniqProvidersValid] = useState(false);

  const [isLoadingButton, setButtonIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [templateData, setTemplateData] = useState<any>([]);

  const [isTemplateSaving, setIsTemplateSaving] = useState(false);
  const [saveTemplateModalOpened, setSaveTemplateModalOpened] = useState(false);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (userInfo.name !== '' || null) {
      setName(userInfo.name);
    }
    if (userInfo.organization !== '' || null) {
      setOrganization(userInfo.organization);
    }
    if (userInfo.phone !== '' || null) {
      setNumber(userInfo.phone);
    }
    if (typeof userInfo.region === 'string') {
      if (userInfo.region !== '' && userInfo.region !== null) {
        setRegion(userInfo.region);
      }
    } else if (typeof userInfo.region === 'object') {
      if (userInfo.region !== '' && userInfo.region !== null && userInfo?.region?.name) {
        setRegion(userInfo?.region?.name);
      }
    }
    if (userInfo.address !== '' || null) {
      setDeliveryAddress(userInfo.address);
    }
  }, [userInfo]);

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');
    if (isUniqProvidersValid) {
      usersApi.getTemplateData(token).then((r) => {
        if (r.data.data) {
          setIsModalVisible(true);
          setTemplateData(r.data.data);
        }
      });
    }
  }, [isUniqProvidersValid]);

  useBeforeUnload();

  const {
    lastLocation,
    handleLocationChange,
  } = useLeaveRoute();

  useEffect(() => {
    if (lastLocation) {
      setSaveTemplateModalOpened(true);
    }
  }, [lastLocation]);

  const handleSaveTemplateModalCloseClick = () => {
    setSaveTemplateModalOpened(false);

    if (lastLocation) {
      history.push(lastLocation);
    }
  };

  const setDataFromTemplate = () => {
    message.success('Шаблон был успешно применен!', 3);
    if (Object.keys(templateData).length > 0) {
      setOrganization(templateData.organization);
      setName(templateData.name);
      setNumber(templateData.phone);
      setRegion(templateData.region);
      setSupplierTypes([...templateData.supplierType]);
      if (templateData.exceptionalSuppliers) {
        setExceptionalSuppliers(templateData.exceptionalSuppliers.map((item: any) => item.userId));
      }
      setLinkType(templateData.linkType);
      setGoods(templateData.goods.map((item: IProduct, index: number) => ({
        id: index + 1,
        code: item.code,
        name: item.name,
        amount: item.quantity,
        type: item.type,
      })));
      setComment(templateData.comment);
      setIsModalVisible(false);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setButtonIsLoading(true);
    const data: any = new FormData();
    const updatedData: IOrderData = {};

    if (fileData !== null) {
      data.append('file', fileData);
    }

    data.append('organization', organization);
    data.append('name', name);
    data.append('phone', number);
    data.append('linkType', linkType);
    for (let i = 0; i < supplierTypes.length; i += 1) {
      data.append(`supplierTypes[${i}]`, supplierTypes[i]);
    }
    data.append('region', region);
    data.append('deliveryAddress', deliveryAddress);
    data.append('comment', comment);

    for (let i = 0; i < goods.length; i += 1) {
      data.append(`goods[${i}][name]`, goods[i].name);
      data.append(`goods[${i}][quantity]`, goods[i].amount);
      data.append(`goods[${i}][type]`, goods[i].type);
      if (goods[i]?.code !== null && goods[i]?.code.length > 0) data.append(`goods[${i}][code]`, goods[i]?.code);
    }

    if (exceptionalSuppliers.length > 0) {
      for (let i = 0; i < exceptionalSuppliers?.length; i += 1) {
        data.append(`exceptionalSuppliers[${i}][userId]`, exceptionalSuppliers[i]);
      }
    }

    if (name !== userInfo.name) updatedData.name = name;
    if (organization !== userInfo.organization) updatedData.organization = organization;
    if (number !== userInfo.phone) updatedData.phone = number;
    if (region !== userInfo.region) updatedData.region = region;
    if (deliveryAddress !== userInfo.address) updatedData.address = deliveryAddress;

    const token: string | null | undefined = getCookie('Authentication');

    if (name !== userInfo.name
      || organization !== userInfo.organization
      || number !== userInfo.phone
      || region !== userInfo.region
      || deliveryAddress !== userInfo.address
    ) {
      const newToken: string | null | undefined = getCookie('Authentication');
      usersApi.updateData(newToken, updatedData);
    }

    const createNewProposalResponse = await usersApi.createNewProposal(token, data);
    dispatch({
      type: 'GET_RESULT',
      payload: {
        result: createNewProposalResponse.data.result,
        msg: createNewProposalResponse.data.msg,
        orderId: createNewProposalResponse.data.orderId,
      },
    });

    setButtonIsLoading(false);

    if (!createNewProposalResponse.data.result) {
      message.error('Ошибка создания заказа');
    }
  }

  const handleSaveTemplateClick = async () => {
    setIsTemplateSaving(true);

    const data: IOrderData = {};

    data.organization = organization;
    data.name = name;
    data.phone = number;
    data.linkType = linkType;

    data.supplierTypes = supplierTypes;

    if (exceptionalSuppliers.length > 0) {
      data.exceptionalSuppliers = exceptionalSuppliers.map((item: any) => ({
        userId: item,
      }));
    }
    data.region = region;
    data.deliveryAddress = deliveryAddress;
    data.comment = comment;
    data.goods = goods.map((item: any) => ({
      name: item.name,
      code: item.code,
      type: item.type,
      quantity: item.amount,
    }));

    const token: string | null | undefined = getCookie('Authentication');

    try {
      const response = await usersApi.createTemplateData(token, data);

      if (response.data.msg === 'Шаблон создан!') {
        message.success('Шаблон успешно создан!', 3);
      } else if (response.data.msg === 'Шаблон сохранен!') {
        message.success('Шаблон сохранен!', 3);
      } else {
        message.error('Ошибка в создании шаблона!', 3);
      }
    } catch (e) {
      message.error('Произошла ошибка при создании шаблона');
    } finally {
      setIsTemplateSaving(false);

      if (lastLocation) {
        setSaveTemplateModalOpened(false);
        history.push(lastLocation);
      }
    }
  };

  const addProduct = useCallback(() => {
    setGoods([...goods, {
      name: '',
      code: '',
      quantity: 1,
      amount: '1',
      id: goods.length === 0 ? 1 : goods[goods.length - 1].id + 1,
      type: 'штука',
    }]);
  }, [goods]);

  const deleteProduct = useCallback((id: number) => {
    setGoods(goods.filter((product: IProduct) => product.id !== id));
  }, [goods]);

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');
    usersApi.getUniqProviders(token, supplierTypes).then((r) => {
      setUniqProviders(r.data);
      setIsUniqProvidersValid(true);
    });
  }, [uniqProviderTypes, isRefresh]);

  const setSupplierHandler = useCallback((e: string[]) => {
    for (let i = 0; i < uniqProviders.items?.length; i += 1) {
      if (uniqProviderTypes !== uniqProviders.items[i].providerTypes.name) {
        setExceptionalSuppliers([]);
      }
    }

    if (e.length > 0) {
      setSupplierTypes(e);
      setUniqProviderTypes(e);
    } else {
      setSupplierTypes(['Материалы']);
      setUniqProviderTypes(['Материалы']);
    }
  }, [uniqProviders, uniqProviderTypes]);

  const handleChange = useCallback((value: any) => {
    setExceptionalSuppliers(value);
  }, []);

  const organizationHandler = useCallback((value: string) => {
    setOrganization(value);
  }, []);

  const nameHandler = useCallback((value: string) => {
    setName(value);
  }, []);

  const phoneHandler = useCallback((value: string) => {
    setNumber(value);
  }, []);

  const emailHandler = useCallback((value: string) => {
    setUserEmail(value);
  }, []);

  const linkTypeHandler = useCallback((value: string) => {
    setLinkType(value);
  }, []);

  return (
    <div className={s.page}>
      <Modal
        bodyStyle={{ maxWidth: '320px', margin: '0 auto' }}
        className={s.modal}
        centered
        title="Шаблон"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <p style={{ textAlign: 'center' }}>Хотите ли вы использовать готовый шаблон?</p>
        <div className={`${common.footer} ${common.paddingReset}`}>
          <Button
            type="primary"
            className={common.button}
            onClick={setDataFromTemplate}
          >
            Да
          </Button>
          <Button
            type="primary"
            className={common.button}
            onClick={() => setIsModalVisible(false)}
          >
            Нет
          </Button>
        </div>
      </Modal>
      {/* mobile */}
      <div className={s.inner}>
        <div className={s.top_right_mobile}>
          <About />
        </div>
        <div className={s.form}>
          <form
            ref={formRef}
            id="new-order"
            action="POST"
            onSubmit={handleSubmit}
          >
            <div className={s.top_container}>
              <div className={s.top}>
                <div className={s.top_left}>
                  <div className={s.form_title}>Ваши данные</div>
                  <div className={s.inputs}>
                    <div className={s.input_item}>
                      <div>Организация</div>
                      {userInfo.organization !== '' && (
                      <Input
                        required
                        maxLength={50}
                        type="text"
                        name="organization"
                        value={organization}
                        onChange={(e) => organizationHandler(e.target.value)}
                      />
                      )}
                      {userInfo.organization === '' && (
                      <Input
                        required
                        maxLength={50}
                        type="text"
                        name="organization"
                        defaultValue=""
                        onChange={(e) => organizationHandler(e.target.value)}
                      />
                      )}
                    </div>
                    <div className={s.input_item}>
                      <div>Имя</div>
                      {userInfo.name !== '' && (
                      <Input
                        required
                        maxLength={20}
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => nameHandler(e.target.value)}
                      />
                      )}

                      {userInfo.name === '' && (
                      <Input
                        required
                        maxLength={20}
                        type="text"
                        name="name"
                        defaultValue=""
                        onChange={(e: ChangeEvent<HTMLInputElement>) => nameHandler(e.target.value)}
                      />
                      )}
                    </div>
                    <div className={s.input_item}>
                      <div>Телефон</div>
                      {userInfo.phone !== '' && (
                      <InputMask
                        mask="+7(999) 999-9999"
                        required
                        type="tel"
                        name="number"
                        value={number}
                        onChange={(e) => phoneHandler(e.target.value)}
                        beforeMaskedValueChange={getCustomerPhone}
                      />
                      )}

                      {userInfo.phone === '' && (
                      <InputMask
                        mask="+7(999) 999-9999"
                        required
                        type="tel"
                        name="number"
                        defaultValue=""
                        onChange={(e) => phoneHandler(e.target.value)}
                      />
                      )}
                    </div>
                    <div className={s.input_item}>
                      <div>Электронная почта</div>
                      <Input
                        required
                        disabled
                        type="email"
                        name="email"
                        value={email || ''}
                        onChange={(e) => emailHandler(e.target.value)}
                      />
                    </div>
                    <div className={s.input_item}>
                      <div>Реквизиты организации</div>
                      <div className={s.upload_container}>
                        <label htmlFor="file">
                          {fileData
                            ? fileData.name
                            : 'Загрузить файл (.doc, .pdf, .jpg)'}
                        </label>
                        <Input
                          type="file"
                          id="file"
                          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/pdf, image/jpeg, image/png, image/jpg"
                          onChange={(e) => setFileData(e.target.files ? e.target.files[0] : null)}
                        />
                      </div>
                    </div>
                    <div className={s.input_item}>
                      <div>Предпочтитаемый способ связи с поставщиком</div>
                      <select
                        required
                        name="contact_way"
                        onChange={(e) => linkTypeHandler(e.target.value)}
                      >
                        <option value="E-mail">E-mail</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Viber">Viber</option>
                        <option value="Telegram">Telegram</option>
                      </select>
                    </div>
                    <div className={s.input_item}>
                      <div className={s.test}>Тип поставщика</div>
                      <Select
                        showArrow
                        mode="multiple"
                        showSearch={false}
                        allowClear
                        style={{ width: '326px', height: 'auto!important' }}
                        placeholder="Выберите тип поставщика"
                        onChange={(e: any) => setSupplierHandler(e)}
                        value={supplierTypes}
                      >
                        <Option value="Материалы">Материалы</Option>
                        <Option value="Оборудование">Оборудование</Option>
                        <Option value="Инструменты">Инструменты</Option>
                        <Option value="Хоз. товары">Хоз. товары</Option>
                        <Option value="Ортодонтия">Ортодонтия</Option>
                        <Option value="Имплантология">Имплантология</Option>
                      </Select>
                    </div>
                    <div className={`${s.input_item} ${s.uniq_providers}`}>
                      <div>Исключительные поставщики</div>
                      <Select
                        showArrow
                        mode="multiple"
                        showSearch={false}
                        allowClear
                        value={exceptionalSuppliers.map((item: any) => item)}
                        style={{ width: '326px', height: 'auto!important' }}
                        disabled={supplierTypes.length === 0}
                        placeholder="Выберите исключительных поставщиков"
                        onChange={(e: any) => handleChange(e)}
                      >
                        {
                          uniqProviders.items?.map((item: any) => [
                            <Option
                              key={item.id}
                              value={item.id}
                            >
                              {item.organization !== null ? item.organization : item.email}
                            </Option>,
                          ])
                        }
                      </Select>
                    </div>
                    <div className={s.input_item}>
                      <div>Регион доставки</div>
                      <select
                        required
                        name="provider_type"
                        value={region}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value)}
                      >
                        {cities.map((city) => (
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className={s.input_item}>
                      <div>Адрес доставки</div>
                      <Input.TextArea
                        value={deliveryAddress}
                        name="address"
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                        maxLength={255}
                      />
                    </div>
                    <div className={s.input_item}>
                      <div>Комментарий в свободной форме</div>
                      <Input.TextArea
                        value={comment}
                        name="comment"
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className={s.top_right}>
                <About />
              </div>
            </div>
            <div className={s.bottom}>
              <div className={s.bottom_inner}>
                <div className={s.form_title}>Заявка на товар</div>
                <div className={s.bottom_body}>
                  <div className={s.products_title}>
                    <div>Наименование товара</div>
                    <div>Штрихкод</div>
                    <div>Кол-во</div>
                    <div>Ед-измерения</div>
                  </div>
                  {goods.map((el: IProduct, index: number) => (
                    <ProductItem
                      key={el.id}
                      id={index + 1}
                      deleteProduct={deleteProduct}
                      setProducts={setGoods}
                      products={goods}
                    />
                  ))}
                </div>
                {goods.length <= 100 && (
                <div className={s.add_button}>
                  <button type="button" onClick={() => addProduct()}>
                    <div className={s.add_button_inner}>
                      <img src={plusImg} alt="+" />
                      <div>Добавить товар</div>
                    </div>
                  </button>
                </div>
                )}
                <div className={s.bottom_footer}>
                  {!result ? (
                    <ConfirmProposal
                      formRef={formRef}
                      loading={isLoadingButton}
                    />
                  ) : <Redirect to={routes.success} />}
                  <button
                    className={cx(s.submitButton, s.saveTemplateButton)}
                    type="button"
                    disabled={!formRef.current?.checkValidity() || isTemplateSaving}
                    onClick={handleSaveTemplateClick}
                  >
                    {!isTemplateSaving && 'Сохранить шаблон'}
                    {isTemplateSaving && <LoadingButton />}
                  </button>
                  <div className={s.footer_text}>
                    Нажимая кнопку «Далее», я подтверждаю свою дееспособность,
                    принимаю условия
                    {' '}
                    <NavLink to={routes.agreement}>
                      Пользовательского соглашения
                      {' '}
                    </NavLink>
                    {' '}
                    и подтверждаю свое
                    {' '}
                    <NavLink to={routes.privacyPolicy}>
                      согласие на обработку персональных данных
                      {' '}
                    </NavLink>
                    в соответствии с Федеральным законом № 152-ФЗ «О
                    персональных данных» от 27.06.2006 г.
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Prompt
        when={formRef.current?.checkValidity() && !result}
        message={handleLocationChange}
      />
      {saveTemplateModalOpened && (
        <SaveTemplate
          isSaving={isTemplateSaving}
          onSubmit={handleSaveTemplateClick}
          onCancel={handleSaveTemplateModalCloseClick}
        />
      )}
    </div>
  );
};

export default CustomerProposal;
