const initialState = {
  offersItems: [],
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ITEMS': {
      return {
        ...state,
        offersItems: [...state.offersItems, action.payload],
      };
    }
    default: {
      return state;
    }
  }
};

export default itemsReducer;
