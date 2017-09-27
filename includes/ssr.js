/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom/server';
import path from 'path';
import fs from 'fs';
import createHistory from 'history/createMemoryHistory';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { extractCritical } from 'emotion-server';
import App from '../includes/components/App';

export default ref => (req, res) => {
  const history = createHistory({ initialEntries: [req.path] });
  const app = ReactDOM.renderToString(<App history={history} />);
  const chunkNames = flushChunkNames();

  const buildPath = require('../.worona/buildInfo.json').buildPath;

  const { js, styles, cssHash, scripts, stylesheets } = flushChunks(ref.clientStats, {
    chunkNames,
  });

  const { css } = extractCritical(app);

  const chunksForArray = scripts
    .filter(sc => !/bootstrap/.test(sc))
    .map(sc => `'${sc}'`)
    .join(',');
  const bootstrapFileName = scripts.filter(sc => /bootstrap/.test(sc));
  const bootstrapPath = path.resolve();
  const bootstrapString = fs.readFileSync(
    `${buildPath}/.worona/buildClient/${bootstrapFileName}`,
    'utf8'
  );

  console.log('> Path: ', req.path);
  console.log('> Dynamic chunks rendered: ', chunkNames);
  console.log('> Scripts served: ', scripts);
  console.log('> stylesheets served: ', stylesheets);
  console.log();

  res.send(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <title>Worona</title>
          ${styles}
          <style>${css}</style>
        </head>
        <body>
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
