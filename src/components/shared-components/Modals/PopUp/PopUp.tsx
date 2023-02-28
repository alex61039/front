import React, { useState } from 'react';
import { Alert } from 'antd';
import s from './PopUp.module.css';

interface PopUpProps {
  text: string;
}

const PopUp: React.FC<PopUpProps> = ({ text }) => {
  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div className={s.alert}>
      {visible ? (
        <Alert message={text} type="info" afterClose={handleClose} />
      ) : null}
    </div>
  );
};

export default PopUp;
