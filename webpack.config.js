const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './client/index.js',
  ],
  output: {
    path: path.resolve(__dirname, '/dist'),
    filename: 'bundle.js',
    publicPath: path.resolve(__dirname, "/dist")
  },
  devServer: {
    hot: true,
    publicPath: path.resolve(__dirname, '/dist'),
    proxy: {
      context: ['/api', '/signup', '/login'],
      target: 'http://localhost:3000'
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
       test: /\.(png|jpe?g|gif)$/i,
       use: [
         {
           loader: 'file-loader',
         },
       ],
     },
    ]
  },
};
