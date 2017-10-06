/* eslint-disable global-require, no-console */
require('colors');
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const { clean, build } = require('./build');
const { createApp, serverProd } = require('./serve');

const argv = require('minimist')(process.argv.slice(2));

const dev = process.env.NODE_ENV !== 'production';
const publicPath = process.env.PUBLIC_PATH;

const startDev = async () => {
  // If we are in dev mode, we need to run build as well, so first of all, let's clean .worona.
  clean();

  // Create the express app;
  const { app, done } = createApp();

  // Import proper configuration files.
  const clientConfig = require('./webpack.client.dev');
  const serverConfig = require('./webpack.server.dev');

  // Create webpack compilations.
  const compiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = compiler.compilers[0];
  const options = { publicPath, stats: { colors: true } };

  // Configure Express server.
  app.use('/static', express.static(path.resolve(__dirname, '../../../build/pwa/client')));
  app.use(webpackDevMiddleware(compiler, options));
  app.use(webpackHotMiddleware(clientCompiler));
  app.use(webpackHotServerMiddleware(compiler));

  // Start listening when finished.
  compiler.plugin('done', done);
};

const start = async () => {
  if (argv.build) {
    console.log(`> Building for ${dev ? 'development' : 'production'}...`);
    await build();
    console.log('> Finished.\n');
  } else if (argv.server) {
    serverProd();
  } else if (dev) {
    startDev();
  } else {
    console.log(`> Building for production...`);
    await build();
    console.log('> Finished.\n');
    serverProd();
  }
};

process.on('unhandledRejection', err => {
  console.error(err.stack.red);
  process.exit(1);
});

start();
