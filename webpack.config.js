const path = require('path');
const env = require('babel-preset-env');
const runtime = require('babel-plugin-transform-runtime');
const restSpread = require('babel-plugin-transform-object-rest-spread');
const jsx = require('babel-plugin-transform-react-jsx');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [env],
            plugins: [runtime, restSpread, jsx],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
