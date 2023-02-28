/* eslint-disable import/no-extraneous-dependencies */
import Input from 'antd/lib/input';
import Radio from 'antd/lib/radio';
import CalendarLocale from 'rc-picker/lib/locale/ru_RU';
import React, { useEffect, useRef, useState } from 'react';
import {
  notification, DatePicker, Space, Button, message as Message,
} from 'antd';
import {
  Redirect, useParams, Link, Prompt,
} from 'react-router-dom';
import moment from 'moment';
import CurrencyInput from 'react-currency-input-field';
import { useDispatch } from 'react-redux';
import 'moment/locale/ru';
import { PickerLocale } from 'antd/lib/date-picker/generatePicker';

import getCookie from 'src/helpers/getCookie';
import { IconType } from 'antd/lib/notification';
import ConfirmProposal from 'src/components/shared-components/Modals/ConfirmProposal';
import routes from 'src/routes';
import { ProposalStatuses } from 'src/types/proposal';
import useBeforeUnload from 'src/hooks/useBeforeUnload';
import s from './ProviderProposal.module.css';
import CustomerContactsInfo from './CustomerContactsInfo';
import UserContactsInfo from './UserContactsInfo';
import ProposalTable from './ProposalTable';
import { ProviderData, IGoods, PreviousOfferData } from './ProviderProposalsTypes';
import ProposalNotFound from '../NotFound/ProposalNotFound';
import HeaderSlider from '../../components/layout-components/Header/HeaderSlider';
import useTypedSelector from '../../hooks/useTypedSelector';
import { Footer, Header } from '../../components';
import { usersApi } from '../../api/api';

moment.locale('ru');

interface ProviderProposalsProps {
  isMobile: boolean
}

interface IsFileValid {
  result?: number;
  msg?: string;
  summary?: string;
}

