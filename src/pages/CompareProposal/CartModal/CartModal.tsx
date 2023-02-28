import React, { useEffect, useRef, useState } from 'react';

import { message, Table } from 'antd';
import Column from 'antd/es/table/Column';
import { DebounceInput } from 'react-debounce-input';
import useDebounce from 'src/hooks/useDebounce';
import { EditOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AxiosResponse } from 'axios';
import { LoadingButton } from 'src/components/shared-components/Loading';
import { usersApi } from '../../../api/api';
import getCookie from '../../../helpers/getCookie';
import useActions from '../../../hooks/useActions';
import binImg from '../../../assets/img/bin.svg';
import cartImg from '../../../assets/img/cart.svg';
import crossImg from '../../../assets/img/cross.svg';

import s from './CartModal.module.css';
import './CartModal.css';

interface CartModalProps {
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  testCartDataFromServer: any;
  setResponseFromServer: React.Dispatch<React.SetStateAction<string>>;
  setIsCloseOrderBtnVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isCloseOrderBtnVisible: any;
}

interface CartItem {
  fixedQuantity: boolean;
  id: number;
  item: ICartData;
  quantity: number;
}

interface ICartData {
  comment: string | null;
  offersGoods: {
    id: number;
    code: string;
    name: string;
    quantity: string | number;
    price: string | number;
  };
  organization?: string;
  total?: number;
  price: string;
}

