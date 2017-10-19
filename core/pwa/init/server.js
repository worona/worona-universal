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
import mapValues from 'lodash/mapValues';
import { buildPath } from '../../../.build/pwa/buildInfo.json';
import { settingsSchema } from './schemas';
import buildModule from '../packages/build';
import routerModule from '../packages/router';
import settingsModule from '../packages/settings';
import serverSagas from './sagas.server';
import initStore from './store';
import reducers from './reducers';
import App from './App';

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
  try {
    const cdn = process.env.SERVER_TYPE === 'prod' ? 'cdn' : 'precdn';
    const { body } = await request(
      `https://${cdn}.worona.io/api/v1/settings/site/${req.query.siteId}/app/prod/live`,
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
      routerModule.actions.routeChangeSucceed({ query: req.query, pathname: {}, asPath: '/' }),
    );
    store.dispatch(buildModule.actions.activatedPackagesUpdated({ packages: activatedPackages }));
    store.dispatch(settingsModule.actions.settingsUpdated({ settings }));

    // Run and wait until all the server sagas have run.
    const startSagas = new Date();
    const sagaPromises = Object.values(serverSagas).map(saga => store.runSaga(saga, req).done);
    store.dispatch(buildModule.actions.serverSagasInitialized());
    await Promise.all(sagaPromises);
    store.dispatch(buildModule.actions.serverFinished({ timeToRunSagas: new Date() - startSagas }));

    const html = ReactDOM.renderToString(
      <App store={store} packages={Object.values(activatedPackages)} />,
    );
    const chunkNames = flushChunkNames();

    const { cssHashRaw, scripts, stylesheets } = flushChunks(ref.clientStats, { chunkNames });

    const { css } = extractCritical(html);
    const helmet = Helmet.renderStatic();

    const publicPath = req.query.static ? `${req.query.static.replace(/\/$/g, '')}/` : '/';
    const serverType = req.query.serverType === 'prod' ? 'prod' : 'pre';

    const bootstrapFileName = scripts.filter(script => /bootstrap/.test(script));
    const scriptsWithoutBootstrap = scripts.filter(script => !/bootstrap/.test(script));

    const chunksForArray = scriptsWithoutBootstrap.map(script => `'${script}'`).join(',');
    const bootstrapString = await readFile(
      `${buildPath}/.build/pwa/client/${bootstrapFileName}`,
      'utf8',
    );

    const preloadScripts = scriptsWithoutBootstrap
      .map(script => `<link rel="preload" href="${publicPath}static/${script}" as="script">`)
      .join('\n');

    const loadStyles = stylesheets
      .map(
        style =>
          `<link rel="stylesheet" charset="utf-8" type="text/css" href="${publicPath}static/${style}" />`,
      )
      .join('\n');

    const cssHash = JSON.stringify(mapValues(cssHashRaw, hash => `${publicPath}static/${hash}`));

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
            ${loadStyles}
            ${preloadScripts}
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <style>${css}</style>
          </head>
          <body ${helmet.bodyAttributes.toString()}>
            <div id="root">${html}</div>
            <script>
              window.__CSS_CHUNKS__ = ${cssHash};
              window.__wp_pwa__ = {
                static: '${publicPath}static/',
                serverType: '${serverType}',
                activatedPackages: ${JSON.stringify(activatedPackages)},
                initialState: ${htmlescape(store.getState())}
              };
              var scripts = [${chunksForArray}];
              var loadScript = function(script) {
                if (document.getElementById(script)) return;
                var ref = document.getElementsByTagName('script')[0];
                var js = document.createElement('script');
                js.id = script;
                js.src = window.__wp_pwa__.static + script;
                ref.parentNode.insertBefore(js, ref);
              };
              scripts.forEach(function(sc) { loadScript(sc); });
              ${bootstrapString}
            </script>
          </body>
        </html>`,
    );
  } catch (error) {
    res.status(500).send(error);
  }
};
