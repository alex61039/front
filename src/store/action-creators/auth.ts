/* eslint-disable import/no-cycle */
import { Dispatch } from 'react';
import {
  LogIn,
  ActionsTypes,
  AuthActions,
  IsetEmailVerified,
  ISetIsFetching,
} from '../../types/auth';
import { authApi } from '../../api/api';
import { showErr } from './popUp';
import { getUserData } from './userProfile';
import getCookie from '../../helpers/getCookie';

export const logInAC = (payload: { isAuth: boolean }): LogIn => ({
  type: ActionsTypes.LOG_IN,
  payload,
});
export const setIsFetching = (payload: boolean): ISetIsFetching => ({
  type: ActionsTypes.SET_IS_FETCHING,
  payload,
});
export const setIsLoading = (payload: boolean): any => ({
  type: ActionsTypes.SET_IS_LOADING,
  payload,
});
export const setIsEmailVerified = (payload: boolean): IsetEmailVerified => ({
  type: ActionsTypes.SET_EMAIL_VERIFIED,
  payload,
});

export const authUser = (
  email: string,
  password: string,
  setLoginModalOff: () => void,
) => (dispatch: Dispatch<any>) => {
  dispatch(setIsFetching(true));
  authApi
    .login(email.trim(), password.trim())
    .then((response: any) => {
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        dispatch(getUserData(response.data.token));
        setLoginModalOff();
      }
    })
    .finally(() => {
      dispatch(setIsFetching(false));
    });
};

export const logOut = () => (dispatch: Dispatch<AuthActions>) => {
  authApi.logOut().then((res) => {
    if (res.status === 200) {
      dispatch(logInAC({ isAuth: false }));
      localStorage.clear();
    }
  });
};

export const changeEmail = (token: string | undefined | null, email: string) => (
  (dispatch: Dispatch<any>) => {
    authApi
      .changeEmail(token, email)
      .then((res) => {
        if (res.data.result) {
          dispatch(showErr('Почта изменена!'));
          authApi.refresh().then(() => {
            const updatedToken: string | undefined | null = getCookie('Authentication');
            dispatch(getUserData(updatedToken || ''));
          });
        } else {
          dispatch(showErr(res.data.msg));
        }
      })
      .catch(() => {
        dispatch(showErr('Ошибка!'));
      });
  }
);

export const changePassword = (
  currentPassword: string,
  newPassword: string,
  token: string | undefined,
) => (dispatch: Dispatch<any>) => {
  authApi.changePassword(currentPassword, newPassword, token).then((res) => {
    if (res.data.result) {
      dispatch(showErr('Пароль обновлён!'));
      authApi.refresh().then(() => {
        const updatedToken: string | undefined | null = getCookie('Authentication');
        dispatch(getUserData(updatedToken || ''));
      });
    } else {
      dispatch(showErr(res.data.msg));
    }
  });
};
