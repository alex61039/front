import React from 'react';
import s from './PopUp.module.css';
import useTypedSelector from '../../../../hooks/useTypedSelector';
import PopUp from './PopUp';

interface PopUpsProps {
}

const PopUps: React.FC<PopUpsProps> = () => {
  const { alerts } = useTypedSelector((state) => state.popUps);
  return (
    <div className={s.popUps}>
      {alerts.map((alert) => (
        <PopUp text={alert.text} />
      ))}
    </div>
  );
};

export default PopUps;
