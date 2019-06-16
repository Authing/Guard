/* jshint esversion: 6 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import Authing from "authing-js-sdk";
import "./styles/styles.css";
import "./styles/animations.css";

Vue.config.productionTip = false;
var AuthingGuard = function(appId, domain, opts) {
  let clientId = appId || "";

  window.Authing = Authing;

  var PLACEHOLDER_TEXT = {
      USERNAME: "请输入用户名",
      EMAIL: "请输入邮箱或用户名",
      PASSWORD: "请输入密码",
      CONFIRM_PASSWORD: "请确认密码",
      VERIFY_CODE: "请输入验证码",
      NEW_PASSWORD: "请输入新密码",
      PHONE: "请输入手机号",
      PHONE_CODE: "4 位验证码"
    },
    $authing = this;

  $authing.eventsList = {
    "authing-load": [],
    "authing-unload": [],

    authenticated: [],
    "authenticated-error": [],

    "social-load": [],
    "social-unload": [],

    login: [],
    "login-error": [],
    register: [],
    "register-error": [],

    "email-sent": [],
    "reset-password": [],
    "reset-password-error": [],

    scanning: [],
    "scanned-error": [],
    "scanning-interval-starting": [],

    "form-closed": []
  };

  opts = opts || {};
  $authing.opts = opts || {};

  $authing.opts.clientId = clientId;
  $authing.opts.appId = appId;
  $authing.opts.domain = domain;
  $authing.opts.protocol = opts.protocol;

  $authing.opts.hideQRCode = opts.hideQRCode || false;
  $authing.opts.hideUP = opts.hideUP || false;
  $authing.opts.hideSocial = opts.hideSocial || true;
  $authing.opts.hideUsername = opts.hideUsername || false;
  $authing.opts.hideClose = opts.hideClose || false;

  $authing.opts.isSSO = opts.isSSO || false;
  $authing.opts.SSOHost = opts.SSOHost || "https://sso.authing.cn";
  $authing.opts.forceLogin = opts.forceLogin || false;
  $authing.opts.title = opts.title || null;
  $authing.opts.logo = opts.logo || null;

  // this.initLinks($authing.opts.SSOHost);

  $authing.opts.mountId = opts.mountId || null;
  // 初始化小程序扫码登录配置
  if (opts.qrcodeScanning) {
    opts.qrcodeScanning.redirect = !!opts.qrcodeScanning.redirect;
    opts.qrcodeScanning.interval = opts.qrcodeScanning.interval || 1500;
    opts.qrcodeScanning.tips = opts.qrcodeScanning.tips || null;
  }
  // 初始化 placeholder 配置
  if (opts.placeholder) {
    opts.placeholder.username =
      opts.placeholder.username || PLACEHOLDER_TEXT.USERNAME;
    opts.placeholder.email = opts.placeholder.email || PLACEHOLDER_TEXT.EMAIL;
    opts.placeholder.password =
      opts.placeholder.password || PLACEHOLDER_TEXT.PASSWORD;
    opts.placeholder.confirmPassword =
      opts.placeholder.confirmPassword || PLACEHOLDER_TEXT.CONFIRM_PASSWORDs;
    opts.placeholder.verfiyCode =
      opts.placeholder.verfiyCode || PLACEHOLDER_TEXT.VERIFY_CODE;
    opts.placeholder.newPassword =
      opts.placeholder.newPassword || PLACEHOLDER_TEXT.NEW_PASSWORD;
    opts.placeholder.phone = opts.placeholder.phone || PLACEHOLDER_TEXT.PHONE;
    opts.placeholder.phoneCode =
      opts.placeholder.phoneCode || PLACEHOLDER_TEXT.PHONE_CODE;
  } else {
    opts.placeholder = {
      username: PLACEHOLDER_TEXT.USERNAME,
      email: PLACEHOLDER_TEXT.EMAIL,
      password: PLACEHOLDER_TEXT.PASSWORD,
      confirmPassword: PLACEHOLDER_TEXT.CONFIRM_PASSWORD,
      verfiyCode: PLACEHOLDER_TEXT.VERIFY_CODE,
      newPassword: PLACEHOLDER_TEXT.NEW_PASSWORD,
      phone: PLACEHOLDER_TEXT.PHONE,
      phoneCode: PLACEHOLDER_TEXT.PHONE_CODE
    };
  }

  //初始化 host
  if (opts.host) {
    opts.host.user = opts.host.user || "https://users.authing.cn/graphql";
    opts.host.oauth = opts.host.oauth || "https://oauth.authing.cn/graphql";
  } else {
    opts.host = {
      user: "https://users.authing.cn/graphql",
      oauth: "https://oauth.authing.cn/graphql"
    };
  }

  $authing.opts.placeholder = opts.placeholder;
  $authing.opts.host = opts.host;
  $authing.opts.timestamp = Math.round(new Date() / 1000);
  $authing.opts.nonce = Math.ceil(Math.random() * Math.pow(10, 6));

  let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

  var target = document.getElementById(opts.mountId) || document.body;
  var newMount = document.createElement("div");
  newMount.setAttribute("id", "_authing_login_form");
  if (!opts.mountId) {
    newMount.classList.add("authing-login-form-modal");
  }
  target.appendChild(newMount);
  var isMountedInModal = false;
  if (!opts.mountId) {
    isMountedInModal = true;
  }
  new Vue({
    el: `#${opts.mountId}` || "#_authing_login_form",
    router,
    store,
    render: h => h(App),
    data: {
      isMountedInModal: isMountedInModal,
      $authing: $authing,
      emailExp: emailExp,
      appMountId: opts.mountId,
      SSOHost: opts.SSOHost || location.origin,
      opts: opts
    }
  });
};

AuthingGuard.prototype = {
  show: function(appMountId) {
    var target =
      document.getElementById(appMountId) ||
      document.getElementById(this.opts.mountId) ||
      document.body;
    var newMount = document.createElement("div");
    newMount.setAttribute("id", "_authing_login_form");

    if (!(appMountId || this.opts.mountId)) {
      newMount.classList.add("authing-login-form-modal");
    }

    target.appendChild(newMount);

    let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

    var isMountedInModal = false;

    if (!appMountId) {
      isMountedInModal = true;
    }

    new Vue({
      el: `#${appMountId}` || `#${this.opts.mountId}` || "#_authing_login_form",
      router,
      store,
      render: h => h(App),
      data: {
        isMountedInModal,
        $authing: this,
        emailExp: emailExp,
        appMountId: appMountId || this.opts.mountId,
        SSOHost: opts.SSOHost || "https://sso.authing.cn",
        opts: this.opts
      }
    });
  },

  hide: function() {
    document.getElementById("_authing_login_form").remove();
  },

  on: function(eventName, cb) {
    eventName = eventName.toLowerCase();
    if (cb && eventName && this.eventsList[eventName]) {
      this.eventsList[eventName].push(cb);
    }
  },

  pub: function(eventName, params) {
    eventName = eventName.toLowerCase();
    if (eventName && this.eventsList[eventName]) {
      for (var i = 0; i < this.eventsList[eventName].length; i++) {
        var cb = this.eventsList[eventName][i];
        cb(params);
      }
    }
  }
};

export default AuthingGuard;
