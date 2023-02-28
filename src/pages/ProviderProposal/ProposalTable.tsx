import { Tooltip, Popconfirm } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import Input from 'antd/lib/input';
import React, {
  LegacyRef,
  useCallback, useEffect, useRef, useState,
} from 'react';
import CurrencyInput from 'react-currency-input-field';
import { IGoods, PreviousOfferData } from './ProviderProposalsTypes';
import s from './ProviderProposal.module.css';

interface ProposalTableProps {
  prevOfferData: PreviousOfferData,
  setIsCommentModalVisible: React.Dispatch<React.SetStateAction<any>>,
  isCommentModalVisible: boolean,
  setCommentProductName: React.Dispatch<React.SetStateAction<any>>,
  setIsEditCommentVisible: React.Dispatch<React.SetStateAction<any>>,
  isEditCommentModalVisible: boolean,
  goods: IGoods[],
  setCommentText: React.Dispatch<React.SetStateAction<any>>,
  editCommentText: string,
  offersCount: number,
  commentProductName: string,
  commentText: string,
  setEditCommentText: React.Dispatch<React.SetStateAction<any>>,
  editedGoods: IGoods[],
  setEditedGoods: React.Dispatch<React.SetStateAction<any>>
  isQuantityEdited: boolean[] | [],
  setIsQuantityEdited: React.Dispatch<React.SetStateAction<any>>,
}

