/* eslint-disable import/no-cycle */
import { Dispatch } from 'react';
import {
  UserProfileActions,
  SetUserData,
  IUserData,
  ActionsTypes,
} from '../../types/userProfile';

import { AuthActions } from '../../types/auth';

import { usersApi } from '../../api/api';

import {
  logInAC,
  setIsEmailVerified,
  setIsFetching,
  setIsLoading,
} from './auth';

import { setCurrentModal } from './popUp';
import { ErrActions, ModalsTypes } from '../../types/popUp';

export const setUserDataAC = (data: IUserData): SetUserData => ({
  type: ActionsTypes.SET_USER_DATA,
  payload: data,
});

export const getUserData = (token: string) => (
  (dispatch: Dispatch<UserProfileActions | AuthActions | ErrActions>) => {
    dispatch(setIsFetching(true));
    usersApi.getUserData(token)
      .then((res) => {
        if (res.status === 200) {
          dispatch(logInAC({ isAuth: true }));
          dispatch(setUserDataAC(res.data));
          dispatch(setIsEmailVerified(res.data.isActive));
          if (!res.data.isActive) {
            dispatch(setCurrentModal(ModalsTypes.confirmEmail));
          }
        }
      })
      .finally(() => {
        dispatch(setIsFetching(false));
        dispatch(setIsLoading(false));
      });
  }
);
