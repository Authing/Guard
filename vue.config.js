// const path = require('path')
// const fs = require('fs')
let host = process.env.ServerHost||'http://localhost:5510'
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    output: {
      libraryExport: "default"
    }
  },
  css: { extract: false },
  publicPath: process.env.NODE_ENV === "production" ? "/login" : "/",
  devServer: {
    https: true,
    // cert: fs.readFileSync(path.join(__dirname,'ssl/fullchain1.pem')),
    // key: fs.readFileSync(path.join(__dirname,'ssl/privkey1.pem')),
    disableHostCheck: true,
    port: 443,
    proxy: {
      "^/authorize": {
        target: `${host}/sso`,
        changeOrigin: true
      },
      "^/oauth": {
        target: `${host}`,
        changeOrigin: true
      },
      "^/cas/session": {
        target: `${host}`,
        changeOrigin: true
      }
    }
  }
};
