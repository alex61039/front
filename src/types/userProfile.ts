export enum ActionsTypes {
  SET_USER_DATA = 'SET_USER_DATA',
  REMOVE_TYPE_OF_PROVIDER = 'REMOVE_TYPE_OF_PROVIDER',
}
// интерфейс всего редьюсера
export interface UserProfileState extends IUserData {
}

export interface IUserData {
  name: string;
  email: string;
  isProvider: boolean | null;
  phone: string;
  organization: string;
  region: string | { name?: string };
  address: string;
  website?: string;
  providerTypes: { name: string }[];
}

// интерфейса экшена
export interface SetUserData {
  type: ActionsTypes.SET_USER_DATA;
  payload: IUserData;
}

export interface RemoveTypeOfProvider {
  type: ActionsTypes.REMOVE_TYPE_OF_PROVIDER;
  payload: IUserData;
}

// далее, если нужно добавить другие типы экшенов - ставим | и добавляем */
export type UserProfileActions = SetUserData | RemoveTypeOfProvider;
