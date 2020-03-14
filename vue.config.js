const fs = require("fs");
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
    https: {
      key: fs.readFileSync("./ssl/privkey1.pem"),
      cert: fs.readFileSync("./ssl/cert1.pem")
    },
    disableHostCheck: true,
    port: 443,
    proxy: {
      "^/authorize": {
        // target: 'https://sso.authing.cn/sso',
        target: "https://core.hep.authing.co/sso",
        changeOrigin: true
      },
      "^/oauth": {
        //  target: 'https://sso.authing.cn/',
        target: "https://core.hep.authing.co/",
        changeOrigin: true
      },
      "^/cas/session": {
        //  target: 'https://sso.authing.cn/',
        target: "https://core.hep.authing.co/",
        changeOrigin: true
      }
    }
  }
};
