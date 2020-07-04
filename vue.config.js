const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
// const path = require("path")
// const fs = require("fs")

let host = process.env.ServerHost || "http://localhost:5510";
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    output: {
      libraryExport: "default",
    },
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
        API_ENDPOINT: process.env.API_ENDPOINT,
        PUBLIC_KEY: process.env.PUBLIC_KEY,
        inject: true,
        template: "public/index.html",
      }),
    ],
  },
  css: { extract: false },
  publicPath: process.env.Container?"/":process.env.NODE_ENV === "production" ? "/login" : "/",
  devServer: {
    https: true,
    // cert: fs.readFileSync(path.join(__dirname,'ssl/214413890430280.pem')),
    // key: fs.readFileSync(path.join(__dirname,'ssl/214413890430280.key')),
    disableHostCheck: true,
    port: 443,
    proxy: {
      "^/authorize": {
        target: `${host}/sso`,
        changeOrigin: true,
      },
      "^/oauth": {
        target: `${host}`,
        changeOrigin: true,
      },
      "^/cas/session": {
        target: `${host}`,
        changeOrigin: true,
      },
    },
  },
};
