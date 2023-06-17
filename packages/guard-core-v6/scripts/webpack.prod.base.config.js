const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: {
        compress: {
          drop_console: true
        },
        format: {
          comments: true
        }
      }
    })]
  }
}