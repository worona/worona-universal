const path = require('path');
const webpack = require('webpack');
const { getNodeModules } = require('./utils');

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: [path.resolve(__dirname, '../init/server.js')],
  output: {
    path: path.resolve(__dirname, '../../../.build/pwa/server'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            forceEnv: 'server'
          },
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', ...getNodeModules()],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.RENDER': JSON.stringify('server'),
      'global.GENTLY': false,
    }),
    new webpack.NormalModuleReplacementPlugin(/^any-promise$/, 'promise-monofill'),
  ],
};
