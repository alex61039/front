/* eslint-disable no-param-reassign */
import { useEffect } from 'react';

const useBeforeUnload = () => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      const alert = 'Закрыть страницу с заявкой? Данные НЕ сохранятся';

      event.returnValue = alert;
      return alert;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export default useBeforeUnload;
