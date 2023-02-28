import React, {
  ChangeEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { NavLink, Redirect, useParams } from 'react-router-dom';
import { Input, message, Select } from 'antd';
import InputMask from 'react-input-mask';
import { DebounceInput } from 'react-debounce-input';
import { useDispatch } from 'react-redux';
import CurrencyInput from 'react-currency-input-field';
import ConfirmProposal from 'src/components/shared-components/Modals/ConfirmProposal';
import routes from 'src/routes';
import getCustomerPhone from 'src/helpers/getCustomerPhone';
import cities from '../../assets/data/cities';
import crossImg from '../../assets/img/cross.svg';
import plusImg from '../../assets/img/plus.png';
import s from './CustomerProposal.module.css';
import getCookie from '../../helpers/getCookie';
import useTypedSelector from '../../hooks/useTypedSelector';
import { About } from '../../components';
import {
  IProduct, ProductItemProps, IProductFromBackend, ISearchResult, IOrderData,
} from '../CustomerProposal/types';
import { usersApi } from '../../api/api';

const { Option } = Select;

const ProductItem: React.FC<ProductItemProps> = ({
  id,
  deleteProduct,
  setProducts,
  products,
}) => {
  const [name, setName] = useState<string>('');
  const [searchResult, setSearchResult] = useState<ISearchResult[]>([]);
  const [isProductListOpen, setIsProductListOpen] = useState<boolean>(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState<boolean>(false);

  const [isCustomProductName, isSetCustomProductName] = useState(false);

  const productList = useRef<HTMLHeadingElement>(null);
  const crossBtn = useRef<HTMLImageElement>(null);

  const customProductNameHandler = () => {
    isSetCustomProductName(true);
    setIsProductListOpen(false);
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
      setIsSearchInputOpen(false);
    }
  };

  const handleClickOutside = (event: any) => {
    if (productList.current && !productList.current.contains(event.target)) {
      setIsProductListOpen(false);
    }
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

  const productNameItemHandler = (productName: string) => {
    setName(productName);
    const updatedState = products.map((item: IProduct) => {
      if (item.id === products[id - 1]?.id) {
        return { ...item, name: productName };
      }
      return item;
    });
    setProducts(updatedState);

    if (productName.length > 0) {
      setIsProductListOpen(true);
    } else if (productName.length === 0) {
      setIsProductListOpen(false);
    }
  };

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');

    if (name?.length > 0 && name?.length < 50) {
      usersApi.search(token, name).then((r) => setSearchResult(r.data.items));
    }
  }, [name]);

  const onClickProductItem = (product: ISearchResult) => {
    const updatedState = products.map((item: IProduct) => {
      if (item.id === products[id - 1]?.id) {
        return { ...item, name: product.name };
      }
      return item;
    });
    setProducts(updatedState);
    setIsProductListOpen(false);
  };

  return (
    <div className={s.product} key={id + 20}>
      <div className={s.input_bottom}>
        <div>
          <DebounceInput
            minLength={0}
            debounceTimeout={300}
            type="text"
            className={!isProductListOpen ? s.search_input : `${s.search_input} ${s.search_input_borderless}`}
            value={products[id - 1]?.name}
            onFocus={() => setIsSearchInputOpen(true)}
            onBlur={(e) => e.target.value.length === 0 && setIsSearchInputOpen(false)}
            suffix="123"
            onChange={(e: any) => productNameItemHandler(e.target.value)}
            required
          />
          {isSearchInputOpen && <img ref={crossBtn} className={s.cross_img} src={crossImg} alt="clear" />}
        </div>
        {isProductListOpen && name.length !== 0
          ? (
            <div className={s.autocomplete_list} ref={productList}>
              {searchResult.map((product: ISearchResult) => (
                <div className={s.search_item} onClick={() => onClickProductItem(product)}>
                  <span>{product.name}</span>
                  <input type="hidden" value={product.name} />
                </div>
              ))}
              <div className={s.search_block_container_1}>
                {searchResult.length > 0 && (
                <div onClick={customProductNameHandler} className={s.add_new_product}>
                  Добавить новый товар
                </div>
                )}
                {searchResult.length === 0 && name.length !== 0 ? (
                  <div className={s.search_result} onClick={customProductNameHandler}>
                    <h6>Ничего не найдено, &nbsp;</h6>
                    <h6>
                      добавить новый товар
                    </h6>
                  </div>
                ) : name.length === 0 && ''}
              </div>
            </div>
          ) : ''}
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

const CustomerTemplateProposal: React.FC = () => {
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
  const [goods, setGoods] = useState<IProduct[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoadingButton, setButtonIsLoading] = useState(false);

  const orderId: any = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');
    usersApi.getTemplate(token, orderId.id).then((r) => {
      setOrganization(r.data.organization);
      setName(r.data.name);
      setNumber(r.data.phone);
      setLinkType(r.data.linkType.name);
      setExceptionalSuppliers(r.data.exceptionalSuppliers.map((item: any) => item.user_id.id));
      setRegion(r.data.region.name);
      setDeliveryAddress(r.data.deliveryAddress);
      setComment(r.data.comment);
      setGoods(r.data.goods.map((item: IProductFromBackend, index: number) => ({
        ...item, id: index + 1, type: item.type.name, amount: item.quantity,
      })));
    });
  }, [isRefresh]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setButtonIsLoading(true);
    const data = new FormData();
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
      <div className={s.inner}>
        {/* mobile */}
        <div className={s.top_right_mobile}>
          <About />
        </div>
        {/* // */}
        <div className={s.form}>
          <form action="POST" id="new-order" onSubmit={(e) => handleSubmit(e)}>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => nameHandler(e.target.value)}
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
                      <div>Тип поставщика</div>
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
                        style={{ width: '326px' }}
                        disabled={uniqProviders.items ? uniqProviders.items.length === 0 : true}
                        placeholder="Выберите поставщиков"
                        onChange={(e: any) => handleChange(e)}
                      >
                        {
                          uniqProviders.items?.map((item: any) => (
                            <Option
                              key={item.id}
                              value={item.id}
                            >
                              {item.organization !== null ? item.organization : item.email}
                            </Option>
                          ))
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
                      isTemplatedData
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
                  <div className={s.footer_text}>
                    Нажимая кнопку «Далее», я подтверждаю свою дееспособность,
                    принимаю условия
                    {' '}
                    <NavLink to={routes.userAgreement}>
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
    </div>
  );
};

export default CustomerTemplateProposal;
