const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: [path.resolve(__dirname, '../includes/ssr.js')],
  output: {
    path: path.resolve(__dirname, '../.worona/buildServer'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
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
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          }
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
