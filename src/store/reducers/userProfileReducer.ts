import {
  UserProfileState,
  UserProfileActions,
  ActionsTypes,
} from '../../types/userProfile';

const initialState: UserProfileState = {
  name: '',
  email: '',
  isProvider: null,
  phone: '',
  organization: '',
  region: '',
  address: '',
  website: '',
  providerTypes: [],
};

const userProfileReducer = (
  state = initialState,
  action: UserProfileActions,
): UserProfileState => {
  switch (action.type) {
    case ActionsTypes.SET_USER_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case ActionsTypes.REMOVE_TYPE_OF_PROVIDER: {
      return {
        ...state,

        providerTypes: state.providerTypes.filter((item: any) => item.name !== action.payload),
      };
    }
    default:
      return state;
  }
};

export default userProfileReducer;
