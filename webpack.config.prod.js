const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

const prod = {
  mode: 'production',
  // devtool: 'source-map',
  output: {
    filename: '[name].min.js',
  },
};

module.exports = merge(base, prod);
