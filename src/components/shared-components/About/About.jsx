import React from 'react';

import s from '../../../pages/CustomerProposal/CustomerProposal.module.css';

const About = () => (
  <>
    <div className={s.about}>
      <div className={s.about_title}>Как работает сервис?</div>
      <div className={s.right_block_item}>
        <span className={s.item_num}>1.</span>
        <div className={s.item_text}>Оставьте заявку на нашем сайте</div>
      </div>
      <div className={s.right_block_item}>
        <span className={s.item_num}>2.</span>
        <div className={s.item_text}>Соберите лучшие предложения от наших поставщиков</div>
      </div>
      <div className={s.right_block_item}>
        <span className={s.item_num}>3.</span>
        <div className={s.item_text}>Сравните все предложения</div>
      </div>
      <div className={s.right_block_item}>
        <span className={s.item_num}>4.</span>
        <div className={s.item_text}>Выбирайте наиболее выгодное предложение</div>
      </div>
      <div className={s.right_block_item}>
        <span className={s.item_num}>5.</span>
        <div className={s.item_text}>Оформите заявку и получите товар</div>
      </div>
      <hr />
    </div>
    <div className={s.about_contacts}>
      <div className={s.about_contacts_title}>
        У Вас остались вопросы или необходима помощь?
        {' '}
      </div>
      <div className={s.about_contacts_block}>
        Звоните по номеру
        {' '}
        <br />
        <span>
          <a href="tel:+79110067993">+7 (911) 006-79-93</a>
        </span>
      </div>
      <div className={s.about_contacts_block}>
        Режим работы:
        {' '}
        <br />
        с 9:00 до 21:00
      </div>
    </div>
  </>
);

export default About;
