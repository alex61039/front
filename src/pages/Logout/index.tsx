import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import routes from 'src/routes';
import { store } from 'src/store';
import { logOut } from 'src/store/action-creators/auth';

const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    store.dispatch(logOut());
    history.push(routes.index);
  }, []);

  return null;
};

export default Logout;
