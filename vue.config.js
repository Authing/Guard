module.exports = {
  lintOnSave: false,
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  css: { extract: false },
  publicPath: process.env.NODE_ENV === 'production' ? '/login' : '/',
  devServer: {
    proxy: {
      '^/authorize': {
        target: 'http://sso.authing.cn',  //sso.authing.cn
        changeOrigin: true
      },
      '^/oauth': {
        target: 'http://sso.authing.cn', //sso.authing.cn
        changeOrigin: true
      }
    }
  }
}