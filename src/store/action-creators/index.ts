import * as popUpActionCreators from './popUp';
import * as authActionCreators from './auth';
import * as userProfileActionCreators from './userProfile';
import * as responseResult from './responseResult';

export default {
  ...popUpActionCreators,
  ...authActionCreators,
  ...userProfileActionCreators,
  ...responseResult,
};
