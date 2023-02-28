import React, { useEffect } from 'react';
import Input from 'antd/lib/input';
import InputMask from 'react-input-mask';
import s from './ProviderProposal.module.css';
import { PreviousOfferData } from './ProviderProposalsTypes';
import useTypedSelector from '../../hooks/useTypedSelector';

interface UserContaсtsInfoProps {
  prevOfferData: PreviousOfferData,
  setPrevOfferData: React.Dispatch<React.SetStateAction<any>>
}

const UserContactsInfo: React.FC<UserContaсtsInfoProps> = ({ prevOfferData, setPrevOfferData }) => {
  const userInfo = useTypedSelector((state) => state.userProfile);

  useEffect(() => {
    if (prevOfferData.organization === '') {
      setPrevOfferData({
        ...prevOfferData,
        organization: userInfo.organization,
        phone: userInfo.phone,
        name: userInfo.name,
      });
    }
  }, []);

  const OrganizationInfo = (e: any) => {
    setPrevOfferData({ ...prevOfferData, organization: e.target.value });
  };

  const PhoneInfo = (e: any) => {
    setPrevOfferData({ ...prevOfferData, phone: e.target.value });
  };

  const NameInfo = (e: any) => {
    setPrevOfferData({ ...prevOfferData, name: e.target.value });
  };

  return (
    <div className={s.proposal_right_block_container}>

      <div className={s.proposal_right_block}>
        <div className={s.half_block_title}>
          Ваши контактные данные
        </div>
        <div className={s.proposal_right_block_item}>
          <div className={s.proposal_right_block_item_title}>
            Организация
          </div>

          <Input
            required
            onChange={(e) => OrganizationInfo(e)}
            type="text"
            disabled={prevOfferData.offersCount === 3}
            value={prevOfferData.organization}
            maxLength={256}
          />

        </div>
        <div className={s.proposal_right_block_item}>
          <div className={s.proposal_right_block_item_title}>
            Имя
          </div>
          <Input
            onChange={(e) => NameInfo(e)}
            disabled={prevOfferData.offersCount === 3}
            required
            value={prevOfferData.name}
            maxLength={256}
          />
        </div>
        <div className={s.proposal_right_block_item}>
          <div className={s.proposal_right_block_item_title}>
            Телефон
          </div>
          <InputMask
            disabled={prevOfferData.offersCount === 3}
            required
            onChange={(e) => PhoneInfo(e)}
            value={prevOfferData.phone}
            pattern=".{16}"
            title="Телефон должен содержать не менее 10 цифр"
            mask="+7(999) 999-9999"
          />
        </div>
        <div className={s.proposal_right_block_item}>
          <div className={s.proposal_right_block_item_title}>
            Электронная почта
          </div>
          <Input
            disabled
            required
            value={userInfo.email}
            maxLength={256}
          />
        </div>
      </div>
    </div>
  );
};

export default UserContactsInfo;
