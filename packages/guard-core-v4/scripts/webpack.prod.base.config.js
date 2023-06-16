const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin({
  //     extractComments: false,
  //     parallel: true,
  //     terserOptions: {
  //       compress: {
  //         drop_console: true
  //       },
  //       format: {
  //         comments: true
  //       }
  //     }
  //   })]
  // }
}