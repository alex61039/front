/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { message } from 'antd';
import routes from 'src/routes';
import { ProposalStatuses } from 'src/types/proposal';
import { store } from '../store';
import { getUserData } from '../store/action-creators/userProfile';

const { REACT_APP_BACKEND_URL, REACT_APP_AUTH_URL } = process.env;

const { isProvider } = store.getState().userProfile;

const baseApi = axios.create({
  baseURL: REACT_APP_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const auth = axios.create({
  baseURL: REACT_APP_AUTH_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export const authApi = {
  reg(
    fio: string,
    email: string,
    password: string,
    userType: string,
    providerType: string[],
    organization: string,
    captchaData: string | null,
  ) {
    if (organization.length !== 0) {
      return auth.post(
        '/registration',
        JSON.stringify({
          name: fio,
          email,
          password,
          userType,
          providerType,
          organization,
          captchaData,
        }),
      );
    }
    return auth.post(
      '/registration',
      JSON.stringify({
        name: fio,
        email,
        password,
        userType,
        providerType,
        captchaData,
      }),
    );
  },
  login(email: string, password: string) {
    return auth.post(
      '/login',
      JSON.stringify({
        email,
        password,
      }),
    );
  },
  logOut() {
    return auth.post('/logout');
  },
  verifyEmailAgain(email: string) {
    return auth.get(`/send-confirm-email/?email=${email}`);
  },
  remindPassword(email: string, captchaData: string | null) {
    return auth.post('/send-forget-password', {
      email,
      captchaData,
    });
  },
  setNewPassword(newPassword: string, code: string) {
    return auth.post('/set-forget-password', { newPassword, code });
  },
  confirmEmail(code: string) {
    return auth.get<{ result: boolean }>(`/confirm-email?code=${code}`);
  },
  refresh() {
    return auth.post('/refresh');
  },
  changeEmail(token: string | undefined | null, email: string) {
    return auth.post(
      '/change-email',
      {
        email,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  changePassword(
    currentPassword: string,
    newPassword: string,
    token: string | undefined,
  ) {
    return auth.post(
      '/change-password',
      { currentPassword, newPassword, confirmPassword: newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },
};

const refreshAuthLogic = (failedRequest: any) => {
  auth.post('/refresh').then((tokenRefreshResponse) => {
    getUserData(tokenRefreshResponse.data.token);
    failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.token}`;

    if (failedRequest.config.url?.includes('/orders/new')) {
      baseApi(failedRequest.config).then((r) => {
        store.dispatch({
          type: 'GET_RESULT',
          payload: {
            result: r.data.result,
            msg: r.data.msg,
            orderId: r.data.orderId,
          },
        });
      });
    }

    if (failedRequest.config.url?.includes('/new-offer')) {
      baseApi(failedRequest.config).then((r) => {
        store.dispatch({
          type: 'GET_RESULT',
          payload: {
            result: r.data.result,
            msg: r.data.msg,
            orderId: r.data.orderId,
          },
        });
      });
    }

    if (failedRequest.config.url?.includes('compare-proposal')) {
      store.dispatch({
        type: 'SET_REFRESH',
        payload: Date.now(),
      });
    }

    if (failedRequest.config.url?.includes('data') && failedRequest.config.url?.includes('orders')) {
      store.dispatch({
        type: 'SET_REFRESH',
        payload: Date.now(),
      });
    }

    if (failedRequest.config.url?.includes('active')) {
      store.dispatch({
        type: 'SET_REFRESH',
        payload: Date.now(),
      });
    }

    if (failedRequest.config.url?.includes('archive')) {
      store.dispatch({
        type: 'SET_REFRESH',
        payload: Date.now(),
      });
    }

    if (failedRequest.config.url?.includes('close')) {
      store.dispatch({
        type: 'SET_ORDER_CLOSE',
        payload: true,
      });

      setTimeout(() => {
        store.dispatch({
          type: 'SET_ORDER_CLOSE',
          payload: false,
        });
      }, 1000);
    }
    if (failedRequest.config.url?.includes(':/')) {
      baseApi(failedRequest.config).then(() => {
        store.dispatch({
          type: 'SET_CART_REFRESH',
          payload: Date.now,
        });
        message.error('Позиция удалена из корзины!');
      });
    }

    if (isProvider && failedRequest.config.url?.includes('orders/')) {
      store.dispatch({
        type: 'SET_REFRESH',
        payload: Math.random(),
      });
    }
    if (failedRequest.config.url?.includes('add-provider-type')) {
      baseApi(failedRequest.config).then(() => {
        store.dispatch({
          type: 'SET_REFRESH',
          payload: Date.now,
        });
      });
    }
    if (failedRequest.config.url?.includes('delete-provider-type')) {
      baseApi(failedRequest.config).then(() => {
        store.dispatch({
          type: 'SET_REFRESH',
          payload: Date.now,
        });
      });
    }
    if (failedRequest.config.url?.includes('update-profile')) {
      baseApi(failedRequest.config).then(() => {
        store.dispatch({
          type: 'SET_REFRESH',
          payload: Date.now,
        });
      });
    }
    if (failedRequest.config.url?.includes('orders/template')) {
      if (failedRequest.config.method === 'post') {
        message.success('Шаблон успешно создан!', 3);
        baseApi(failedRequest.config).then(() => {
          store.dispatch({
            type: 'SET_REFRESH',
            payload: Date.now,
          });
        });
      }

      if (failedRequest.config.method === 'post') {
        store.dispatch({
          type: 'SET_REFRESH',
          payload: Math.floor(Math.random()),
        });
      }
    }
    if (failedRequest.config.url?.includes('users/providers-type?page')) {
      store.dispatch({
        type: 'SET_REFRESH',
        payload: Math.floor(Math.random()),
      });
    }
    if (failedRequest.config.url?.includes('carts/')) {
      baseApi(failedRequest.config).then(() => {
        store.dispatch({
          type: 'SET_REFRESH',
          payload: Math.random() + 1,
        });
      });
      message.success('Позиция добавлена в корзину!', 3);
    }
    if (failedRequest.config.url?.includes('/goods/search')) {
      baseApi(failedRequest.config).then(() => {
        store.dispatch({
          type: 'SET_REFRESH',
          payload: Date.now,
        });
      });
    }
    if (failedRequest.config.url?.includes('send-offers')) {
      baseApi(failedRequest.config).then(() => {
        store.dispatch({
          type: 'SET_REFRESH',
          payload: Math.random() + Math.random(),
        });
      });
      message.success('Заявки отправлены!', 3);
    }

    return Promise.resolve();
  }).catch(() => {
    authApi.logOut().then(() => {
      localStorage.removeItem('token');

      if (window.location.pathname !== routes.index) {
        window.location.href = routes.index;
      }
    });
    return Promise.resolve();
  });
};

// @ts-ignore
createAuthRefreshInterceptor(baseApi, refreshAuthLogic);

export const usersApi = {
  getUserData(token: string) {
    return baseApi.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getCompareData(token: string | null | undefined, id: any) {
    return baseApi.get(`/orders/${id}/compare-proposal`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProposals(
    token: string | null | undefined,
    isActiveProposalsTypeSelected: any,
    paginatorPage: any,
    archivePage: any,
    providerType: any,
  ) {
    return baseApi.get(`/orders/${isActiveProposalsTypeSelected ? 'active' : 'archive'}?page=${isActiveProposalsTypeSelected ? paginatorPage : archivePage}&category=${providerType}&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  closeCart(token: string | null | undefined, id: any, data: any) {
    return baseApi.post(`/orders/${id}/close`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateOrdersGoods(token: string | null | undefined, id: any, data: any) {
    return baseApi.patch(`/orders/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteItemFromCart(
    token: string | null | undefined,
    id: number | string,
    itemId: number | string,
    cartItemId: number | string,
  ) {
    return baseApi.delete(`/carts/${id}:/${itemId}:/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  addProductToCartPost(token: string | null | undefined, id: any, goods: any) {
    return baseApi.post(`/carts/${id}`, { goods }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  addProductToCartPatch(token: string | null | undefined, id: any, goods: any) {
    return baseApi.patch(`/carts/${id}`, { goods }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getCartData(token: string | null | undefined, id: any) {
    return baseApi.get(`/carts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getTemplate(token: string | null | undefined, orderId: any) {
    return baseApi.get(`/orders/${orderId}/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  search(token: string | null | undefined, name: string) {
    return baseApi.get(`/goods/search?search=${name}&page=${1}&limit=${50}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  createNewProposal(token: string | null | undefined, data: FormData) {
    return baseApi.post('/orders/new', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createNewOffer(token: string | null | undefined, data: FormData, id: any) {
    return baseApi.post(`/orders/${id}/new-offer`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProviderProposal(token: string | null | undefined, id: any) {
    return baseApi.get(`/orders/${id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProviderProposalStatus(token: string | null | undefined, id: any) {
    return baseApi.get(`/orders/${id}/get-offer-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  setProviderProposalStatus(token: string | null | undefined, id: string) {
    return baseApi.post(`/orders/${id}/set-offer-status`, { status: ProposalStatuses.PROCESSING }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  checkFile(token: string | null | undefined, data: FormData) {
    return baseApi.post('/orders/check-file-offer', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  addProviderType(token: string | null | undefined, value: any) {
    return baseApi.post('/users/add-provider-type', { providerType: value }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteProviderType(token: string | null | undefined, value: any) {
    return baseApi.post('/users/delete-provider-type', { providerType: value }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getTemplateData(token: string | null | undefined) {
    return baseApi.get('/orders/template', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getUniqProviders(token: string | null | undefined, uniqProviderType: any) {
    return baseApi.post('/users/providers-type', {
      type: uniqProviderType,
      page: 1,
      limit: 100,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createTemplateData(token: string | null | undefined, data: any) {
    return baseApi.post('/orders/template', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  sendCompareOffer(token: string | null | undefined, id: any, data: any) {
    return baseApi.post(`/carts/${id}/send-offers`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateData(token: string | null | undefined, updatedData: any) {
    return baseApi.patch('/users/update-profile', updatedData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  },
};
