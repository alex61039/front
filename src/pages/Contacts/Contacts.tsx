import React from 'react';
import s from './Contacts.module.css';

function Contacts() {
  return (
    <div className={s.page}>
      <div className={s.title}>Свяжитесь с нами</div>
      <div className={s.contacts}>
        <p className={s.contact}>
          <p>Адрес</p>
          <p>Санкт-Петербург, пр. Медиков 10 корп.1</p>
        </p>
        <p className={s.contact}>
          <p>Телефон</p>
          <a href="tel:+79110067993">+7 (911) 006-79-93</a>
        </p>
        <p className={s.contact}>
          <p>Режим работы</p>
          <p>с 9:00 до 21:00, ежедневно</p>
        </p>
        <p className={s.contact}>
          <p>Почта</p>
          <a href="mailto:9351829@mail.ru">9351829@mail.ru</a>
        </p>
        <p className={s.contact}>
          <p>Мессенджеры</p>
          <p>
            <a href="https://wa.me/79110067993">What&apos;s up, </a>
            <a
              href="viber://chat?number=79110067993"
            >
              Viber
            </a>
            , Telegram
          </p>
        </p>
      </div>
    </div>
  );
}

export default Contacts;
