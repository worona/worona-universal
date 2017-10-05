/* eslint-disable no-console, global-require */
import React from 'react';
import ReactDOM from 'react-dom/server';
import fs from 'fs';
import createHistory from 'history/createMemoryHistory';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { extractCritical } from 'emotion-server';
import { Helmet } from 'react-helmet';
import { buildPath } from '../../.worona/buildInfo.json';
import stores from './stores';
import App from './App';

export default ref => (req, res) => {
  const history = createHistory({ initialEntries: [req.path] });
  const app = ReactDOM.renderToString(<App history={history} stores={stores} />);
  const chunkNames = flushChunkNames();

  const { styles, cssHash, scripts, stylesheets } = flushChunks(ref.clientStats, { chunkNames });

  const { css } = extractCritical(app);
  const helmet = Helmet.renderStatic();

  const scriptsWithoutBootstrap = scripts.filter(sc => !/bootstrap/.test(sc));

  const chunksForArray = scriptsWithoutBootstrap.map(sc => `'${sc}'`).join(',');
  const bootstrapFileName = scripts.filter(sc => /bootstrap/.test(sc));
  const bootstrapString = fs.readFileSync(
    `${buildPath}/.worona/buildClient/${bootstrapFileName}`,
    'utf8'
  );
  const preloadScripts = scriptsWithoutBootstrap
    .map(sc => `<link rel="preload" href="/static/${sc}" as="script">`)
    .join('\n');

  console.log();
  console.log('>>> WARNING: Preload public path is still not working.');
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
          <div id="root">${app}</div>
          ${cssHash}
          <script>
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
