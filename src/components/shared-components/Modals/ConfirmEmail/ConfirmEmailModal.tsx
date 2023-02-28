import React, { useState, useEffect } from 'react';
import getCookie from 'src/helpers/getCookie';
import s from './ConfirmEmail.module.css';
import useTypedSelector from '../../../../hooks/useTypedSelector';
import useActions from '../../../../hooks/useActions';
import { authApi } from '../../../../api/api';
import { ModalsTypes } from '../../../../types/popUp';

interface ConfirmEmailModalProps {
}

const ConfirmEmailModal: React.FC<ConfirmEmailModalProps> = () => {
  const [seconds, setSeconds] = useState<number>(60);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const { setCurrentModal, logOut } = useActions();

  function set60SecTimer() {
    setIsButtonDisabled(true);
    const timerId = setInterval(() => {
      setSeconds((prevState) => prevState - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(timerId);
      setSeconds(60);
      setIsButtonDisabled(false);
    }, 60000);
  }

  const currentModal = useTypedSelector((state) => state.popUps.currentModal);
  const isEmailModalOpen = currentModal === ModalsTypes.confirmEmail;

  const { email } = useTypedSelector((state) => state.userProfile);
  const { isFetching } = useTypedSelector((state) => state.auth);
  const auth = useTypedSelector((state) => state.auth);

  function verifyEmailAgain() {
    authApi.verifyEmailAgain(email);
  }

  const token = getCookie('Authentication') || localStorage.getItem('token');

  useEffect(() => {
    if (!isFetching && token) {
      if (auth.isActive) {
        setCurrentModal(ModalsTypes.null);
      } else {
        setCurrentModal(ModalsTypes.confirmEmail);
      }
    }
  }, [auth.isActive, isFetching]);

  return (
    <div
      className={`${s.modal} ${!isFetching && isEmailModalOpen && s.active}`}
    >
      <div className={s.inner}>
        <div className={s.title}>
          На вашу почту было отправлено письмо для подтверждения вашего
          аккаунта!
        </div>
        <div className={`${s.button} ${isButtonDisabled && s.disabled}`}>
          <button
            type="button"
            disabled={isButtonDisabled}
            onClick={() => {
              verifyEmailAgain();
              set60SecTimer();
            }}
          >
            Отправить письмо еще раз
          </button>
          {isButtonDisabled && <div className={s.seconds}>{seconds}</div>}
        </div>
        <div
          onClick={() => {
            setCurrentModal(ModalsTypes.null);
            logOut();
          }}
          className={s.button}
        >
          Выход
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailModal;
