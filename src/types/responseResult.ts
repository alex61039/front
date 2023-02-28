export interface ResponseResultState {
  result: boolean;
  msg: string;
  orderId: null | number;
  offersCount: number;
}

export enum ActionsTypes {
  GET_RESULT = 'GET_RESULT',
}

export interface IGetResultAC {
  type: ActionsTypes.GET_RESULT;
  payload: { result: boolean; msg: string; orderId: number | null };
}

export type ResponseResultActions = IGetResultAC;
