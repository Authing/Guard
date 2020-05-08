const fs = require("fs");
const QiniuWebpackPlugin = require("better-qiniu-webpack-plugin");
const config = require("./config.js");
const productionConf = config.production;
const qiniuConf = productionConf.qiniu;
let plugins = [];
if (config && config.useCdn) {
  plugins.push(
    // 打包后的文件都上传至七牛云
    new QiniuWebpackPlugin({
      accessKey: qiniuConf.accessKey,
      secretKey: qiniuConf.secretKey,
      bucket: qiniuConf.bucket,
      bucketDomain: qiniuConf.bucketDomain,
      matchFiles: ["!*.html", "!*.map"],
      uploadPath: productionConf.distPath,
      batch: 10,
      // 是否增量构建
      deltaUpdate: true,
    })
  );
}

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    output: {
      libraryExport: "default",
    },
    plugins,
  },
  css: { extract: false },
  publicPath: process.env.NODE_ENV === "production" ? "/login" : "/",
  devServer: {
    https: {
      key: fs.readFileSync("./ssl/privkey1.pem"),
      cert: fs.readFileSync("./ssl/cert1.pem"),
    },
    disableHostCheck: true,
    port: 443,
    proxy: {
      "^/authorize": {
        // target: 'https://sso.authing.cn/sso',
        target: "https://core.hep.authing.co/sso",
        changeOrigin: true,
      },
      "^/oauth": {
        //  target: 'https://sso.authing.cn/',
        target: "https://core.hep.authing.co/",
        changeOrigin: true,
      },
      "^/cas/session": {
        //  target: 'https://sso.authing.cn/',
        target: "https://core.hep.authing.co/",
        changeOrigin: true,
      },
    },
  },
};
