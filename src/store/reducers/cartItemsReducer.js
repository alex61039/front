const initialState = {
  isCartRefreshed: null,
};

const cartItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CART_REFRESH': {
      return { ...state, isCartRefreshed: action.payload };
    }
    default:
      return state;
  }
};

export default cartItemReducer;
