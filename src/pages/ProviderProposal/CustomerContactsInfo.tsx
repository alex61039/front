import React from 'react';
import s from './ProviderProposal.module.css';

interface CustomerContactsInfoProps {
  ProviderData: ProviderData
}

interface ProviderData {
  organization: string,
  name: string,
  phone: string,
  deliveryAddress: string,
  comment: string,
  uploadedFile: any,
  linkType: string,
  region: string,
  user: string
}

const CustomerContactsInfo: React.FC<CustomerContactsInfoProps> = ({ ProviderData }) => (
  <div className={s.proposal_left_block_container}>
    <div className={s.proposal_left_block}>
      <div className={s.half_block_title}>
        Новая заявка
      </div>
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          Название компании:
        </div>
        <div className={s.value}>
          {ProviderData.organization}
        </div>
      </div>
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          Имя:
        </div>
        <div className={s.value}>
          {ProviderData.name}
        </div>
      </div>
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          Телефон:
        </div>
        <div className={s.value}>
          {ProviderData.phone}
        </div>
      </div>
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          Способ связи:
        </div>
        <div className={s.value}>
          {ProviderData.linkType}
        </div>
      </div>
      {ProviderData.uploadedFile !== null ? (
        <div className={s.proposal_left_block_item}>
          <div className={s.title}>
            Реквизиты организации:
          </div>
          <div className={s.value}>
            <a href={`${ProviderData.uploadedFile}`}>Скачать</a>
          </div>
        </div>
      ) : ''}
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          E-mail:
        </div>
        <div className={s.value}>
          {ProviderData.user}
        </div>
      </div>
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          Регион доставки:
        </div>
        <div className={s.value}>
          {ProviderData.region}
        </div>
      </div>
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          Адрес доставки:
        </div>
        <div className={s.value}>
          {ProviderData.deliveryAddress}
        </div>
      </div>
      <div className={s.proposal_left_block_item}>
        <div className={s.title}>
          Комментарий:
        </div>
        <div className={s.value}>
          {ProviderData?.comment?.length > 0 ? ProviderData?.comment : ''}
        </div>
      </div>
    </div>
  </div>
);

export default CustomerContactsInfo;
