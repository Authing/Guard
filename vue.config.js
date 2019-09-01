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
        // target: 'https://sso.authing.cn/sso',
        target: 'http://sso.authing.cn/sso',
        changeOrigin: true
      },
      '^/oauth': {
        // target: 'https://sso.authing.cn/',
        target: 'http://sso.authing.cn/sso',
        changeOrigin: true
      }
    }
  }
}