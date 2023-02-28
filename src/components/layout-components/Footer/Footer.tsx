import React from 'react';
import s from './Footer.module.css';

function Footer() {
  return (
    <div className={s.footer}>
      <div className={s.inner}>
        <div className={s.title}>
          Остались вопросы?
        </div>
        <div className={s.info}>
          <div className={s.left}>
            <p>Свяжитесь с нами по телефону</p>
            <p><a href="tel:+79110067993">+7 (911) 006-79-93</a></p>
          </div>
          <div className={s.right}>
            <p>Режим работы:</p>
            <p>с 9:00 до 21:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
