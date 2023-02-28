import {
  ActionsTypes,
  ResponseResultActions,
  ResponseResultState,
} from 'src/types/responseResult';

const initialState: ResponseResultState = {
  result: false,
  msg: '',
  orderId: null,
  offersCount: 0,
};

const responseResultReducer = (
  state = initialState,
  action: ResponseResultActions,
): ResponseResultState => {
  switch (action.type) {
    case ActionsTypes.GET_RESULT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default responseResultReducer;
