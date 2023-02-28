/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';

import { store } from './store';
import App from './App';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Router>,

  document.getElementById('root'),
);
