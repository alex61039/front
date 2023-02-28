import getCookie from 'src/helpers/getCookie';

import { ActionsTypes, AuthState, AuthActions } from '../../types/auth';

const initialState: AuthState = {
  isAuth: Boolean(getCookie('Authentication')),
  isFetching: true,
  isLoading: true,
  isActive: true,
};

const authReducer = (
  state = initialState,
  action: AuthActions,
): AuthState => {
  switch (action.type) {
    case ActionsTypes.LOG_IN: {
      return { ...state, isAuth: action.payload.isAuth };
    }
    case ActionsTypes.SET_EMAIL_VERIFIED: {
      return { ...state, isActive: action.payload };
    }
    case ActionsTypes.SET_IS_FETCHING: {
      return { ...state, isFetching: action.payload };
    }
    case ActionsTypes.SET_IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }

    default:
      return state;
  }
};

export default authReducer;
