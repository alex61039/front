import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActionCreators from '../store/action-creators/index';

const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(ActionCreators, dispatch);
};

export default useActions;
