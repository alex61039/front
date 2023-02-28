import React from 'react';
import useTypedSelector from '../../../hooks/useTypedSelector';
import s from './ModalFade.module.css';

interface ModalFadeProps {
}

const ModalFade: React.FC<ModalFadeProps> = () => {
  const body = document.querySelector('body');
  const pupups = useTypedSelector((state) => state.popUps);
  const isFade = pupups.currentModal !== 'null';

  if (isFade) {
    body?.classList.add('fix');
  } else {
    body?.classList.remove('fix');
  }

  return <div className={`${s.fade} ${isFade && s.active}`} />;
};

export default ModalFade;
