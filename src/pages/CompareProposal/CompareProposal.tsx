import React, { useEffect, useMemo, useState } from 'react';
import Popconfirm from 'antd/lib/popconfirm';
import {
  message, Table, TablePaginationConfig, Tooltip,
} from 'antd';
import Button from 'antd/lib/button';
import { useParams } from 'react-router-dom';
import { EyeOutlined, PlusSquareOutlined, RightOutlined } from '@ant-design/icons';
import { FilterValue } from 'antd/lib/table/interface';
import cx from 'classnames';

import { ProposalStatuses, PROPOSAL_STATUS_LABELS } from 'src/types/proposal';
import s from './CompareProposal.module.css';
import './CompareProposal.css';
import pdfImg from '../../assets/img/pdf.svg';
import CartModal from './CartModal/CartModal';
import OrderNotFound from '../NotFound/OrderNotFound';
import HeaderSlider from '../../components/layout-components/Header/HeaderSlider';

import useTypedSelector from '../../hooks/useTypedSelector';
import getCookie from '../../helpers/getCookie';
import { Footer, Header } from '../../components';
import { usersApi } from '../../api/api';

interface IOffersGoods {
  id: any;
  code: null | string | number,
  name: string,
  quantity: number
  type: {
    name: string
  }
}

interface Good {
  comment: string | null;
  offersGoods: IOffersGoods;
  price: string;
  length: number;
  quantity: number | null;
}

interface CompareData {
  deliveryComment: string,
  deliveryDate: string,
  deliveryMaxDate: string,
  deliveryPrice: string,
  deliveryType: {
    name: string
  },
  goods: Array<Good>,
  name: string,
  organization: string,
  phone: string,
  uploadedFile?: null
  offerUser: {
    email: string
    website?: string;
    length: number
    id: number
  },
  length: number,
  code: string,
  quantity: number | null,
  status: ProposalStatuses,
  type?: {
    name: string;
  }
}

interface ICartData {
  comment: string,
  offersGoods: {
    code: string,
    name: string,
    quantity: string | number,
    price: number,
    id: number
  },
  email: string,
  total: string | number,
  quantity: number | null
}

interface CartData {
  comment: string | null;
  offer: {};
  offersGoods: IOffersGoods,
  price: string;
}

interface CartDataObject {
  msg: string;
  result: boolean;
}
interface CartDataArrayItem {
  fixedQuantity: boolean;
  quantity: string | number;
  id?: number;
  item?: CartData;
  productId?: number;
  userId?: number;
}

interface CompareProposalProps {
  isMobile: boolean;
}

interface OffersStatus {
  status: ProposalStatuses;
  order: {
    id: number;
  },
  user: {
    id: number;
    name: string;
    organization: string;
  }
}

