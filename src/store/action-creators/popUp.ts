import { Dispatch } from 'react';
import {
  IsetErrAction,
  ActionsTypes,
  ErrActions,
  IsetCurrentModal,
  ModalsTypes,
  IDeleteErr,
} from '../../types/popUp';

export const setErr = (payload: {
  id: number;
  text: string;
}): IsetErrAction => ({
  type: ActionsTypes.SET_ERR,
  payload,
});

export const deleteErr = (payload: number): IDeleteErr => ({
  type: ActionsTypes.DELETE_ERR,
  payload,
});

export const setCurrentModal = (payload: ModalsTypes): IsetCurrentModal => ({
  type: ActionsTypes.SET_CURRENT_MODAL,
  payload,
});

export const showErr = (text: string) => (dispatch: Dispatch<ErrActions>) => {
  const id = Date.now();

  dispatch(setErr({ id, text }));
  setTimeout(() => {
    dispatch(deleteErr(id));
  }, 3000);
};
