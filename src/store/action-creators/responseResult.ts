import { Dispatch } from 'react';
import { usersApi } from 'src/api/api';
import {
  ActionsTypes,
  IGetResultAC,
  ResponseResultActions,
} from 'src/types/responseResult';

export const getResult = (payload: {
  result: boolean;
  msg: string;
  orderId: number | null;
}): IGetResultAC => ({
  type: ActionsTypes.GET_RESULT,
  payload,
});

export const createNewProposal = (token: string, data: FormData) => (
  (dispatch: Dispatch<ResponseResultActions>) => {
    usersApi.createNewProposal(token ?? '', data).then((response) => dispatch(
      getResult({
        result: response.data.result,
        msg: response.data.msg,
        orderId: response.data.orderId,
      }),
    ));
  }
);
