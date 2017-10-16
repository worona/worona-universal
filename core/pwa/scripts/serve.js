/* eslint-disable global-require, no-console, import/no-unresolved */
const express = require('express');
const cors = require('cors');
const noFavicon = require('express-no-favicons');

const createServer = app => {
  if (process.env.HTTPS_SERVER) {
    const server = require('https').createServer;
    const readFileSync = require('fs').readFileSync;
    const options = {
      key: readFileSync('core/certs/localhost.key'),
      cert: readFileSync('core/certs/localhost.crt'),
    };
    return server(options, app);
  }
  const server = require('http').createServer;
  return server(app);
};

const createApp = () => {
  // Create the server.
  const app = express();
  app.use(noFavicon());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Create a function to start listening after webpack has finished.
  let isBuilt = false;
  const done = () =>
    !isBuilt &&
    createServer(app).listen(3000, () => {
      isBuilt = true;
      console.log(
        `\nSERVER STARTED -- Listening @ ${process.env.HTTPS_SERVER
          ? 'https'
          : 'http'}://localhost:3000`.magenta
      );
    });
  return { app, done };
};

const serverProd = () => {
  const { app, done } = createApp();
  // Check if a production build has been generated.
  const nodeEnv = require('../../../.build/pwa/buildInfo.json').nodeEnv;
  if (nodeEnv !== 'production') throw new Error("Please, run 'npm run build -- --prod' first.");

  // Start server with the clientStats.
  const clientStats = require('../../../.build/pwa/clientStats.json');
  const serverRender = require('../../../.build/pwa/server/main.js').default;
  app.use('/static', express.static('.build/pwa/client/'));
  app.use(serverRender({ clientStats }));
  done();
};

module.exports = {
  createApp,
  serverProd,
};
