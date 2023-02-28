import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Pagination, Tabs, Select,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import routes from 'src/routes';
import ProposalLoader from './ProposalLoader';
import s from './Personal.module.css';
import useTypedSelector from '../../hooks/useTypedSelector';
import getCookie from '../../helpers/getCookie';
import PersonalHeader from './PersonalHeader';
import { usersApi } from '../../api/api';

const { Option } = Select;

const { TabPane } = Tabs;

interface ProposalDataObj {
  id?: number;
  organization: string;
  name: string;
  email: string;
  contactWay: string;
  providerType: string;
  regionDelivery: string;
  address: string;
  comment: string;
  products: IProduct[];
  offersCount: number;
  goodsCount: number;
  date: string;
  offers: [],
}

interface IProduct {
  id?: number;
  name: string;
  amount: string;
  type: string;
}

function Personal() {
  const [proposalsData, setProposalsData] = useState<ProposalDataObj[]>([]);
  const [isActiveProposalsTypeSelected, setIsActiveProposalsTypeSelected] = useState(true);
  const [paginatorPage, setPaginatorPage] = useState(1);
  const [archivePage, setArchivePage] = useState(1);
  const [totalProposals, setTotalProposals] = useState<number | null>(null);
  const [ResponseStatus, setResponseStatus] = useState(0);
  const { isProvider } = useTypedSelector((state) => state.userProfile);
  const { isRefresh } = useTypedSelector((state) => state.refresh);
  const [total, setTotal] = useState(0);

  const [providerType, setProviderType] = useState('Все');

  const dispatch = useDispatch();

  useEffect(() => {
    let ss = 0;
    for (let i = 0; i < proposalsData.length; i += 1) {
      if (!isProvider && proposalsData) {
        if (proposalsData[i].offersCount === 0) {
          ss += 1;
          setTotal(ss);
        }
      } else {
        const { offers } = proposalsData[i];

        if (!offers || offers.length === 0) {
          ss += 1;
          setTotal(ss);
        }
      }
    }
  }, [proposalsData]);

  useEffect(() => {
    const token: string | null | undefined = getCookie('Authentication');

    usersApi.getProposals(
      token,
      isActiveProposalsTypeSelected,
      paginatorPage,
      archivePage,
      providerType,
    ).then((r) => {
      setProposalsData(r.data.items);
      setTotalProposals(r.data.meta.totalItems);
      setResponseStatus(r.status);
    });
  }, [isActiveProposalsTypeSelected, paginatorPage, archivePage, providerType, isRefresh]);

  function callback(key: any) {
    if (key === '1') {
      setIsActiveProposalsTypeSelected(true);
    } else {
      setIsActiveProposalsTypeSelected(false);
    }
  }

  const dispatchTemplateData = (itemId: any) => {
    dispatch({
      type: 'SET_TEMPLATE_ORDER_DATA',
      payload: {
        templateOrderId: itemId,
        isTemplateOrderAvailable: true,
      },
    });
  };

  return (
    <div className={s.personal}>
      <PersonalHeader />
      <div style={{ paddingTop: '12px' }}>
        <div style={{ paddingBottom: '12px' }}>Тип заявки</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={s.provider_selector}>
            <Select
              defaultValue="Все"
              style={{ width: 181, height: 40 }}
              onChange={(value: any) => {
                setPaginatorPage(1);
                setArchivePage(1);
                setProviderType(value);
              }}
            >
              <Option value="Все">Все</Option>
              <Option value="Оборудование">Оборудование</Option>
              <Option value="Материалы">Материалы</Option>
              <Option value="Инструменты">Инструменты</Option>
              <Option value="Хоз. товары">Хоз. товары</Option>
              <Option value="Ортодонтия">Ортодонтия</Option>
              <Option value="Имплантология">Имплантология</Option>
            </Select>
          </div>
          {isProvider && (
            <div className={s.settingsContainer}>
              <Link to={routes.settings}>
                <Button type="default" icon={<SettingOutlined />} size="large">Настройки</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        onChange={callback}
      >
        {isProvider !== null && !isProvider && (
          <>
            <TabPane className={s.staticTabPane} tab="Активные заявки" key="1" />
            <TabPane style={{ position: 'initial' }} tab="Архив" key="2" />
          </>
        )}
        {isProvider !== null && isProvider && (
          <>
            <TabPane className={s.initialTabPane} tab="Доступные заявки" key="1" />
            <TabPane style={{ position: 'initial' }} tab="Архив" key="2" />
          </>
        )}
      </Tabs>
      <div className={s.ordersList}>
        {ResponseStatus === 200 && (
          <>
            {proposalsData && proposalsData.length > 0 && (
              proposalsData.map((item) => {
                const date = item.date.split('-').reverse().join('.');

                return (
                  <div style={{ display: 'flex' }}>
                    <div key={`${item.id} + personal`} className={s.orderOption}>
                      <Link to={!isProvider || !isActiveProposalsTypeSelected ? `order/compare/${item.id}` : `order/${item.id}`}>
                        <span className={s.orderOptionText}>
                          Заказ №
                          {' '}
                          {item.id}
                          {' '}
                          от
                          {date}
                          .

                          Товаров в заказе:
                          {' '}
                          {item.goodsCount}
                        </span>
                      </Link>
                      <div className={s.orderStatus}>
                        {isProvider && item.offers && item.offers.length > 0 && (
                          <span className={s.orderOptionText}>Предложение сделано</span>
                        )}
                        {isProvider && item.offers && item.offers.length === 0 && (
                          <span className={s.orderOptionText}>Ожидает предложения</span>
                        )}
                        {isProvider && !isActiveProposalsTypeSelected && (
                          <span className={s.orderOptionText}>
                            Заявка в архиве. Предложений:
                            {item.offersCount}
                          </span>
                        )}
                        {!isProvider && (
                          <span
                            className={s.orderOptionText}
                          >
                            {`Поступило предложений: ${item.offersCount > 0 ? item.offersCount : 0}`}
                          </span>
                        )}
                      </div>
                    </div>
                    {!isProvider && (
                    <Link to={`new-template/${item.id}`}>
                      <Button
                        className={s.repeat_btn}
                        onClick={() => dispatchTemplateData(item.id)}
                      >
                        Повторить
                        заявку
                      </Button>
                    </Link>
                    )}
                  </div>
                );
              })
            )}
            {!(proposalsData && proposalsData.length > 0) && (
              <div className={`${s.alert} ${s.alertPrimary}`}>
                {isActiveProposalsTypeSelected ? 'Нет созданных заявок!' : 'Нет архивных заявок!'}
              </div>
            )}
          </>
        )}
        {ResponseStatus !== 200 && (
          Array(10).fill(<ProposalLoader />)
        )}
      </div>

      {proposalsData.length > 0 && isActiveProposalsTypeSelected && isProvider && (
        <div className={s.counter}>
          Неотвеченных заявок на странице:
            {total}
        </div>
      )}
      {proposalsData.length > 0 && isActiveProposalsTypeSelected && !isProvider && (
        <div className={s.counter}>
          Заявок без предложений на странице:
            {total}
        </div>
      )}

      {totalProposals != null
        && isActiveProposalsTypeSelected
        && (providerType === 'Все' || providerType === 'Материалы'
          || providerType === 'Оборудование' || providerType === 'Инструменты'
          || providerType === 'Хоз. товары' || providerType === 'Ортодонтия' || providerType === 'Имплантология')
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={paginatorPage}
            hideOnSinglePage
            onChange={(value) => setPaginatorPage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
      {totalProposals != null
        && !isActiveProposalsTypeSelected
        && providerType === 'Все'
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={archivePage}
            hideOnSinglePage
            onChange={(value) => setArchivePage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
      {totalProposals != null
        && !isActiveProposalsTypeSelected
        && providerType === 'Материалы'
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={archivePage}
            hideOnSinglePage
            onChange={(value) => setArchivePage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
      {totalProposals != null
        && !isActiveProposalsTypeSelected
        && providerType === 'Оборудование'
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={archivePage}
            hideOnSinglePage
            onChange={(value) => setArchivePage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
      {totalProposals != null
        && !isActiveProposalsTypeSelected
        && providerType === 'Инструменты'
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={archivePage}
            hideOnSinglePage
            onChange={(value) => setArchivePage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
      {totalProposals != null
        && !isActiveProposalsTypeSelected
        && providerType === 'Хоз. товары'
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={archivePage}
            hideOnSinglePage
            onChange={(value) => setArchivePage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
      {totalProposals != null
        && !isActiveProposalsTypeSelected
        && providerType === 'Ортодонтия'
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={archivePage}
            hideOnSinglePage
            onChange={(value) => setArchivePage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
      {totalProposals != null
        && !isActiveProposalsTypeSelected
        && providerType === 'Имплантология'
        && (
          <Pagination
            showSizeChanger={false}
            pageSizeOptions={['10']}
            defaultCurrent={archivePage}
            hideOnSinglePage
            onChange={(value) => setArchivePage(value)}
            style={{ float: 'right' }}
            total={totalProposals}
          />
        )}
    </div>
  );
}

export default Personal;