const ProviderProposals: React.FC<ProviderProposalsProps> = ({ isMobile }) => {
  const [downloadType, setDownloadType] = useState(1);
  const [offersCount] = useState(0);
  const [goods, setGoods] = useState<IGoods[]>([]);
  const [deliveryType, setDeliveryType] = useState('Курьер');
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryComment, setDeliveryComment] = useState('');
  const [fileData, setFileData] = useState<File | null>(null);
  const [isFileValid, setIsFileValid] = useState<IsFileValid | null>({});
  const [isQuantityEdited, setIsQuantityEdited] = useState<boolean[] | []>([]);
  const responseInfo = useTypedSelector((state) => state.responseResult);

  const { organization, name, phone } = useTypedSelector((state) => state.userProfile);

  const { isRefresh } = useTypedSelector((state) => state.refresh);

  const [isFetching, setIsFetching] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const [commentProductName, setCommentProductName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editCommentText, setEditCommentText] = useState('');

  const [deliveryStartDate, setDeliveryStartDate] = useState<string | any>('');
  const [deliveryEndDate, setDeliveryEndDate] = useState<string | any>('');

  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isEditCommentModalVisible, setIsEditCommentVisible] = useState(false);

  const [isProposalValid, setIsProposalValid] = useState(true);

  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [editedGoods, setEditedGoods] = useState<IGoods[]>([]);

  const dispatch = useDispatch();

  const [providerData, setProviderData] = useState<ProviderData>({
    organization: '',
    name: '',
    phone: '',
    deliveryAddress: '',
    comment: '',
    uploadedFile: null,
    linkType: '',
    region: '',
    user: '',
  });

  const [prevOfferData, setPrevOfferData] = useState<PreviousOfferData>({
    deliveryComment: '',
    deliveryDate: '',
    deliveryMaxDate: '',
    deliveryPrice: '',
    deliveryType: {
      name: '',
    },
    goods: {
      price: '',
      comment: null,
      offersGoods: {
        id: 0,
      },
    },
    name: '',
    offersCount: 0,
    organization: '',
    phone: '',
    uploadedFile: null,
  });

  const { RangePicker } = DatePicker;
  const dateFormat = 'DD.MM.YYYY';

  const openNotificationWithIcon = (
    type: IconType,
    message: string,
    duration: number,
    description: string,
  ) => {
    notification[type]({
      message,
      duration,
      description,
    });
  };

  function disabledDate(current: any) {
    return current && current < moment().endOf('day');
  }

  function onDateChange(date: any, dateString: any) {
    setDeliveryStartDate(dateString[0].replaceAll('/', '-').replaceAll('.', '-'));
    setDeliveryEndDate(dateString[1].replaceAll('/', '-').replaceAll('.', '-'));
  }

  const { id } = useParams<{ id: string; }>();

  useEffect(() => {
    setIsLoadingButton(false);
  }, []);

  useBeforeUnload();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoadingButton(true);
    const data = new FormData();
    const today = new Date();

    const updatedData: {
      name?: string;
      organization?: string;
      phone?: string;
    } = {};

    data.append('organization', prevOfferData.organization);
    data.append('name', prevOfferData.name);
    data.append('phone', prevOfferData.phone);

    data.append('deliveryType', deliveryType);

    data.append('deliveryDate', new Date(
      parseInt(deliveryStartDate.split('-')[2], 10),
      parseInt(deliveryStartDate.split('-')[1], 10) - 1,
      parseInt(deliveryStartDate.split('-')[0], 10),
      today.getHours(),
      today.getMinutes(),
      today.getSeconds(),
    ).toString());

    data.append('deliveryMaxDate', new Date(
      parseInt(deliveryEndDate.split('-')[2], 10),
      parseInt(deliveryEndDate.split('-')[1], 10) - 1,
      parseInt(deliveryEndDate.split('-')[0], 10),
      today.getHours(),
      today.getMinutes(),
      today.getSeconds(),
    ).toString());

    data.append('deliveryPrice', `${deliveryPrice}`);
    data.append('deliveryComment', deliveryComment);

    if (name !== prevOfferData.name) {
      updatedData.name = prevOfferData.name;
    }

    if (organization !== prevOfferData.organization) {
      updatedData.organization = prevOfferData.organization;
    }

    if (phone !== prevOfferData.phone) {
      updatedData.phone = prevOfferData.phone;
    }

    for (let i = 0; i < goods.length; i += 1) {
      if (editedGoods[i].comment && editedGoods[i].comment.length > 0) data.append(`goods[${i}][comment]`, editedGoods[i].comment);
      if (goods[i].quantity !== editedGoods[i].quantity && editedGoods[i].quantity) data.append(`goods[${i}][quantity]`, `${editedGoods[i].quantity}`);

      data.append(`goods[${i}][productId]`, `${goods[i].id}`);
    }

    if (downloadType === 2 && isFileValid !== null) {
      data.append('file', fileData as File);

      for (let i = 0; i < goods.length; i += 1) {
        data.append(`goods[${i}][price]`, '0');
      }
    } else {
      for (let i = 0; i < goods.length; i += 1) {
        data.delete('file');

        data.append(`goods[${i}][price]`, `${editedGoods[i].quantity ? editedGoods[i].price : 0}`);
      }
    }
    const token: string | null | undefined = getCookie('Authentication');

    usersApi.createNewOffer(token, data, id).then((response: any) => {
      if (name !== prevOfferData.name
        || organization !== prevOfferData.organization
        || phone !== prevOfferData.phone
      ) {
        const newToken: string | null | undefined = getCookie('Authentication');
        usersApi.updateData(newToken, updatedData);
      }
      dispatch({
        type: 'GET_RESULT',
        payload: {
          result: response.data.result,
          msg: response.data.msg,
          orderId: response.data.orderId,
          offersCount,
        },
      });
    }).catch(() => setTimeout(() => setIsLoadingButton(false), 15000));
  }

  const uploadFile = (e: Event) => {
    e.preventDefault();
    const token: string | null | undefined = getCookie('Authentication');

    const data = new FormData();

    data.append('file', fileData as File);

    usersApi.checkFile(token, data)
      .then((r) => setIsFileValid(r.data)).catch(() => setIsFileValid({
        ...isFileValid,
        result: 0,
        msg: 'error',
      }));
  };

  const [status, setStatus] = useState(ProposalStatuses.NOT_PROCESSED);
  const [hasOffer, setHasOffer] = useState(false);

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');

    usersApi.getProviderProposal(token, id).then((r) => {
      if (r.data.result === false) {
        setIsProposalValid(false);
      }

      if (r.data?.order) {
        setProviderData({
          organization: r.data.order.organization,
          name: r.data.order.name,
          phone: r.data.order.phone,
          deliveryAddress: r.data.order.deliveryAddress,
          comment: r.data.order.comment,
          uploadedFile: r.data.order.uploadedFile,
          linkType: r.data.order.linkType.name,
          region: r.data.order.region.name,
          user: r.data.order.user.email,
        });

        if (r.data.offer && r.data.order.offersCount !== 0) {
          setHasOffer(true);
          setPrevOfferData({
            deliveryComment: r.data.offer.deliveryComment,
            deliveryDate: r.data.offer.deliveryDate,
            deliveryMaxDate: r.data.offer.deliveryMaxDate,
            deliveryPrice: r.data.offer.deliveryPrice,
            deliveryType: r.data.offer.deliveryType.name,
            goods: r.data.offer.goods,
            name: r.data.offer.name,
            offersCount: r.data.offer.offersCount,
            organization: r.data.offer.organization,
            phone: r.data.offer.phone,
            uploadedFile: r.data.offer.uploadedFile,
          });

          setGoods(r.data.offer.goods.map((product: any, index: number) => ({
            ...r.data.order.goods[index],
            price: Number(product.price),
            comment: product.comment,
            isCommentVisible: false,
          })));
          setEditedGoods(r.data.order.goods.map((product: IGoods, index: number) => ({
            ...product,
            price: r.data.offer.goods[index].price,
            quantity: r.data.offer.goods[index].quantity
              ? r.data.offer.goods[index].quantity
              : product.quantity,
            comment: '',
            isCommentVisible: false,
          })));
          setIsQuantityEdited((prev: boolean[]) => {
            const newArr = [...prev];
            r.data.order.goods.forEach((el: any, index: number) => {
              if (r.data.offer.goods[index].quantity) {
                newArr[index] = true;
              }
            });
            return newArr;
          });
        } else {
          setHasOffer(false);
          setGoods(
            r.data.order.goods.map(
              (product: any) => ({
                ...product,
                price: 0,
                comment: '',
                isCommentVisible: false,
              }),
            ),
          );
          setEditedGoods(
            r.data.order.goods.map(
              (product: any) => ({
                ...product,
                price: 0,
                comment: '',
                isCommentVisible: false,
              }),
            ),
          );
        }
        if (r.data.offer && r.data.offer.offersCount === 3) openNotificationWithIcon('warning', 'Внимание !', 0, 'Вы не можете изменить предложение более 3х раз');
      }
    })
      .then(() => usersApi.getProviderProposalStatus(token, id))
      .then((response) => {
        if (!response || !response.data) {
          throw response;
        }

        setStatus(response.data.status || ProposalStatuses.NOT_PROCESSED);
        setIsProposalValid(true);
      })
      .catch(() => {
        setIsProposalValid(false);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [isRefresh]);

  useEffect(() => {
    if (prevOfferData.deliveryDate !== '') {
      setDeliveryStartDate(prevOfferData.deliveryDate.split('-').reverse().join('-').replaceAll('.', '-'));
      setDeliveryEndDate(prevOfferData.deliveryMaxDate.split('-').reverse().join('-').replaceAll('.', '-'));
    } else {
      setDeliveryStartDate(moment().format('DD-MM-YYYY'));
      setDeliveryEndDate(moment().add(1, 'day').format('DD-MM-YYYY'));
    }
  }, [isFetching]);

  useEffect(() => {
    if (downloadType !== 2) {
      setFileData(null);
    }
  }, [downloadType]);

  const datePick = () => {
    if (!isFetching) {
      if (prevOfferData.deliveryMaxDate !== '') {
        return [moment(prevOfferData.deliveryDate), moment(prevOfferData.deliveryMaxDate)];
      }
      return [moment(), moment().add(1, 'day')];
    }

    return undefined;
  };

  const checkboxHandler = (e: any) => {
    setDownloadType(e.target.value);
  };

  const handleClick = () => {
    const token: string | null | undefined = getCookie('Authentication');

    setIsLoadingButton(true);

    usersApi.setProviderProposalStatus(token, id)
      .then((r) => {
        if (!r.data.result) {
          throw r;
        }

        setStatus(ProposalStatuses.PROCESSING);
      })
      .catch(() => {
        Message.error('Произошла ошибка при обработке заявки, попробуйте позже');
      })
      .finally(() => {
        setIsLoadingButton(false);
      });
  };

  return (

    isProposalValid
      ? (
        <>
          {!isMobile ? <Header /> : <HeaderSlider />}
          <form
            ref={formRef}
            className={s.providerForm}
            id="new-offer"
            action="POST"
            onSubmit={handleSubmit}
          >
            <section className={s.proposal_section}>
              <div className={s.header}>
                <div className={s.block_text_more}>
                  Сделайте предложение клиенту
                </div>
                {!hasOffer && status === ProposalStatuses.PROCESSING && (
                  <div className={s.proposal_status}>
                    Заявка принята в обработку
                  </div>
                )}
                {!hasOffer && status === ProposalStatuses.NOT_PROCESSED && (
                  <Button
                    type="default"
                    size="large"
                    onClick={handleClick}
                    disabled={isLoadingButton}
                  >
                    Принять заявку в обработку
                  </Button>
                )}
              </div>
              <div className={s.proposals_blocks}>
                <CustomerContactsInfo ProviderData={providerData} />
                <UserContactsInfo
                  prevOfferData={prevOfferData}
                  setPrevOfferData={setPrevOfferData}
                />
              </div>
            </section>

            <section className={s.choose_download_type_container}>
              <div className={s.choose_download_type}>
                <Radio.Group className={s.radio_group}>
                  <div className={s.radio_item}>
                    <Radio defaultChecked onChange={(e) => checkboxHandler(e)}>
                      <div>
                        <b>Сделать предложение вручную</b>
                        {' '}
                        <br />
                        <div>Введите данные в форму</div>
                      </div>
                    </Radio>
                  </div>
                  <div className={s.radio_item}>
                    <Radio style={{ top: '20px' }} onChange={(e) => checkboxHandler(e)} value={2}>
                      <div>
                        <b>Сбросить счёт</b>
                        {' '}
                        <br />
                        <div>Загрузить файл в формате .xls(x) или .pdf</div>
                        <div className={s.radio_description}>
                          При отправки предложения в виде
                          файла , оно не
                          будет иметь конкурентного преимущества
                        </div>
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>
              </div>
            </section>

            <div className={s.proposal_table_with_summary}>
              <div className={s.attention_message}>
                <span>
                  * если товара нет в наличии, оставьте поле &quot;цена&quot; пустым.
                </span>
              </div>
              {downloadType === 2
                ? (
                  <div className={s.download_bill_block_container}>
                    <div className={s.download_bill_block}>
                      <div className={s.download_bill_block_title}>
                        Загрузите счет
                      </div>
                      <div className={s.download_bill_block_description}>
                        Загрузите счет в формате .xls(x) или .pdf
                      </div>
                      <div className={s.form_btns_download}>
                        <div className={s.btns_download}>
                          <div className={s.choose_file_block}>

                            <input
                              onChange={(e) => setFileData(e.target.files
                                ? e.target.files[0]
                                : null)}
                              disabled={offersCount === 3}
                              type="file"
                              id="imageUpload"
                            />
                            <label
                              htmlFor="imageUpload"
                              className={`${s.btn} ${s.btn_white_bg}`}
                            >
                              Выберите файл
                            </label>
                            <span>{fileData ? fileData.name : 'Выберите файл'}</span>
                          </div>
                          <div className={s.download_file_block}>
                            <input disabled={offersCount === 3} type="file" />
                          </div>
                          {offersCount !== 3 ? (
                            <button
                              type="button"
                              onClick={(e: any) => uploadFile(e)}
                              className={`${s.btn} ${s.main_style_btn}`}
                            >
                              Загрузить
                            </button>
                          ) : ''}
                          {isFileValid !== null && (
                            <>
                              {!isFileValid.result && (
                                <span className={s.add_file_response_ok}>
                                  Файл был загружен, однако мы не смогли распознать поле
                                  с итоговой суммой.
                                </span>
                              )}
                              {isFileValid.result && (
                                <span
                                  className={s.add_file_response_ok}
                                >
                                  Загружено товаров на
                                  {' '}
                                  {isFileValid.summary}
                                  {' '}
                                  ₽
                                </span>
                              )}
                              {isFileValid.msg === 'error' && (
                                <span className={s.add_file_response_error}>
                                  Ошибка загрузки файла. Выберите .pdf или .xls(x) файл.
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ProposalTable
                    prevOfferData={prevOfferData}
                    setIsCommentModalVisible={setIsCommentModalVisible}
                    isCommentModalVisible={isCommentModalVisible}
                    setCommentProductName={setCommentProductName}
                    setIsEditCommentVisible={setIsEditCommentVisible}
                    isEditCommentModalVisible={isEditCommentModalVisible}
                    isQuantityEdited={isQuantityEdited}
                    setIsQuantityEdited={setIsQuantityEdited}
                    goods={goods}
                    setCommentText={setCommentText}
                    editCommentText={editCommentText}
                    offersCount={offersCount}
                    commentProductName={commentProductName}
                    commentText={commentText}
                    setEditCommentText={setEditCommentText}
                    editedGoods={editedGoods}
                    setEditedGoods={setEditedGoods}
                  />
                )}

              <div className={s.delivery_condition_container}>
                <div className={s.delivery_condition}>
                  <div className={s.delivery_condition_title}>
                    Условия доставки и комментарий
                  </div>
                  <div className={s.delivery_condition_line}>
                    <div className={s.delivery_condition_text_blocks}>
                      <div className={s.fill_blocks_container}>
                        <span className={s.delivery_type}>Способ доставки</span>

                        {prevOfferData.deliveryType.name !== '' && (
                          <select
                            disabled={prevOfferData.offersCount === 3}
                            defaultValue={prevOfferData.deliveryType.name}
                            onChange={(e) => setDeliveryType(e.target.value)}
                            id="ControlSelectDeliveryType"
                            className={s.condition_contact_data}
                          >
                            <option
                              selected={prevOfferData.deliveryType.name === 'Курьер'}
                            >
                              Курьер
                            </option>

                            <option
                              selected={prevOfferData.deliveryType.name === 'Транспортная компания'}
                            >
                              Транспортная
                              компания
                            </option>
                          </select>
                        )}
                      </div>
                      <div className={s.date_container}>
                        <div className={s.date_titles}>
                          <span className={s.delivery_date}>Дата доставки</span>
                          <span className={s.delivery_maxdate}>Срок действия предложения (до)</span>
                        </div>
                        <div className={s.date_picker_container}>
                          <Space direction="vertical" size={12}>
                            {!isFetching && (
                              <RangePicker
                                style={{ border: '1px solid black !important' }}
                                className={s.date_picker}
                                defaultValue={datePick() as any}
                                format={dateFormat}
                                disabledDate={disabledDate}
                                disabled={prevOfferData.offersCount === 3}
                                onChange={onDateChange}
                                locale={{
                                  lang: {
                                    placeholder: 'Выберите дату',
                                    yearPlaceholder: 'Выберите год',
                                    quarterPlaceholder: 'Выберите квартал',
                                    monthPlaceholder: 'Выберите месяц',
                                    weekPlaceholder: 'Выберите неделю',
                                    rangePlaceholder: ['Начальная дата', 'Конечная дата'],
                                    rangeYearPlaceholder: ['Начальный год', 'Год окончания'],
                                    rangeMonthPlaceholder: ['Начальный месяц', 'Конечный месяц'],
                                    rangeWeekPlaceholder: ['Начальная неделя', 'Конечная неделя'],
                                    ...CalendarLocale,
                                  },
                                  dateFormat: 'YYYY-MM-DD',
                                } as PickerLocale}
                              />
                            )}

                          </Space>
                        </div>
                      </div>
                      <div className={s.fill_blocks_container}>
                        <span className={s.delivery_price}>Стоимость доставки (₽)</span>
                        {prevOfferData.deliveryPrice.length > 0 && (
                          <CurrencyInput
                            allowNegativeValue={false}
                            disableGroupSeparators
                            decimalSeparator="."
                            disabled={prevOfferData.offersCount === 3}
                            required
                            title="Введите только число"
                            onChange={(e) => {
                              setDeliveryPrice(Number(e.target.value));
                            }}
                            defaultValue={parseFloat(prevOfferData.deliveryPrice)}
                            className={`${s.delivery_price} ${s.condition_contact_data}`}
                          />
                        )}

                        {prevOfferData.deliveryPrice.length === 0 && (
                          <CurrencyInput
                            allowNegativeValue={false}
                            disableGroupSeparators
                            decimalSeparator="."
                            disabled={prevOfferData.offersCount === 3}
                            required
                            title="Введите только число"
                            onChange={(e) => {
                              setDeliveryPrice(Number(e.target.value));
                            }}
                            defaultValue={0}
                            className={`${s.delivery_price} ${s.condition_contact_data}`}
                          />
                        )}
                      </div>

                    </div>
                  </div>

                  <div className={s.comment_block}>
                    <span>Комментарий в свободной форме</span>
                    <Input.TextArea
                      disabled={prevOfferData.offersCount === 3}
                      defaultValue={prevOfferData.deliveryComment !== ''
                        ? prevOfferData.deliveryComment : ''}
                      onChange={(e) => setDeliveryComment(e.target.value)}
                      className={s.condition_data}
                      maxLength={512}
                      rows={4}
                    />

                  </div>

                  {prevOfferData.offersCount !== 3 && (
                    <div className={s.proposal_block_container}>
                      <div className={s.proposal_block}>
                        <div className={s.final_block_container}>
                          {!responseInfo.result
                            ? (
                              <ConfirmProposal
                                formRef={formRef}
                                loading={isLoadingButton}
                              />
                            )
                            : <Redirect to={routes.success} />}
                          <div className={s.final_block_text}>
                            <span>
                              Нажимая кнопку «Далее», я подтверждаю свою дееспособность,
                              принимаю условия
                              {' '}
                              <Link
                                to={routes.agreement}
                              >
                                Пользовательского соглашения
                              </Link>
                              &nbsp;и подтверждаю свое &nbsp;
                              <Link
                                to={routes.privacyPolicy}
                              >
                                согласие на обработку персональных данных
                              </Link>
                              &nbsp;В соответсвии с Федеральным законом № 152-ФЗ
                              &quot;О персональных данных&quot; от 27.06.2006 г.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
          <Footer />
          <Prompt
            when={formRef.current?.checkValidity() && !responseInfo.result}
            message="Закрыть страницу с предложением? Данные НЕ сохранятся"
          />
        </>
      )
      : <ProposalNotFound />
  );
};

export default ProviderProposals;
