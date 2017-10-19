const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin'); // here so you can see what chunks are built
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const vendors = require('./vendors');
const { getNodeModules } = require('./utils');

module.exports = {
  name: 'client',
  target: 'web',
  // devtool: 'eval',
  entry: [
    ...vendors,
    `webpack-hot-middleware/client?path=${process.env.HMR_PATH ||
      '/'}__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false`,
    'react-hot-loader/patch',
    path.resolve(__dirname, '../init/client.js'),
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, '../../../.build/pwa/client'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            forceEnv: 'devClient',
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          ],
        }),
      },
    ],
  },
  resolve: {
    modules: ['node_modules', ...getNodeModules()],
  },
  plugins: [
    new WriteFilePlugin(),
    new ExtractCssChunks(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].js',
      minChunks: Infinity,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/vertx/),
    new webpack.WatchIgnorePlugin([/\.build/]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.RENDER': JSON.stringify('client'),
    }),
  ],
};
