const path = require('path');
module.exports = {
  entry: {
    Wsiox: path.resolve(__dirname, './index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      name: '[name]',
      type: 'umd',
      export: 'default',
    },
    // globalObject: 'window',//default 'self'
    scriptType: 'text/javascript',
  },
  resolve: {
    extensions: ['.js', '.mjs', '.css'],
    fallback: {
      cesium: path.resolve(__dirname, 'Cesium/Source/Cesium.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
      },
    ],
  },
};
