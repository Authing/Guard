module.exports = {
  // 修改 src 为 examples
  // pages: {
  //   index: {
  //     entry: 'examples/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html'
  //   }
  // },
  lintOnSave: false,
  publicPath: '/login',
  devServer: {
    proxy: {
      '^/authorize': {
        target: 'https://sso.authing.cn/',
        changeOrigin: true
      }
    }
  }
}