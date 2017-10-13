/* eslint-disable no-console, global-require, import/no-dynamic-require */
import 'worona-polyfills';
import React from 'react';
import { readFile } from 'mz/fs';
import ReactDOM from 'react-dom/server';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { extractCritical } from 'emotion-server';
import request from 'superagent';
import { Helmet } from 'react-helmet';
import { normalize } from 'normalizr';
import { addPackage } from 'worona-deps';
import { combineReducers } from 'redux';
import htmlescape from 'htmlescape';
import { buildPath } from '../../../.build/pwa/buildInfo.json';
import { settingsSchema } from './schemas';
import buildModule from '../packages/build';
import routerModule from '../packages/router';
import settingsModule from '../packages/settings';
import serverSagas from './sagas.server';
import initStore from './store';
import reducers from './reducers';
import App from './app';

const requireModules = pkgs =>
  pkgs.map(([namespace, name]) => {
    const module = require(`../../../packages/${name}/src/pwa`).default;
    const serverSaga = require(`../../../packages/${name}/src/pwa/sagas/server`).default;
    return { name, namespace, module, serverSaga };
  });

addPackage({ namespace: 'build', module: buildModule });
addPackage({ namespace: 'router', module: routerModule });
addPackage({ namespace: 'settings', module: settingsModule });

export default ref => async (req, res) => {
  // Retrieve and normalize site settings.
  const cdn = process.env.SERVER_TYPE === 'prod' ? 'cdn' : 'precdn';
  const { body } = await request(
    `https://${cdn}.worona.io/api/v1/settings/site/${req.query.siteId}/app/prod/live`
  );
  const { entities: { settings } } = normalize(body, settingsSchema);

  // Extract activated packages array from settings.
  const activatedPackages = Object.values(settings)
    .filter(pkg => pkg.woronaInfo.namespace !== 'generalSite')
    .reduce((obj, pkg) => ({ ...obj, [pkg.woronaInfo.namespace]: pkg.woronaInfo.name }), {});

  // Load the modules, then add the reducers to the system.
  const packageModules = requireModules(Object.entries(activatedPackages));
  packageModules.forEach(pkg => {
    if (pkg.module.reducers) reducers[pkg.namespace] = pkg.module.reducers;
    if (pkg.serverSaga) serverSagas[pkg.name] = pkg.serverSaga;
    addPackage({ namespace: pkg.namespace, module: pkg.module });
  });

  const store = initStore({ reducer: combineReducers(reducers) });

  // Add settings to the state.
  store.dispatch(buildModule.actions.serverStarted());
  store.dispatch(settingsModule.actions.siteIdUpdated({ siteId: req.query.siteId }));
  store.dispatch(
    routerModule.actions.routeChangeSucceed({ query: req.query, pathname: {}, asPath: '/' })
  );
  store.dispatch(buildModule.actions.activatedPackagesUpdated({ packages: activatedPackages }));
  store.dispatch(settingsModule.actions.settingsUpdated({ settings }));

  // Run and wait until all the server sagas have run.
  const startSagas = new Date();
  const sagaPromises = Object.values(serverSagas).map(saga => store.runSaga(saga, req).done);
  store.dispatch(buildModule.actions.serverSagasInitialized());
  await Promise.all(sagaPromises);
  store.dispatch(buildModule.actions.serverFinished({ timeToRunSagas: new Date() - startSagas }));

  const html = ReactDOM.renderToString(<App store={store} />);
  const chunkNames = flushChunkNames();

  const { styles, cssHash, scripts, stylesheets } = flushChunks(ref.clientStats, { chunkNames });

  const { css } = extractCritical(html);
  const helmet = Helmet.renderStatic();

  const scriptsWithoutBootstrap = scripts.filter(sc => !/bootstrap/.test(sc));

  const chunksForArray = scriptsWithoutBootstrap.map(sc => `'${sc}'`).join(',');
  const bootstrapFileName = scripts.filter(sc => /bootstrap/.test(sc));
  const bootstrapString = await readFile(
    `${buildPath}/.build/pwa/client/${bootstrapFileName}`,
    'utf8'
  );

  const publicPath = req.query.static ? req.query.static.replace(/\/$/g, '') : '';
  const preloadScripts = scriptsWithoutBootstrap
    .map(sc => `<link rel="preload" href="${publicPath}/static/${sc}" as="script">`)
    .join('\n');

  console.log();
  console.log('> Path: ', req.path);
  console.log('> Dynamic chunks rendered: ', chunkNames);
  console.log('> Scripts served: ', scripts);
  console.log('> stylesheets served: ', stylesheets);
  console.log();

  res.send(
    `<!doctype html>
      <html ${helmet.htmlAttributes.toString()}>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          ${styles}
          ${preloadScripts}
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          <style>${css}</style>
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${html}</div>
          ${cssHash}
          <script>
            window.__wppwa_activated_packages__ = ${JSON.stringify(activatedPackages)};
            window.__wppwa_initial_state__ = ${htmlescape(store.getState())};
            var publicPath = '/';
            if (${!!process.env.PUBLIC_PATH}) {
              publicPath = '${process.env.PUBLIC_PATH}';
            } else if (window.__worona_public_path__) {
              publicPath = window.__worona_public_path__;
            }
            var scripts = [${chunksForArray}];
            var loadScript = function(script) {
              if (document.getElementById(script)) return;
              var ref = document.getElementsByTagName('script')[0];
              var js = document.createElement('script');
              js.id = script;
              js.src = publicPath + 'static/' + script;
              ref.parentNode.insertBefore(js, ref);
            };
            scripts.forEach(function(sc) { loadScript(sc); });
            ${bootstrapString}
          </script>
        </body>
      </html>`
  );
};
