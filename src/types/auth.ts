/* eslint-disable max-len */
export enum ActionsTypes {
  LOG_IN = 'LOG_IN',
  SET_EMAIL_VERIFIED = 'SET_EMAIL_VERIFIED',
  SET_IS_FETCHING = 'SET_IS_FETCHING',
  SET_IS_LOADING = 'SET_IS_LOADING',
}

export interface AuthState {
  isAuth: boolean;
  isFetching: boolean;
  isActive: boolean;
  isLoading: boolean;
}

export interface LogIn {
  type: ActionsTypes.LOG_IN;
  payload: { isAuth: boolean };
}

export interface IsetEmailVerified {
  type: ActionsTypes.SET_EMAIL_VERIFIED;
  payload: boolean;
}

export interface ISetIsFetching {
  type: ActionsTypes.SET_IS_FETCHING;
  payload: boolean;
}

export interface IisLoading {
  type: ActionsTypes.SET_IS_LOADING;
  payload: boolean;
}

export type AuthActions = LogIn | IsetEmailVerified | ISetIsFetching | IisLoading;
