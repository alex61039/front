import {
  PopUpState,
  ErrActions,
  ActionsTypes,
  ModalsTypes,
} from '../../types/popUp';

const initialState: PopUpState = {
  alerts: [],
  currentModal: ModalsTypes.null,
  isSideBarOpen: false,
};

const popUpReducer = (
  state = initialState,
  action: ErrActions,
): PopUpState => {
  switch (action.type) {
    case ActionsTypes.SET_ERR: {
      return {
        ...state,
        alerts: [
          ...state.alerts,
          { id: action.payload.id, text: action.payload.text },
        ],
      };
    }
    case ActionsTypes.SIDEBAR_OPENED: {
      return {
        ...state, isSideBarOpen: action.payload,
      };
    }
    case ActionsTypes.DELETE_ERR: {
      return {
        ...state,
        alerts: state.alerts.filter(({ id }) => id !== action.payload),
      };
    }
    case ActionsTypes.SET_CURRENT_MODAL: {
      return {
        ...state,
        currentModal: action.payload,
      };
    }
    default:
      return state;
  }
};

export default popUpReducer;
