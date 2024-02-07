"use strict";

var path = require('path');

var fs = require('fs');

var Webpack = require('webpack');

var _require = require('webpack-merge'),
    merge = _require.merge;

var dotenv = require('dotenv');

var autoprefixer = require('autoprefixer');

var baseWebpackConfig = require('./webpack.base.conf');

var getClientEnvironment = require('./utils/env'); // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use


var dotenvFiles = [path.resolve(__dirname, '../.env.development.local'), path.resolve(__dirname, '../.env.test.local'), path.resolve(__dirname, '../.env.local'), path.resolve(__dirname, '../.env.development'), path.resolve(__dirname, '../.env.test'), path.resolve(__dirname, '../.env')].filter(function (dotenvFile) {
  return fs.existsSync(dotenvFile);
});
console.log("".concat(dotenvFiles[0], " will be used.\n")); // Load env variables

dotenv.config({
  path: dotenvFiles[0]
});
var clientEnv = getClientEnvironment('development');
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    chunkFilename: 'assets/js/[name].chunk.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 8888,
    watchFiles: ['src/**/*'],
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },
  plugins: [new Webpack.DefinePlugin(clientEnv.stringified)],
  module: {
    rules: [{
      test: /\.ts?$/,
      exclude: function exclude(file) {
        return /node_modules\//.test(file);
      },
      use: ['babel-loader', {
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noEmit: false
          }
        }
      }]
    }, {
      test: /\.(js)$/,
      include: path.resolve(__dirname, '../src'),
      loader: 'babel-loader'
    }, {
      test: /\.s?css$/i,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [autoprefixer()]
          }
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }]
    }]
  }
});