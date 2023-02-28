// интерфейс всего редьюсера
interface IAlert {
  id: number;
  text: string;
}

export enum ModalsTypes {
  login = 'login',
  reg = 'reg',
  remindPass = 'remindPass',
  confirmEmail = 'confirmEmail',
  null = 'null',
}

export interface PopUpState {
  alerts: IAlert[];
  currentModal: ModalsTypes;
  isSideBarOpen: boolean | null;
}

// перечисления
export enum ActionsTypes {
  SET_ERR = 'SET_ERR',
  DELETE_ERR = 'DELETE_ERR',
  SET_CURRENT_MODAL = 'SET_CURRENT_MODAL',
  SIDEBAR_OPENED = 'SIDEBAR_OPENED',
}

// интерфейсы экшенов
export interface IsetErrAction {
  type: ActionsTypes.SET_ERR;
  payload: { id: number; text: string };
}

export interface IDeleteErr {
  type: ActionsTypes.DELETE_ERR;
  payload: number;
}

export interface IsetCurrentModal {
  type: ActionsTypes.SET_CURRENT_MODAL;
  payload: ModalsTypes;
}

export interface IsetSideBarOpen {
  type: ActionsTypes.SIDEBAR_OPENED;
  payload: boolean | null;
}

// далее, если нужно добавить другие типы экшенов - ставим | и добавляем */
export type ErrActions = IsetErrAction | IsetCurrentModal | IDeleteErr | IsetSideBarOpen;
