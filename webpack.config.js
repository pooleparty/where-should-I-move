const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const productionEnvPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
});

const PATHS = {
  build: path.resolve(__dirname, 'public/bundles'),
  src: path.resolve(__dirname, 'src'),
};

const entry = './src/client/index.jsx';
const extractTextPluginConfig = new ExtractTextPlugin('bundle.css');

const baseConfig = {
  devtool: 'source-map',
  context: path.join(process.cwd()),
  entry,
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [PATHS.src],
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: extractTextPluginConfig.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },
    ],
  },
  plugins: [extractTextPluginConfig],
};

const envConfig = new Proxy(
  {
    dev: {},
    dist: {
      devtool: false,
      plugins: [productionEnvPlugin],
    },
  },
  {
    // Proxy will force dev configuration to be returned
    // if no matching environment found
    get(target, name) {
      if (target[name]) {
        return target[name];
      }
      return target.dev;
    },
  },
);

module.exports = env => merge(baseConfig, envConfig[env]);