const ProposalTable: React.FC<ProposalTableProps> = ({
  prevOfferData,
  setIsCommentModalVisible,
  isCommentModalVisible,
  setCommentProductName,
  setIsEditCommentVisible,
  isEditCommentModalVisible,
  goods,
  setCommentText,
  editCommentText,
  offersCount,
  commentProductName,
  commentText,
  setEditCommentText,
  editedGoods,
  setEditedGoods,
  isQuantityEdited,
  setIsQuantityEdited,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [commentProductId, setCommentProductId] = useState(0);
  const ref = useRef<HTMLTableSectionElement | null>();
  const [activeElementId, setActiveElementId] = useState<number>(0);
  const [inputs] = useState<Array<ChildNode | null>>([]);

  const commentProductNameHandler = useCallback((product: any) => {
    setIsCommentModalVisible(!isCommentModalVisible);
    setCommentProductName(product.name);
    setCommentProductId(product.id);
  }, [isCommentModalVisible, setCommentProductName, setIsCommentModalVisible]);

  const editCommentTextHandler = useCallback((name: string) => {
    setIsEditCommentVisible(!isEditCommentModalVisible);
    setCommentProductName(name);
  }, [setCommentProductName, isEditCommentModalVisible, setIsEditCommentVisible]);

  const commentTextHandler = useCallback((product: IGoods) => {
    const updatedState = editedGoods.map((item) => {
      if (item.id === product.id && commentText.length > 0) {
        return { ...item, comment: commentText };
      }
      return item;
    });
    setEditedGoods(updatedState);
    setIsCommentModalVisible(false);
  }, [editedGoods, setEditedGoods, commentText, setIsCommentModalVisible]);

  const editCommentHandler = useCallback((product: IGoods) => {
    const updatedState = editedGoods.map((item) => {
      if (item.id === product.id) {
        return { ...item, comment: editCommentText };
      }
      return item;
    });
    setEditedGoods(updatedState);
    setCommentText(editCommentText);
    setIsEditCommentVisible(false);
  }, [editCommentText, editedGoods, setEditedGoods, setCommentText, setIsEditCommentVisible]);

  const goodsHandler = useCallback((e: any, product: IGoods) => {
    e.preventDefault();

    const updatedState = editedGoods.map((item) => {
      if (item.id === product.id) {
        return { ...item, [e.target.name]: Number(e.target.value) };
      }
      return item;
    });
    setEditedGoods(updatedState);
  }, [editedGoods, setEditedGoods]);

  const setQuantityDefaultData = (index: number) => {
    setIsQuantityEdited((prev: boolean[] | []) => {
      const newEdited = [...prev];
      newEdited[index] = false;
      return newEdited;
    });
    setEditedGoods((prev: IGoods[]) => {
      const newEditedGoods = [...prev];
      newEditedGoods[index].quantity = goods[index].quantity;
      return newEditedGoods;
    });
  };

  useEffect(() => {
    let ss = 0;
    for (let i = 0; i < editedGoods.length; i += 1) {
      ss += editedGoods[i].price * editedGoods[i].quantity;

      setTotalPrice(Number(ss.toFixed(2)));
    }

    if (editedGoods.length > 0) {
      for (let i = 2; i < editedGoods.length + 2; i += 1) {
        if (ref.current && ref.current.children[i]?.children[4]?.firstChild) {
          inputs.push(ref.current.children[i].children[4].firstChild);
        }
      }
    }
  }, [editedGoods]);

  const handleUserKeyPress = (event: any) => {
    const { key, target } = event;

    if (key === 'Enter' && target.name === 'product-price' && activeElementId < editedGoods.length - 1) {
      event.preventDefault();
      setActiveElementId(activeElementId + 1);
    } else if (key === 'Enter') {
      event.preventDefault();
    }

    if (activeElementId < goods.length - 1 && key === 'ArrowDown') {
      setActiveElementId(activeElementId + 1);
    }
    if (activeElementId > 0 && key === 'ArrowUp') {
      setActiveElementId(activeElementId - 1);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleUserKeyPress);
    return () => document.removeEventListener('keydown', handleUserKeyPress);
  }, [handleUserKeyPress]);

  useEffect(() => {
    inputs.map((item: any) => Number(item.id) === activeElementId && item.focus());
    inputs.map((item: any) => item.addEventListener('focus', () => setActiveElementId(Number(item.id))), { once: true });
  }, [activeElementId]);

  return (
    <>
      <div className={s.overall_table}>
        <table className={s.proposal_table}>

          <tbody ref={ref as LegacyRef<HTMLTableSectionElement> | undefined}>
            <tr className={s.proposal_table_header}>
              <td className={s.border_rgt_2px} colSpan={4}>Заявка клиента</td>
              <td colSpan={2}>Ваше предложение</td>
            </tr>

            <tr className={s.proposal_table_categories}>
              <td className={s.proposal_table_name}>Наименование</td>
              <td className={s.proposal_table_shtrih}>Штрихкод</td>
              <td className={s.proposal_table_type}>Ед.</td>
              <td className={`${s.proposal_table_amount} ${s.border_rgt_2px}`}>Кол-во</td>
              <td className={s.proposal_table_price}>Цена за ед.</td>
              <td className={s.proposal_table_comment}>Комментарий</td>
            </tr>

            {editedGoods !== null && editedGoods.map((product: IGoods, index) => (
              <>

                <tr key={`${product} + '_' + ${product.id}`} className={s.proposal_table_products}>
                  <td>{product.name}</td>
                  <td>{product.code}</td>
                  <td>{product.type.name}</td>
                  <td className={`${s.border_rgt_2px}`}>
                    {isQuantityEdited[index]
                      ? (
                        <div className={s.input_edited_close_block}>
                          <Popconfirm
                            title="Отменить фиксированное значение?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => setQuantityDefaultData(index)}
                          >
                            <span className={s.input_edited_close}>X</span>
                          </Popconfirm>
                          <Tooltip title={!product.quantity ? 'Недопустимое количество! Заказчик не получит предложение на данный товар.' : ''}>
                            <CurrencyInput
                              id={String(Number(index) / 3)}
                              allowNegativeValue={false}
                              disableGroupSeparators
                              decimalSeparator="."
                              disabled={prevOfferData.offersCount === 3}
                              defaultValue={product.quantity}
                              name="quantity"
                              type="text"
                              maxLength={9}
                              className={!product.quantity ? s.input_with_warning : s.input_edited}
                              onBlur={(e) => goodsHandler(e, product)}
                            />
                          </Tooltip>
                        </div>
                      )
                      : (
                        <Popconfirm
                          title="Задать фиксированное количество? (Заказчик не сможет его изменить)"
                          okText="Да"
                          cancelText="Нет"
                          onConfirm={() => setIsQuantityEdited((prev: boolean[] | []) => {
                            const newEdited = [...prev];
                            newEdited[index] = true;
                            return newEdited;
                          })}
                        >
                          <span className={s.quantity_span}>{product.quantity}</span>
                        </Popconfirm>
                      )}
                  </td>
                  <td>
                    <CurrencyInput
                      id={String(Number(index))}
                      allowNegativeValue={false}
                      disableGroupSeparators
                      decimalSeparator="."
                      disabled={prevOfferData.offersCount === 3}
                      defaultValue={product.price !== 0 ? product.price : ''}
                      name="price"
                      type="text"
                      maxLength={9}
                      className={s.input_price}
                      onBlur={(e) => goodsHandler(e, product)}
                    />
                  </td>
                  {product.comment && product.comment.length > 0
                    ? (
                      <td>
                        <div style={{
                          width: '25%',
                          display: 'flex',
                          fontSize: '18px',
                          margin: '0 auto',
                          justifyContent: 'space-between',
                        }}
                        >
                          <Tooltip
                            color="white"
                            trigger="click"
                            placement="left"
                            title={(
                              <div className={s.tooltip}>
                                <div className={s.tooltip_header}>
                                  Комментарий к
                                  :
                                  {product.name}
                                </div>
                                <div
                                  className={s.tooltip_value}
                                  style={{ color: 'black' }}
                                >
                                  {product.comment}
                                </div>
                              </div>
                            )}
                          >
                            <EyeOutlined />
                          </Tooltip>
                          <div onClick={() => editCommentTextHandler(product.name)}>
                            <EditOutlined />
                          </div>
                        </div>
                      </td>
                    )
                    : (
                      <td
                        onClick={() => commentProductNameHandler(product)}
                        className={s.table_product_comment}
                      >
                        Добавить комментарий
                      </td>
                    )}
                </tr>
                {isCommentModalVisible && commentProductId === product.id
                  ? (
                    <div className={s.write_comment_block_container}>
                      <div className={s.write_comment_block}>
                        <span>
                          Добавить комментарий к
                          <b>{product.name}</b>
                        </span>
                        <Input.TextArea
                          disabled={offersCount === 3}
                          onChange={(e) => setCommentText(e.target.value)}
                          maxLength={1024}
                        />
                        <div className={s.write_comment_block_btns}>
                          <button
                            type="button"
                            onClick={() => commentTextHandler(product)}
                            className={s.btn}
                          >
                            Оставить комментарий
                          </button>
                          <button
                            onClick={() => setIsCommentModalVisible(false)}
                            className={s.btn}
                            type="submit"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : ''}

                {isEditCommentModalVisible && commentProductId === product.id
                  ? (
                    <div className={s.write_comment_block_container}>
                      <div className={s.write_comment_block}>
                        <span>
                          Добавить комментарий к
                          <b>{commentProductName}</b>
                        </span>
                        <Input.TextArea
                          disabled={offersCount === 3}
                          defaultValue={commentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          maxLength={1024}
                        />
                        <div className={s.write_comment_block_btns}>
                          <button
                            onClick={() => editCommentHandler(product)}
                            className={s.btn}
                            type="submit"
                          >
                            Оставить комментарий
                          </button>
                          <button
                            onClick={() => setIsEditCommentVisible(false)}
                            className={s.btn}
                            type="submit"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : ''}
              </>
            ))}
          </tbody>

        </table>
      </div>
      <div className={s.summary_block_container}>
        <div className={s.summary_block}>
          <div>Итого:</div>
          <div>
            {totalPrice}
            {' '}
            рублей
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalTable;
