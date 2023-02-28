import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import routes from 'src/routes';
import { authApi } from '../../../api/api';
import useActions from '../../../hooks/useActions';
import LoaderCentered from '../Loader/LoaderCentered';
// test
const ConfirmEmail: React.FC = () => {
  const location = useLocation();

  const { setIsFetching } = useActions();

  useEffect(() => {
    const code = location.search.slice(6);
    setIsFetching(true);

    const confirmEmail = async () => {
      try {
        const response = await authApi.confirmEmail(code);

        if (!response || !response.data?.result) {
          throw response;
        }
      } catch (e) {
        console.warn(e);
      } finally {
        window.location.href = routes.index;

        setIsFetching(false);
      }
    };

    confirmEmail();
  }, []);

  return (
    <LoaderCentered />
  );
};

export default ConfirmEmail;
