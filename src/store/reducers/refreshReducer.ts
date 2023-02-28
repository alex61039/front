const initialState = {
  isRefresh: null,
  isOrderClosed: null,
  isSaveTemplateRefresh: null,
};

const refreshReducer = (
  state = initialState,
  action: any,
) => {
  switch (action.type) {
    case 'SET_REFRESH': {
      return {
        ...state, isRefresh: action.payload,
      };
    }
    case 'SET_ORDER_CLOSE': {
      return {
        ...state, isOrderClosed: action.payload,
      };
    }
    case 'SET_SAVE_TEMPLATE_REFRESH': {
      return {
        ...state, isSaveTemplateRefresh: action.payload,
      };
    }

    default:
      return state;
  }
};

export default refreshReducer;
