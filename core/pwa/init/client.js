/* eslint-disable import/first, global-require */
import './public-path';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import stores from './stores';
import App from './app';

const history = createHistory();

const render = async (Component, store) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component history={history} stores={store} />
    </AppContainer>,
    document.getElementById('root')
  );
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(['./app.js', './stores.js'], () => {
    const st = require('./stores').default;
    const Component = require('./app').default;
    render(Component, st);
  });
}

render(App, stores);
