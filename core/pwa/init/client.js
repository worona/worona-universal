/* eslint-disable import/first, global-require, no-underscore-dangle */
import './public-path';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import { addPackage } from 'worona-deps';
import stores from './stores';
import App from './components/App';
import initStore from './store';
import reducers from './reducers';
import clientSagas from './sagas.client';
import buildModule from '../packages/build';
import routerModule from '../packages/router';
import settingsModule from '../packages/settings';

addPackage({ namespace: 'build', module: buildModule });
addPackage({ namespace: 'router', module: routerModule });
addPackage({ namespace: 'settings', module: settingsModule });

const render = async Component => {
  const activatedPackages = window.__wppwa_activated_packages__;
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
