import React from 'react';
import { Button, Modal } from 'antd';
import cx from 'classnames';
import { LoadingButton } from '../../Loading';
import common from '../Modals.module.css';
import s from './index.module.css';

const modalStyles = {
  maxWidth: '320px',
  margin: '0 auto',
};

interface SaveTemplateProps {
  isSaving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const SaveTemplate: React.FC<SaveTemplateProps> = (props) => {
  const {
    isSaving,
    onCancel,
    onSubmit,
  } = props;

  return (
    <Modal
      bodyStyle={modalStyles}
      centered
      visible
      onCancel={onSubmit}
      footer={null}
    >
      <p className={s.centered}>Сохранить заявку как шаблон?</p>
      <div className={cx(common.footer, common.paddingReset)}>
        <Button
          type="primary"
          className={common.button}
          disabled={isSaving}
          onClick={onSubmit}
        >
          {!isSaving ! && 'Да'}
          {isSaving && <LoadingButton />}
        </Button>
        <Button
          type="primary"
          className={common.button}
          onClick={onCancel}
        >
          Нет
        </Button>
      </div>
    </Modal>
  );
};

export default SaveTemplate;
