/* eslint-disable global-require, no-console */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const webpack = require('webpack');

const dev = process.env.NODE_ENV !== 'production';

// Turn webpack into a promise.
const webpackPromise = (clientConfig, serverConfig) =>
  new Promise((resolve, reject) => {
    webpack([clientConfig, serverConfig]).run((err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });

const clean = () => {
  // Delete current build.
  rimraf.sync('build/pwa');

  // Create info file.
  mkdirp.sync('build/pwa');
  const buildInfo = {
    buildPath: path.resolve(__dirname, '../..'),
    nodeEnv: dev ? 'development' : 'production',
  };
  fs.writeFileSync('build/pwa/buildInfo.json', JSON.stringify(buildInfo, null, 2));
};

const build = async () => {
  // Clean everything.
  clean();
  // Import proper configuration files.
  const clientConfig = dev
    ? require('./webpack.client.dev')
    : require('./webpack.client.prod');
  const serverConfig = dev
    ? require('./webpack.server.dev')
    : require('./webpack.server.prod');

  // Run webpack and wait until it finishes. Then save clientStats to a file.
  const stats = await webpackPromise(clientConfig, serverConfig);
  const clientStats = stats.toJson().children[0];
  fs.writeFileSync('build/pwa/clientStats.json', JSON.stringify(clientStats, null, 2));

  // Return webpack stats.
  return stats;
};

module.exports = {
  build,
  clean,
};
