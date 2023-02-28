import React from 'react';
import './ModalsWrapperControl.css';
import LoginModal from './LoginModal/LoginModal';
import RemindPasswordModal from './RemindPassword/RemindPasswordModal';
import RegModal from './RegModal/RegModal';
import ModalFade from './ModalFade';
import ConfirmEmailModal from './ConfirmEmail/ConfirmEmailModal';

function ModalsWrapperControl() {
  return (
    <>
      <LoginModal />
      <RemindPasswordModal />
      <RegModal />
      <ModalFade />
      <ConfirmEmailModal />
    </>
  );
}

export default ModalsWrapperControl;
