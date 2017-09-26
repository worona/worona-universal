const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin'); // here so you can see what chunks are built
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');

const publicPath = process.env.PUBLIC_PATH ? `${process.env.PUBLIC_PATH}static/` : '/static/';

module.exports = {
  name: 'client',
  target: 'web',
  // devtool: 'eval',
  entry: [
    `webpack-hot-middleware/client?path=${process.env.PUBLIC_PATH ||
      '/'}__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false`,
    'react-hot-loader/patch',
    path.resolve(__dirname, '../includes/index.js'),
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, '../.worona/buildClient'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
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
    new webpack.WatchIgnorePlugin([/\.worona/]),
    new webpack.DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new AutoDllPlugin({
      filename: '[name].js',
      entry: {
        vendors: ['react', 'react-dom', 'react-emotion', 'mobx'],
      },
    }),
  ],
};
