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
  rimraf.sync('.worona');

  // Create info file.
  mkdirp.sync('.worona');
  const buildInfo = {
    buildPath: path.resolve(__dirname, '..'),
    nodeEnv: dev ? 'development' : 'production',
  };
  fs.writeFileSync('.worona/buildInfo.json', JSON.stringify(buildInfo, null, 2));
};

const build = async () => {
  // Clean everything.
  clean();
  // Import proper configuration files.
  const clientConfig = dev
    ? require('../scripts/webpack.client.dev')
    : require('../scripts/webpack.client.prod');
  const serverConfig = dev
    ? require('../scripts/webpack.server.dev')
    : require('../scripts/webpack.server.prod');

  // Run webpack and wait until it finishes. Then save clientStats to a file.
  const stats = await webpackPromise(clientConfig, serverConfig);
  const clientStats = stats.toJson().children[0];
  fs.writeFileSync('.worona/clientStats.json', JSON.stringify(clientStats, null, 2));

  // Return webpack stats.
  return stats;
};

module.exports = {
  build,
  clean,
};
