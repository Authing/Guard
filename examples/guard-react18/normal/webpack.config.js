const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir, file = '') {
  return path.resolve(__dirname, './', dir, file);
}

module.exports = {
  mode: 'none',
  entry: resolve('index.tsx'),
  output: {
    filename: 'bundle.js',
    path: resolve('dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('./index.html'),
      filename: 'index.html',
      env: process.env.NODE_ENV,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
      },
    }),
  ],
  devServer: {
    host: 'localhost',
    inline: false, // 启用热更新
    port: 3000,
    progress: true,
    contentBase: resolve('./'),
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    open: true,
    openPage: '../',
  },
  node: {
    fs: 'empty'
  }
};
