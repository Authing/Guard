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
        target: 'http://localhost:5556/sso',
        changeOrigin: true
      },
      '^/oauth': {
        // target: 'https://sso.authing.cn/',
        target: 'http://localhost:5556/',
        changeOrigin: true
      }
    }
  }
}