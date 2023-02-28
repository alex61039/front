import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes';
import s from './Home.module.css';
import manImg from '../../assets/img/main-page-man.svg';
import { ModalsTypes } from '../../types/popUp';
import useActions from '../../hooks/useActions';
import useTypedSelector from '../../hooks/useTypedSelector';

const Home: React.FC = () => {
  const { isAuth, isActive } = useTypedSelector((state) => state.auth);
  const { isProvider } = useTypedSelector((state) => state.userProfile);
  const { setCurrentModal } = useActions();
  useEffect(() => {
    if (isActive) {
      setCurrentModal(ModalsTypes.null);
    }
  }, []);

  return (
    <section className={s.page}>
      <section className={`${s.section_1} ${s.section}`}>
        <div className={s.s1_left}>
          <div className={s.s1_title}>
            <p>Dent</p>
            <p>MarketPlace</p>
          </div>
          <div className={s.s1_options}>
            <div className={s.s1_option}>
              Агрегатор стоматологических товаров
            </div>
            <div className={s.s1_option}>
              - Удобно, выгодно, просто
            </div>
            <div className={s.s1_option}>
              - Самый разумный анализ поставщиков по нашему мнению
            </div>
          </div>
        </div>
        <div className={s.s1_right}>
          <div className={s.s1_img}>
            <img src={manImg} alt="manImg" />
          </div>
        </div>
      </section>
      <section className={`${s.section_2} ${s.section}`}>
        <div className={s.s2_title}>
          <span>С чего начать?</span>
        </div>
        <div className={s.s2_subtitle}>
          Чтобы начать пользоваться сервисом достаточно просто создать заявку,
          на которую смогут откликнуться поставщики
        </div>

        {!isAuth && (
          <div
            onClick={() => setCurrentModal(ModalsTypes.login)}
            className={s.s2_create_request}
          >
            Создать заявку
          </div>
        )}
        {isAuth && isProvider && (
          <Link to={routes.personal}>
            <div className={s.s2_create_request}>Создать предложение</div>
          </Link>
        )}
        {isAuth && !isProvider && (
          <Link to={routes.new}>
            <div className={s.s2_create_request}>Создать заявку</div>
          </Link>
        )}
        <div className={s.s2_title}>
          <span>Как работает сервис?</span>
        </div>
        <div className={s.s2_video}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VhJ-0oiwEc0"
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>
    </section>
  );
};

export default Home;
