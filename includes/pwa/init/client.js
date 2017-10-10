/* eslint-disable import/first, global-require */
import './public-path';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import stores from './stores';
import App from './App';

const history = createHistory();

history.listen((location, action) => {
  console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
  console.log(`The last navigation action was ${action}`)
});

const render = async (Component, store) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component history={history} stores={store} />
    </AppContainer>,
    document.getElementById('root')
  );
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(['./App.js', './stores.js'], () => {
    const st = require('./stores').default;
    const Component = require('./App').default;
    render(Component, st);
  });
}

render(App, stores);
