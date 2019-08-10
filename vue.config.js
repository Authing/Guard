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
        target: 'http://localhost:5556/sso',
        changeOrigin: true
      },
      '^/oauth': {
        target: 'http://localhost:5556/',
        changeOrigin: true
      }
    }
  }
}