const CartModal: React.FC<CartModalProps> = ({
  isCloseOrderBtnVisible,
  setIsCloseOrderBtnVisible,
  isModal,
  setIsModal,
  testCartDataFromServer,
  setResponseFromServer,
}) => {
  const { showErr } = useActions();
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
  const [editedCartItem, setEditedCartItem] = useState<string | number | null>(null);
  const [nameGoodsOrder, setNameGoodsOrder] = useState<any>({ cartItem: {}, name: '' });
  const [isPropostalSending, setIsPropostalSending] = useState(false);
  const inputRef = useRef<any>(null);
  useEffect(() => {
    inputRef.current?.focus({
      cursor: 'start',
    });
  }, []);

  const id = window.location.href.split('/')[window.location.href.split('/').length - 1];

  useEffect(() => {
    if (Array.isArray(testCartDataFromServer) && testCartDataFromServer[0]?.item) {
      let ss = 0;
      if (testCartDataFromServer.length > 0) {
        for (let i = 0; i < testCartDataFromServer.length; i += 1) {
          ss += Number(testCartDataFromServer[i].item.price) * testCartDataFromServer[i].quantity;
          setTotalCartPrice(ss);
        }
      } else setTotalCartPrice(0);
    }

    if (Array.isArray(testCartDataFromServer)
    && testCartDataFromServer.length === 0) setTotalCartPrice(0);

    const newCartData = Array.isArray(testCartDataFromServer) && testCartDataFromServer[0]?.item
      ? testCartDataFromServer
      : [];

    setCartItems(newCartData);
  }, [testCartDataFromServer]);

  const deleteItemFromCartServer = async (cartItem: any) => {
    const token: string | undefined | null = await getCookie('Authentication');

    usersApi.deleteItemFromCart(
      token,
      id,

      cartItem?.item?.offersGoods?.id,

      cartItem.id,
    ).then((r: any) => {
      setResponseFromServer(`${r} ${Math.random()}`);
      message.error('Позиция удалена из корзины!');
    });
  };

  const deleteItemFromCart = (cartItem: ICartData) => {
    deleteItemFromCartServer(cartItem);
  };

  const sendProposals = async () => {
    setIsPropostalSending(true);
    const token: string | undefined | null = await getCookie('Authentication');

    usersApi.sendCompareOffer(token, id, testCartDataFromServer).then((res: any) => {
      setIsPropostalSending(false);
      if (res.data.result) {
        setIsCloseOrderBtnVisible(false);
        showErr('Заявки отправлены!');
      } else showErr('Ошибка, корзина уже была отправлена поставщикам!');
    });
  };

  const changeCartItemQuantity = async (cartItem: any, indexRender: number, e: any) => {
    const token: string | null | undefined = getCookie('Authentication');
    const { value } = e.target;
    const goods = [
      {

        productId: cartItem.item.offersGoods.id,

        userId: cartItem.item.offer.offerUser.id,
        quantity: Number(value),

        fixedQuantity: cartItem.fixedQuantity,

        id: cartItem.id,
      },
    ];

    if (Number(value) > 0) {
      await usersApi.deleteItemFromCart(
        token,
        id,

        cartItem.item.offersGoods.id,

        cartItem.id,
      ).then((r) => setResponseFromServer({
        ...r.data,
        id: cartItem.id,
        index: indexRender,
      }));

      await usersApi.addProductToCartPatch(token, id, goods).then((r) => {
        setResponseFromServer({
          ...r.data,
          id: cartItem.id,
          index: indexRender,
        });
      });
    }
  };
  const debounceChangeName = useDebounce(nameGoodsOrder.name, 500);

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');

    const goods = [
      {

        productId: nameGoodsOrder?.cartItem?.item?.offersGoods.id,

        userId: nameGoodsOrder?.cartItem?.item?.offer.offerUser.id,

        goods: { ...nameGoodsOrder?.cartItem?.item?.offersGoods, name: nameGoodsOrder.name },
      },
    ];
    if (debounceChangeName) {
      usersApi.updateOrdersGoods(token, id, goods[0])
        .then((r: AxiosResponse) => {
          setResponseFromServer({
            ...r.data,
            id: nameGoodsOrder.cartItem.id,
            index: nameGoodsOrder.indexRender,
          });
        });
    }
  }, [debounceChangeName]);

  const changeNameOrderGoods = (cartItem: CartItem, e: any, indexRender: number) => {
    setNameGoodsOrder({ cartItem, name: e, indexRender });
    setCartItems((prev: any) => prev.map((elem: any) => {
      if (editedCartItem === elem.item?.offersGoods?.id) {
        return {
          ...elem,
          item: {
            ...elem.item,
            offersGoods: {
              ...elem.item.offersGoods,
              name: e,
            },
          },
        };
      }
      return elem;
    }));
  };
  return (
    <>
      <div className={`${s.fade} ${isModal && s.active}`} onClick={() => setIsModal(false)} />
      <div className={`${s.cart} ${isModal && s.active}`}>
        <div className={s.inner}>
          <div className={s.top}>
            <div className={s.header}>
              <div className={s.left}>
                <div className={s.cart_img}>
                  <img src={cartImg} alt="cartImg" />
                </div>
                <div className={s.title}>Выбранные предложения</div>
              </div>
              <div className={s.cross} onClick={() => setIsModal(false)}>
                <img src={crossImg} alt="crossImg" />
              </div>
            </div>
            <div className={s.table}>
              <Table
                pagination={false}
                className="cart_table"
                size="small"
                dataSource={cartItems}
                scroll={{ x: 900 }}
                bordered
              >
                <Column
                  align="center"
                  width={234}
                  title="Поставщик"
                  dataIndex="email"
                  key="email"
                  fixed="left"
                  render={(_: any, cartItem: any) => <div>{cartItem.item.offer.organization}</div>}
                  sorter={(a, b) => {
                    if (a.item.offer.organization > b.item.offer.organization) {
                      return 1;
                    } if (a.item.offer.organization < b.item.offer.organization) {
                      return -1;
                    }
                    return 0;
                  }}
                  defaultSortOrder="ascend"
                />
                <Column
                  align="center"
                  width={264}
                  title="Наименование товара"
                  dataIndex="name"
                  key="name"
                  fixed="left"
                  render={(_: string, cartItem: CartItem, indexRender: number) => (
                    <div className={s.nameTextareaBlock}>
                      {editedCartItem === cartItem?.item?.offersGoods?.id
                        ? (
                          <TextArea
                            className={s.nameTextarea}
                            autoSize={{ minRows: 1, maxRows: 6 }}
                            bordered={false}
                            ref={inputRef && inputRef}
                            value={cartItem.item.offersGoods.name}
                            onChange={({ target }) => {
                              changeNameOrderGoods(cartItem, target.value, indexRender);
                            }}
                          />
                        )
                        : (
                          <div className={s.nameTextarea}>
                            {cartItem.item?.offersGoods?.name}
                          </div>
                        )}
                      <EditOutlined onClick={() => {
                        setEditedCartItem((prev) => (prev
                          ? null : cartItem?.item?.offersGoods?.id || null));
                      }}
                      />
                    </div>
                  )}
                />
                <Column
                  align="center"
                  width={109}
                  title="Количество"
                  dataIndex="amount"
                  key="amount"
                  render={(nothing: any, cartItem: any, indexRender: number) => (
                    <DebounceInput
                      step={1}
                      type="number"
                      min={1}
                      disabled={cartItem.fixedQuantity}
                      onKeyDown={(e: any) => {
                        if (e.key === '.' || e.key === '-' || e.key === ',' || e.key === '/' || e.key === ('+' || '-' || '=')) {
                          e.preventDefault();
                        }
                      }}
                      debounceTimeout={500}
                      onChange={(e: any) => changeCartItemQuantity(cartItem, indexRender, e)}
                      value={cartItem.quantity === null
                        ? cartItem.item.offersGoods.quantity : cartItem.quantity}
                      className={`${s.centred} ${s.w100}`}
                    />
                  )}
                />
                <Column
                  align="center"
                  width={127}
                  title="Цена за товар"
                  dataIndex="price"
                  key="price"
                  render={(nothing: any, cartItem: any) => <div>{cartItem.item.price}</div>}
                />
                <Column
                  align="center"
                  width={105}
                  title="Цена итого"
                  dataIndex="total"
                  key="total"
                  render={(_: any, cartItem: any) => (
                    <div>
                      {(Number(cartItem.item.price) * cartItem.quantity).toFixed(2)}
                    </div>
                  )}
                />
                <Column
                  align="center"
                  className={`${s.clear_bin} cart_column`}
                  width={57}
                  title=""
                  dataIndex="clear"
                  key="clear"
                  render={(nothing: any, cartItem: any) => (
                    <img
                      onClick={() => deleteItemFromCart(cartItem)}
                      alt="очистить поле"
                      src={binImg}
                    />
                  )}
                />
                ))

              </Table>
              <div className={s.total_price}>
                <span>
                  Итого товаров :
                  {Array.isArray(testCartDataFromServer) ? testCartDataFromServer.length : 0}
                  {' '}
                  на сумму
                  {totalCartPrice.toFixed(2)}
                  {' '}
                  ₽
                </span>
              </div>
            </div>
          </div>
          <div className={s.footer}>
            {isCloseOrderBtnVisible && (
              <>
                <div className={s.info}>
                  *после клика на кнопку справа мы разошлем на почты поставщиков
                  письма с выбранными товарами.
                </div>
                <div onClick={() => sendProposals()} className={s.button}>
                  Отправить заявки
                  {isPropostalSending && <button type="button"><LoadingButton /></button>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;