const CompareProposal: React.FC<CompareProposalProps> = ({ isMobile }) => {
  const [isCartModalOpened, setIsCartModalOpened] = useState<boolean>(false);
  const [compareData, setCompareData] = useState<CompareData[]>([]);
  const [compareDataFilter, setCompareDataFilter] = useState<string | null>(null);
  const [cartData] = useState<ICartData[]>([]);
  const [isMoreColumnsVisible, setIsMoreColumnsVisible] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [allProductCount, setAllProductCount] = useState<number>(0);
  const [isOrderValid, setIsOrderValid] = useState<boolean>(true);
  const [isCloseOrderBtnVisible, setIsCloseOrderBtnVisible] = useState<boolean>(false);
  const [lowestPriceArr, setLowestPriceArr] = useState<any>([]);
  const [responseFromServer, setResponseFromServer] = useState<any>(0);
  const [offersStatus, setOffersStatus] = useState<Array<OffersStatus> | null>(null);

  const [
    testCartDataFromServer,
    setTestCartDataFromServer,
  ] = useState<CartDataObject | Array<CartDataArrayItem>>([]);
  const { items } = useTypedSelector((state) => state);
  const { isProvider } = useTypedSelector((state) => state.userProfile);
  const { isRefresh, isOrderClosed } = useTypedSelector((state) => state.refresh);
  const { isCartRefreshed } = useTypedSelector((state) => state.cartItems);

  const [isRequestSuccess, setIsRequestSuccess] = useState(false);

  const { id }: any = useParams();

  const filteredCompareData = useMemo(() => (
    compareData.filter(({ organization }) => (
      !compareDataFilter || organization === compareDataFilter
    ))
  ), [compareData, compareDataFilter]);

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');

    if (!isCartModalOpened) {
      usersApi.getCompareData(token, id).then((r) => {
        if (r.data.offers.length !== 0) {
          const testArray = r.data.offers.map((item: any) => ({
            ...item,
            goods: item.goods.sort((a: any, b: any) => a.offersGoods.id - b.offersGoods.id),
            status: ProposalStatuses.DONE,
          }));
          setCompareData(testArray);
          setIsOrderValid(true);
          setIsRequestSuccess(true);
          setIsCloseOrderBtnVisible(r.data.active);
        } else {
          setIsCloseOrderBtnVisible(r.data.active);
          setIsRequestSuccess(true);
          setIsOrderValid(true);
          setCompareData(r.data.order.goods);
        }

        setOffersStatus(r.data.offersStatus || null);
      }).catch(() => {
        setIsOrderValid(false);
      });
    }
  }, [id, isRefresh, isCartModalOpened]);

  const sortCartDataById = (data: Array<CartDataArrayItem>) => (
    Array.from(data)
      .sort((a, b) => {
        if (!a.id || !b.id) {
          return 0;
        }

        return a.id - b.id;
      })
  );

  const updateCartData = (data: Array<CartDataArrayItem>) => {
    setTestCartDataFromServer((previousCartData) => {
      const typedPreviousCartData = previousCartData as Array<CartDataArrayItem>;

      if (!typedPreviousCartData.length || data.length !== typedPreviousCartData.length) {
        return data;
      }

      return typedPreviousCartData.map((item) => {
        if (item.id === responseFromServer.id) {
          const editedItem = data.find((dataItem) => (
            dataItem.id === responseFromServer.id
          ));

          if (editedItem) {
            return editedItem;
          }

          const newCartDataSorted = sortCartDataById(data);

          return newCartDataSorted[data.length - 1];
        }

        return item;
      });
    });
  };

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');

    if (isRequestSuccess && responseFromServer?.msg !== 'Товар удален') {
      usersApi.getCartData(token, id)
        .then((r) => updateCartData(r.data));
    }
  }, [responseFromServer, isRefresh, isRequestSuccess, isCartRefreshed]);

  useEffect(() => {
    if (compareData[0]?.goods) {
      setAllProductCount(compareData[0]?.goods?.length);
    } else {
      setAllProductCount(compareData.length);
    }

    const test: any = {};
    const min: any[] = [];
    const arr: any[] = [];

    for (let i = 0; i < compareData?.length; i += 1) {
      for (let j = 0; j < compareData[i]?.goods?.length; j += 1) {
        test[compareData[i]?.goods[j].offersGoods.id] = [];
        arr[compareData[i]?.goods[j].offersGoods.id] = [];
      }
    }

    for (let i = 0; i < compareData.length; i += 1) {
      for (let j = 0; j < compareData[i]?.goods?.length; j += 1) {
        test[compareData[i]?.goods[j].offersGoods.id]
          .push(compareData[i]?.goods[j].price);
        if (compareData[i]?.goods[j].price !== '0.00') {
          arr[compareData[i]?.goods[j].offersGoods.id]
            .push(compareData[i]?.goods[j].price);
        }
      }
    }

    Object.keys(test).forEach((key) => {
      min.push([Math.min(...arr[Number(key)])]);
    });

    setLowestPriceArr(min);

    if (compareData.length > 0) {
      setTableLoading(false);
    }
  }, [compareData]);

  useEffect(() => {
    if (!Array.isArray(testCartDataFromServer) && testCartDataFromServer?.result) {
      setIsCloseOrderBtnVisible(false);
    }
  }, [testCartDataFromServer]);

  const closeOrder = () => {
    const token: string | null | undefined = getCookie('Authentication');
    const data = new FormData();
    data.append('orderId', id);
    usersApi.closeCart(token, id, data).then((r) => {
      if (r.data.result) {
        message.success('Заказ отправлен в архив!', 5);
        setIsCloseOrderBtnVisible(false);
      } else message.error('Заказ не найден!', 5);
    });
  };

  useEffect(() => {
    if (isOrderClosed) {
      closeOrder();
    }
  }, [isOrderClosed]);

  const addProductToCart = (cartProduct: ICartData | Good, index: number) => {
    const token: string | null | undefined = getCookie('Authentication');
    const goods = [
      {
        productId: cartProduct.offersGoods.id,
        userId: filteredCompareData[index].offerUser.id,
        quantity: cartProduct.quantity ? cartProduct.quantity : cartProduct.offersGoods.quantity,
        fixedQuantity: Boolean(cartProduct.quantity),
      },
    ];

    const typedCartData = testCartDataFromServer as CartDataObject;

    if (typedCartData.msg) {
      usersApi.addProductToCartPost(token, id, goods).then((r) => {
        setTestCartDataFromServer([...goods]);
        setResponseFromServer(r.data);
        message.success('Позиция добавлена в корзину!', 3);
      });
    }
    if (!typedCartData.msg) {
      usersApi.addProductToCartPatch(token, id, goods).then((r) => {
        setResponseFromServer(r.data);
        message.success('Позиция добавлена в корзину!', 3);
      });
    }
  };

  const hasGoods = filteredCompareData[0]?.goods;

  const getQuantityLayout = () => {
    const offersStatusColumns = offersStatus
      ? offersStatus.map((item, index: number) => ({
        title: !isProvider ? `${item.user.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        key: 'quantity',
        render: () => null,
      }))
      : [];

    const offersColumns = hasGoods
      ? filteredCompareData.map((item, index: number) => ({
        title: !isProvider ? `${item.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        key: 'quantity',
        render: (text: string, record: CompareData, indexRender: any) => {
          if (indexRender < item.goods.length) {
            const a: any = [];
            filteredCompareData[index].goods.map((x) => !a.includes(x) && a.push(x));
            return a[indexRender].quantity
              ? a[indexRender].quantity
              : a[indexRender]?.offersGoods.quantity;
          }
          if (indexRender === item.goods.length) {
            let sum = 0;
            item.goods.forEach((goodItem) => {
              sum += Number(
                goodItem.quantity
                  ? goodItem.quantity
                  : goodItem.offersGoods.quantity,
              );
            });
            return <b>{sum.toFixed()}</b>;
          }
          return (
            item.uploadedFile
              ? (
                <a href={item.uploadedFile}>
                  <img
                    className={s.pdfIcon}
                    width={30}
                    src={pdfImg}
                    alt="download file"
                  />
                </a>
              ) : '—'
          );
        },
      }))
      : [];

    if (!offersStatusColumns.length && !offersColumns.length) {
      return null;
    }

    return offersColumns.concat(offersStatusColumns);
  };

  const getCostLayout = () => {
    const offersStatusColumns = offersStatus
      ? offersStatus.map((item, index: number) => ({
        title: !isProvider ? `${item.user.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        key: 'name',
        render: () => null,
      }))
      : [];

    const offersColumns = hasGoods
      ? filteredCompareData.map((item, index: number) => ({
        title: !isProvider ? `${item.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        key: 'name',
        render: (text: string, record: CompareData, indexRender: number) => {
          if (filteredCompareData[0].goods && indexRender < item.goods.length) {
            const a: any = [];
            filteredCompareData[index].goods.map((x) => !a.includes(x) && a.push(x));
            return Number(a[indexRender]?.price).toFixed(2);
          }

          return null;
        },
      }))
      : [];

    if (!offersStatusColumns.length && !offersColumns.length) {
      return null;
    }

    return offersColumns.concat(offersStatusColumns);
  };

  const getTotalLayout = () => {
    const offersStatusColumns = offersStatus
      ? offersStatus.map((item, index: number) => ({
        title: !isProvider ? `${item.user.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        key: 'name',
        render: () => null,
      }))
      : [];

    const offersColumns = hasGoods
      ? filteredCompareData.map((item, index: number) => ({
        title: !isProvider ? `${item.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        key: 'name',
        render: (text: string, record: CompareData, indexRender: number) => {
          const a: any = [];
          filteredCompareData[index]?.goods?.forEach((x: any) => {
            if (!a.includes(x)) {
              a.push(x);
            }
          });

          function contains(cd: any, it: any, org: string) {
            for (let i = 0; i < cd.length; i += 1) {
              if (cd[i].item.offersGoods.name === it && cd[i].item.offer.organization === org) {
                return true;
              }
            }
            return false;
          }

          if (filteredCompareData[0].goods && indexRender < item.goods.length) {
            const offersGoodsName = item.goods[indexRender]?.offersGoods.name;

            const canAddProduct = (
              !Array.isArray(testCartDataFromServer)
                || !testCartDataFromServer[0]?.item
                || !contains(testCartDataFromServer, offersGoodsName, item.organization)
            );

            return (
              <div className={`${s.plusBtn_container}`}>
                <span
                  className={cx({ [s.disabled]: !canAddProduct })}
                >
                  {!isProvider && (
                    <PlusSquareOutlined
                      onClick={() => addProductToCart(item.goods[indexRender], index)}
                    />
                  )}

                </span>
                <span
                  className={lowestPriceArr[indexRender][0] === Number(item.goods[indexRender].price) ? s.bold : ''}
                >
                  {parseFloat((Number(a[indexRender]?.price) * Number(a[indexRender].quantity
                    ? a[indexRender].quantity : a[indexRender]?.offersGoods.quantity)).toString())}
                </span>
              </div>
            );
          }
          if (filteredCompareData[0].goods && indexRender === item.goods.length) {
            let sum = 0;
            filteredCompareData[0].goods.forEach((_, goodIndex) => {
              sum += Number(a[goodIndex]?.price) * Number(a[goodIndex].quantity
                ? a[goodIndex].quantity : a[goodIndex]?.offersGoods.quantity);
            });
            return <b>{sum.toFixed()}</b>;
          }

          return null;
        },
      }))
      : [];

    if (!offersStatusColumns.length && !offersColumns.length) {
      return null;
    }

    return offersColumns.concat(offersStatusColumns);
  };

  const getCommentLayout = () => {
    const offersStatusColumns = offersStatus
      ? offersStatus.map((item, index: number) => ({
        title: !isProvider ? `${item.user.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        dataIndex: 'quantity',
        key: 'name',
        minWidth: 900,
        render: () => null,
      }))
      : [];

    const offersColumns = hasGoods
      ? filteredCompareData.map((item, index: number) => ({
        title: !isProvider ? `${item.organization}\n${PROPOSAL_STATUS_LABELS[item.status]}` : `Поставщик ${index + 1}`,
        dataIndex: 'quantity',
        key: 'name',
        minWidth: 900,
        render: (_: string, record: CompareData, indexRender: number) => {
          if (filteredCompareData[0].goods && indexRender < item.goods.length) {
            if (item.goods[indexRender].comment === null) {
              return '-';
            }

            return (
              <Tooltip
                className="eye_tooltip"
                color="white"
                trigger="click"
                placement="left"
                title={(
                  <div className={s.tooltip}>
                    <div className={s.tooltip_header}>
                      Комментарий к
                      :
                      {record.name}
                    </div>
                    <div
                      className={s.tooltip_value}
                    >
                      {item.goods[indexRender].comment}
                    </div>
                  </div>
                )}
              >
                <EyeOutlined className={s.eye} />
              </Tooltip>
            );
          }

          return null;
        },
      }))
      : [];

    if (!offersStatusColumns.length && !offersColumns.length) {
      return null;
    }

    return offersColumns.concat(offersStatusColumns);
  };

  const fullColumns = [
    {
      title: 'Штрихкод',
      key: 'code',
      filters: compareData.map(({ organization }) => ({
        text: organization,
        value: organization,
      })),
      render: (text: string, record: CompareData) => record.code,
      filterMultiple: false,
    },
    {
      title: 'Наименование товара',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      fixed: 'left' as 'left',
      render: (text: string, record: CompareData, indexRender: any) => {
        if (filteredCompareData[0].goods && indexRender < filteredCompareData[0].goods.length) {
          return record.name;
        }
        if (filteredCompareData[0].goods === undefined) {
          return record.name;
        }
        if (filteredCompareData[0].goods && indexRender === filteredCompareData[0].goods.length) {
          return (
            <b>Итого</b>
          );
        }
        return (
          <div className={s.pdfTextBlock}>
            <div>Скачать предложение</div>
            <span>тех, кто загрузил счёт, как предложения</span>
          </div>

        );
      },
    },
    {
      title: 'Кол-во',
      key: 'quantity1',
      dataIndex: 'quantity',
      render: (text: string, record: CompareData, indexRender: number) => {
        let sum = 0;
        filteredCompareData[0]?.goods?.forEach((item) => {
          sum += item.offersGoods.quantity;
        });
        if (filteredCompareData[0].goods && indexRender < filteredCompareData[0].goods.length) {
          return record.quantity;
        }
        if (!filteredCompareData[0].goods && indexRender < filteredCompareData.length) {
          return record.quantity;
        }
        if (filteredCompareData[0].goods && indexRender === filteredCompareData[0].goods.length) {
          return <b>{sum}</b>;
        }
        return null;
      },
    },
    {
      title: 'Единица измерения',
      key: 'type',
      render: (text: string, record: CompareData) => record.type?.name,
    },
    {
      title: 'Кол-во',
      children: getQuantityLayout(),
    },
    {
      title: 'Стоимость за единицу, руб',
      children: getCostLayout(),
    },
    {
      title: 'Итог руб.',
      children: getTotalLayout(),
    },
    {
      title: 'Комментарий',
      children: getCommentLayout(),
    },
  ];

  const collapsedColumns = [
    {
      title: 'Наименование товара',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      fixed: 'left' as 'left',
      render: (text: any, record: any, indexRender: any) => {
        if (filteredCompareData[0].goods && indexRender < filteredCompareData[0].goods.length) {
          if (filteredCompareData[0].goods) {
            return record.name;
          }
        }
        if (filteredCompareData[0].goods === undefined) {
          return record.name;
        }
        if (filteredCompareData[0].goods && indexRender === filteredCompareData[0].goods.length) {
          return (
            <b>Итого</b>
          );
        }
        return (
          <div className={s.pdfTextBlock}>
            <div>Скачать предложение</div>
            <span>тех, кто загрузил счёт, как предложения</span>
          </div>
        );
      },
    },
    {
      title: 'Кол-во',
      key: 'quantity1',
      dataIndex: 'quantity',
      render: (text: any, record: any, indexRender: any) => {
        let sum = 0;
        filteredCompareData[0]?.goods?.forEach((item) => {
          sum += item.offersGoods.quantity;
        });
        if (filteredCompareData[0].goods && indexRender < filteredCompareData[0].goods.length) {
          return record.quantity;
        }
        if (!filteredCompareData[0].goods && indexRender < filteredCompareData.length) {
          return record.quantity;
        }
        if (filteredCompareData[0].goods && indexRender === filteredCompareData[0].goods.length) {
          return <b>{sum}</b>;
        }

        return null;
      },
    },
    {
      title: 'Лучшие предложения',
      children:
                [{
                  title: 'Цена',
                  key: 'name',
                  render: (text: any, record: any, indexRender: any) => (record.name !== 'Итого' ? (
                    <div>
                      {filteredCompareData.map((el: any, index: number) => {
                        const a: any = [];
                        filteredCompareData[index]?.goods?.map((x) => !a.includes(x) && a.push(x));

                        function contains(cd: any, it: any, org: string) {
                          for (let i = 0; i < cd.length; i += 1) {
                            if (cd[i].item.offersGoods.name === it
                              && cd[i].item.offer.organization === org) {
                              return true;
                            }
                          }
                          return false;
                        }

                        if (el.goods
                          && indexRender < el.goods?.length
                          && lowestPriceArr?.length > 0
                          && (
                            lowestPriceArr[indexRender][0]
                              === Number(el!.goods[indexRender]!.price)
                          )
                        ) {
                          const offersGoodsName = el.goods[indexRender]?.offersGoods.name;

                          const canAddProduct = (
                            !Array.isArray(testCartDataFromServer)
                              || !testCartDataFromServer[0]?.item
                              || !contains(testCartDataFromServer, offersGoodsName, el.organization)
                          );

                          return (
                            <div className={`${s.plusBtn_container}`}>
                              <span
                                className={cx({ [s.disabled]: !canAddProduct })}
                              >
                                {!isProvider && (
                                <PlusSquareOutlined
                                  onClick={() => addProductToCart(el.goods[indexRender], index)}
                                />
                                )}
                              </span>
                              <span
                                className={lowestPriceArr[indexRender][0] === Number(el.goods[indexRender].price) ? s.bold : ''}
                              >
                                {(Number(a[indexRender]?.price) * Number(a[indexRender]?.quantity
                                  ? a[indexRender]?.quantity
                                  : a[indexRender]?.offersGoods.quantity)).toFixed(2)}
                              </span>
                            </div>
                          );
                        }
                        if (el.goods && indexRender === el.goods.length) {
                          let sum = 0;
                          filteredCompareData[0].goods.forEach((_, newIndex) => {
                            sum += Number(a[newIndex]?.price)
                            * Number(a[newIndex]?.offersGoods.quantity);
                          });
                          return <b>{sum.toFixed()}</b>;
                        }

                        return null;
                      })}
                    </div>
                  ) : (
                    <div>
                      <span
                        className={s.bold}
                      >
                        {record.name === 'Итого' ? lowestPriceArr.reduce((acc: number, a: Array<number>, index: number) => {
                          let finalPrice = 0;
                          filteredCompareData[index]?.goods?.map((el, indexItem) => {
                            if (+el.price === lowestPriceArr[indexItem][0]) {
                              finalPrice += (lowestPriceArr[indexItem][0] * (el.quantity
                                ? el.quantity : el.offersGoods.quantity));
                            }

                            return null;
                          });

                          return acc + finalPrice;
                        }, 0) : ''}
                      </span>
                    </div>
                  )),
                },
                {
                  title: 'Фикс. Кол-во',
                  key: 'name',
                  render: (text: any, record: any, indexRender: any) => (record.name !== 'Итого' ? (
                    <div>
                      {filteredCompareData.map((el: any) => (
                        el.goods
                        && indexRender < el.goods.length
                        && lowestPriceArr.length > 0
                        && lowestPriceArr[indexRender][0] === Number(el!.goods[indexRender]!.price)
                          && (
                            <p className={s.best_price_p}>
                              {' '}
                              {el.goods[indexRender].quantity}
                              {' '}
                            </p>
                          )))}
                    </div>
                  ) : <div />),
                },
                {
                  title: 'Поставщик',
                  key: 'name',
                  render: (text: any, record: any, indexRender: any) => (record.name !== 'Итого' ? (
                    <div>
                      {filteredCompareData.map((el: any) => (el.goods && indexRender < el.goods.length && lowestPriceArr.length > 0 && lowestPriceArr[indexRender][0] === Number(el!.goods[indexRender]!.price) ? <p className={s.best_price_p}>{el.organization}</p> : ''))}
                    </div>
                  ) : <div />),
                },
                {
                  title: 'Комментарий',
                  key: 'name',
                  render: (text: any, record: any, indexRender: any) => (record.name !== 'Итого' ? (
                    <div>
                      {filteredCompareData.map((el: any) => {
                        const flag = el.goods
                        && indexRender < el.goods.length
                        && lowestPriceArr.length > 0
                        && lowestPriceArr[indexRender][0] === Number(el!.goods[indexRender]!.price);

                        if (flag) {
                          if (el.goods[indexRender].comment === null) {
                            return (
                              <p className={s.best_price_p}>—</p>
                            );
                          }
                          return (
                            <Tooltip
                              className="eye_tooltip"
                              color="white"
                              trigger="click"
                              placement="left"
                              title={(
                                <div className={s.tooltip}>
                                  <div className={s.tooltip_header}>
                                    Комментарий к
                                    :
                                    {record.name}
                                  </div>
                                  <div
                                    className={s.tooltip_value}
                                  >
                                    {el.goods[indexRender].comment}
                                  </div>
                                </div>
                                          )}
                            >
                              <EyeOutlined className={s.eye} />
                            </Tooltip>
                          );
                        }
                        return '';
                      })}
                    </div>
                  ) : <div />),
                },
                ],

    },
  ];

  const data: any = [];

  const dataSourceDeliveryTable = [
    {
      key: '1',
      name: 'Доставка',
    },
    {
      key: '2',
      name: 'Стоимость товара с доставкой',
    },
  ];

  const dataSourceDeliveryColumns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Способ доставки',
      children: filteredCompareData.map((item: any, index: number) => ({
        title: !isProvider ? item.organization : `Поставщик ${index + 1}`,
        key: 'name',
        render: (text: any, record: any, indexRender: any) => {
          if (indexRender === 0) {
            return (
              item?.deliveryType?.name || ''
            );
          }

          return null;
        },
      }
      )),
    },
    {
      title: 'Дата доставки',
      children: filteredCompareData.map((item, index) => ({
        title: !isProvider ? item.organization : `Поставщик ${index + 1}`,
        key: 'name',
        render: (text: any, record: any, indexRender: any) => {
          if (indexRender === 0) {
            return (
              item.deliveryDate
            );
          }

          return null;
        },
      }
      )),
    },
    {
      title: 'Стоимость доставки, руб',
      children: filteredCompareData[0]?.goods && filteredCompareData.map((item, index) => ({
        title: !isProvider ? item.organization : `Поставщик ${index + 1}`,
        key: 'name',

        render: (text: any, record: any, indexRender: any) => {
          const a: any = [];
          filteredCompareData[index]?.goods?.map((x) => {
            if (!a.includes(x)) {
              a.push(x);
            }

            for (let i = 0; i < filteredCompareData[0].goods.length; i += 1) {
              data.push({
                key: i,
                code: filteredCompareData[0].goods[i].offersGoods.code,
                quantity: filteredCompareData[0].goods[i].offersGoods.quantity,
                type: filteredCompareData[0].goods[i].offersGoods.type,
                name: filteredCompareData[0].goods[i].offersGoods.name,
                price: filteredCompareData[0].goods[i].price,
                comment: filteredCompareData[0].goods[i].comment,
              });
            }

            return null;
          });

          if (indexRender === 0) {
            return (
              item.deliveryPrice
            );
          }
          if (indexRender === 1) {
            let sumGeneral = 0;
            filteredCompareData[0]?.goods?.forEach((_, newIndex) => {
              sumGeneral += Number(a[newIndex]?.price)
              * Number(a[newIndex]?.offersGoods.quantity);
            });
            let sum = 0;
            sum += Number(item.deliveryPrice) + sumGeneral;
            return <b>{sum ? sum.toFixed() : '—'}</b>;
          }

          return null;
        },
      }
      )),
    },
  ];

  if (filteredCompareData.length !== 0 && filteredCompareData[0].goods) {
    for (let i = 0; i < filteredCompareData[0].goods.length; i += 1) {
      data.push({
        key: i,
        code: filteredCompareData[0].goods[i].offersGoods.code,
        quantity: filteredCompareData[0].goods[i].offersGoods.quantity,
        type: filteredCompareData[0].goods[i].offersGoods.type,
        name: filteredCompareData[0].goods[i].offersGoods.name,
        price: filteredCompareData[0].goods[i].price,
        comment: filteredCompareData[0].goods[i].comment,
      });
    }

    data.push({
      code: '',
      quantity: '',
      type: '',
      name: 'Итого',
      price: '',
      comment: '',
    });

    data.push({
      code: '',
      quantity: '',
      type: '',
      name: '',
      price: '',
      comment: '',
    });
  } else {
    for (let i = 0; i < filteredCompareData.length; i += 1) {
      data.push({
        key: i,
        code: filteredCompareData[i].code,
        quantity: filteredCompareData[i].quantity,
        type: '',
        name: filteredCompareData[i].name,
        price: '',
        comment: '',
      });
    }
  }

  const handleCompareTableChange = (
    _: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
  ) => {
    setCompareDataFilter((filters.code && filters.code[0]) as string);
  };

  const handleCompareTableToggle = () => {
    setIsMoreColumnsVisible(!isMoreColumnsVisible);
    setCompareDataFilter(null);
  };

  if (!isOrderValid) {
    return (
      <OrderNotFound />
    );
  }

  return (
    <>
      {!isMobile ? <Header /> : <HeaderSlider />}
      <div className={s.page}>
        {items && cartData && isCartModalOpened && (
        <CartModal
          isCloseOrderBtnVisible={isCloseOrderBtnVisible}
          setIsCloseOrderBtnVisible={setIsCloseOrderBtnVisible}
          setResponseFromServer={setResponseFromServer}
          testCartDataFromServer={testCartDataFromServer}
          isModal={isCartModalOpened}
          setIsModal={setIsCartModalOpened}
        />
        )}
        <div className={s.subtitle}>Сравнение предложений</div>
        <div className={isMoreColumnsVisible ? s.table_title : s.table_title_collapsed}>
          <div>Предложения</div>
        </div>
        <div className="compare-table-container">
          {!isProvider && (
          <div className={s.cart}>
            <Button onClick={() => setIsCartModalOpened(true)} type="primary">Перейти в корзину</Button>
            {isCloseOrderBtnVisible && !isOrderClosed && (
            <div>
              <Popconfirm
                placement="topLeft"
                title="Вы уверены что хотите закрыть заявку?"
                onConfirm={closeOrder}
                okText="Да"
                cancelText="Нет"
              >
                <Button type="primary" danger>Закрыть заявку</Button>
              </Popconfirm>
            </div>
            )}

          </div>
          )}
          <div className={s.tableWithLeftArrowContainer}>
            <div
              onClick={handleCompareTableToggle}
              className={s.left_scroll_btn}
            >
              <span
                className={s.revert_scroll_btn_span}
              >
                {allProductCount > 3 ? 'Ваша заявка' : null}

              </span>
              <RightOutlined
                className={isMoreColumnsVisible ? `${s.left_scroll_btn_arrow} ${s.rotated_arrow}` : s.left_scroll_btn_arrow}
              />
            </div>
            <Table
              loading={tableLoading}
              dataSource={data}
              pagination={false}
              columns={isMoreColumnsVisible ? fullColumns : collapsedColumns}
              size="small"
              bordered
              onChange={handleCompareTableChange}
            />
          </div>
          <Table
            dataSource={dataSourceDeliveryTable}
            columns={dataSourceDeliveryColumns}
            pagination={false}
          />
          <div className={s.contactTableContainer}>
            <table className={s.contactTable}>
              <tr>
                <th className="table-label">Контактные данные</th>
                {filteredCompareData[0]?.goods && filteredCompareData.map((_, index: number) => (
                  <td>
                    {`Предложение ${index + 1}`}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Организация</td>
                {filteredCompareData.map((item: CompareData, index: number) => (
                  <td>
                    {!isProvider ? item.organization : `Поставщик ${index + 1}`}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Имя</td>
                {filteredCompareData.map((item) => (
                  <td>
                    {item.goods ? item.name : ''}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Телефон</td>
                {filteredCompareData.map((item) => (
                  <td>
                    {item.phone}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Электронная почта</td>
                {filteredCompareData.map((item) => (
                  <td>
                    <a href={`mailto:${item?.offerUser?.email}`}>{item?.offerUser?.email}</a>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Сайт</td>
                {filteredCompareData.map((item: any) => {
                  const url = item?.offerUser?.website || '';
                  return (
                    <td>
                      {url?.includes('https://' || 'http://')
                        ? (
                          <a
                            target="_blank"
                            href={url}
                            rel="noreferrer"
                          >
                            {item?.offerUser?.website}
                          </a>
                        )
                        : (
                          <a
                            target="_blank"
                            href={`https://${url}`}
                            rel="noreferrer"
                          >
                            {item?.offerUser?.website}
                          </a>
                        )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>Комментарий</td>
                {filteredCompareData.map((item) => (
                  <td>
                    <textarea className={s.textAreaComment} readOnly>
                      {item?.deliveryComment}
                    </textarea>
                  </td>
                ))}
              </tr>
            </table>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CompareProposal;
