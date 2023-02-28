import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import popUpReducer from './reducers/popUpReducer';
import authReducer from './reducers/authReducer';
import userProfileReducer from './reducers/userProfileReducer';
import itemsReducer from './reducers/itemsReducer';
import cartItemReducer from './reducers/cartItemsReducer';
import responseResultReducer from './reducers/responseResultReducer';
import refreshReducer from './reducers/refreshReducer';

const rootReducer = combineReducers({
  popUps: popUpReducer,
  auth: authReducer,
  userProfile: userProfileReducer,
  items: itemsReducer,
  cartItems: cartItemReducer,
  responseResult: responseResultReducer,
  refresh: refreshReducer,
});
export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export type RootState = ReturnType<typeof rootReducer>;
