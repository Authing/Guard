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
  publicPath: '/',
  devServer: {
    proxy: {
      '^/authorize': {
        target: 'http://localhost:5556/sso',
        changeOrigin: true
      }
    }
  }
}