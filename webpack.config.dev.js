const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

const dev = {
  mode: 'development',
  // devtool: 'eval',
};

module.exports = merge(base, dev);
