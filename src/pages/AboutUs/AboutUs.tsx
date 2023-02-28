import React from 'react';
import s from './AboutUs.module.css';

function AboutUs() {
  return (

    <section className={s.page}>
      <div className={s.title}>О нас</div>
      <div className={s.text}>
        <p>
          DentMarketPlace (DentMP)- это агрегатор поставщиков стоматологических
          товаров и оборудования.
        </p>
        <p>
          Был создан коллективом стоматологического центра Славная Улыбка
          совместно с компанией Webuse для удобства заказа материалов,
          оборудования, инструментов. Отталкиваясь от собственного опыта работы
          с поставщиками, мы пришли к выводу, что потраченное время на поиск
          лучшего ценового предложения порой дороже той выгоды, которой нам
          удалось достичь путем длительного обзвона поставщиков и торгов с ними.
          Поэтому мы решили создать свою собственную площадку на которой могут
          регистрироваться управляющие стоматологических клиник, а также те, кто
          ответственен за поставки.
        </p>
        <p>
          MarketPlace дает возможность создавать заказы для группы поставщиков и
          сравнивать поступившие предложения. Это экономит время, которое
          менеджеры тратят на обзвон в поисках лучшего предложения и позволяет
          получить необходимый товар по наилучшей цене.
        </p>
        <p>
          Поставщикам также будет интересно использовать этот инструмент для
          продаж, т.к. не придется тратить время на телефонные разговоры и
          формирование коммерческих предложений - всё это можно будет сделать в
          личном кабинете DentMP, просто проставив цены напротив позиций в
          заказе.
        </p>
      </div>
    </section>
  );
}

export default AboutUs;
