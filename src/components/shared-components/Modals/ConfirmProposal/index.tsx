import React, { FC, useState } from 'react';

import { Button, Modal } from 'antd';
import cx from 'classnames';
import useTypedSelector from 'src/hooks/useTypedSelector';
import { LoadingButton } from 'src/components/shared-components/Loading';
import common from 'src/components/shared-components/Modals/Modals.module.css';
import s from './index.module.css';

interface ConfirmProposalProps {
  formRef: React.RefObject<HTMLFormElement>;
  disabled?: boolean;
  loading?: boolean;
}

const modalStyles = {
  maxWidth: '320px',
  margin: '0 auto',
};

const ConfirmProposal: FC<ConfirmProposalProps> = (props) => {
  const {
    disabled,
    formRef,
    loading,
  } = props;

  const { isProvider } = useTypedSelector((state) => state.userProfile);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleClick = () => {
    if (!formRef.current?.checkValidity()) {
      formRef.current?.requestSubmit();
    } else {
      setIsVisible(true);
    }
  };

  const handleSubmit = () => {
    setIsVisible(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <div className={s.submit_button_container}>
        <button
          className={s.submit_button}
          type="button"
          disabled={disabled || loading}
          onClick={handleClick}
        >
          {!loading && 'Далее'}
          {loading && <LoadingButton />}
        </button>
      </div>
      <Modal
        bodyStyle={modalStyles}
        centered
        visible={isVisible}
        onCancel={() => setIsVisible(false)}
        footer={null}
      >
        <p className={s.centered}>
          {isProvider
            ? 'Предложение будет отправлено! Вы уверены?'
            : 'Заявка будет отправлена! Вы уверены?'}
        </p>
        <div className={cx(common.footer, common.paddingReset)}>
          <Button
            type="primary"
            className={common.button}
            onClick={handleSubmit}
          >
            Да
          </Button>
          <Button
            type="primary"
            className={common.button}
            onClick={() => setIsVisible(false)}
          >
            Нет
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmProposal;
