import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import routes from 'src/routes';
import s from './SuccessOrder.module.css';
import useTypedSelector from '../../../../hooks/useTypedSelector';

function SuccessOrder() {
  const { isProvider } = useTypedSelector((state) => state.userProfile);
  const responseInfo = useTypedSelector((state) => state.responseResult);
  const dispatch = useDispatch();

  const history = useHistory();

  const dispatchResponseInfo = () => {
    dispatch({
      type: 'GET_RESULT',
      payload: {
        ...responseInfo, result: false,
      },
    });
  };

  const ResponseSuccessRedirect = () => {
    setTimeout(() => {
      window.location.href = routes.personal;
    }, 4000);
  };

  useEffect(() => {
    if (responseInfo.result) {
      setTimeout(() => {
        dispatch({
          type: 'GET_RESULT',
          payload: {
            ...responseInfo, result: false,
          },
        });
      }, 10000);

      setTimeout(dispatchResponseInfo, 5000);

      ResponseSuccessRedirect();
    }
  }, []);

  useEffect(() => history.listen(() => {
    dispatch({
      type: 'GET_RESULT',
      payload: {
        ...responseInfo, result: false,
      },
    });
  }), [history]);

  return (
    <div className={s.success_order_container}>
      <div className={s.success_order}>
        <div className={s.success_order_title}>
          {responseInfo.msg}
        </div>
        <div className={s.success_order_info}>
          {!isProvider
            ? <div>Мы получили вашу заявку на приобретение товара</div>
            : <div>Мы получили ваше предложение</div>}
          <div style={{
            fontSize: '1.5em',
            fontWeight: 600,
            color: '#000',
          }}
          >
            {!(isProvider && !responseInfo.orderId) && !isProvider && `Номер вашей заявки: ${responseInfo.orderId}`}
            {!(isProvider && !responseInfo.orderId) && isProvider && `Номер вашего предложения: ${responseInfo.orderId}`}
          </div>
          <div style={{ color: '#000', fontWeight: 600 }}>Как мы можем Вам помочь?</div>
          <div style={{ lineHeight: '1.5em' }}>
            Если у вас есть какие-либо вопросы, позвоните по телефону
            {' '}
            <a href="tel:">
              7 (962)
              684-85-47
            </a>
            {' '}
            или напишите на почту 9351829@mail.ru
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessOrder;
