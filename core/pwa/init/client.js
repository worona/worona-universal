/* eslint-disable import/first, global-require, no-underscore-dangle */
import './public-path';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import stores from './stores';
import App from './app';
import initStore from './store';
import reducers from './reducers';
import clientSagas from './sagas.client';

const render = async Component => {
  const store = initStore({
    reducer: combineReducers(reducers),
    initialState: window.__wppwa_initial_state__,
    sagas: clientSagas,
  });
  ReactDOM.hydrate(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('root')
  );
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(['./app.js', './store.js'], () => {
    const Component = require('./app').default;
    render(Component);
  });
}

render(App, stores);
