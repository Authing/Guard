import Vue from 'vue';
import App from './App.vue';
import Authing from 'authing-js-sdk';

var AuthingForm = function (opts) {
  var

    PLACEHOLDER_TEXT = {
      'USERNAME': '请输入用户名',
      'EMAIL': '请输入邮箱',
      'PASSWORD': '请输入密码',
      'CONFIRM_PASSWORD': '请确认密码',
      'VERIFY_CODE': '请输入验证码',
      'NEW_PASSWORD': '请输入新密码'
    },


    appMountId = '_authing_login_form',
    // appMountId = 'app',

    $authing = this;

  $authing.eventsList = {
    'authingload': [],
    'authingunload': [],

    'oauthload': [],
    'oauthunload': [],

    'login': [],
    'loginerror': [],
    'register': [],
    'registererror': [],

    'emailsent': [],
    'resetpassword': [],
    'resetpassworderror': [],

    'scanning': [],
    'scanningerror': [],
    'scanningintervalstarting': [],

    'formclosed': [],
  };

  $authing.opts = opts;

  $authing.opts.hideQRCode = opts.hideQRCode || false;
  $authing.opts.hideUP = opts.hideUP || false;
  $authing.opts.hideOAuth = opts.hideOAuth || false;
  $authing.opts.hideUsername = opts.hideUsername || false;
  $authing.opts.hideClose = opts.hideClose || false;

  $authing.opts.forceLogin = opts.forceLogin || false;
  $authing.opts.title = opts.title || 'Authing';
  $authing.opts.logo = opts.logo || 'https://cdn.authing.cn/authing-logo.png';

  $authing.opts.mountId = opts.mountId || null;
  // 初始化小程序扫码登录配置 
  if (opts.qrcodeScanning) {
    opts.qrcodeScanning.redirect = !!opts.qrcodeScanning.redirect;
    opts.qrcodeScanning.interval = opts.qrcodeScanning.interval || 1500;
    opts.qrcodeScanning.tips = opts.qrcodeScanning.tips || null;
  }

  // 初始化 placeholder
  if (opts.placeholder) {
    opts.placeholder.username = opts.placeholder.username || PLACEHOLDER_TEXT.USERNAME;
    opts.placeholder.email = opts.placeholder.email || PLACEHOLDER_TEXT.EMAIL;
    opts.placeholder.password = opts.placeholder.password || PLACEHOLDER_TEXT.PASSWORD;
    opts.placeholder.confirmPassword = opts.placeholder.confirmPassword || PLACEHOLDER_TEXT.USERNAME;
    opts.placeholder.verfiyCode = opts.placeholder.verfiyCode || PLACEHOLDER_TEXT.VERIFY_CODE;
    opts.placeholder.newPassword = opts.placeholder.newPassword || PLACEHOLDER_TEXT.NEW_PASSWORD;
  } else {
    opts.placeholder = {
      username: PLACEHOLDER_TEXT.USERNAME,
      email: PLACEHOLDER_TEXT.EMAIL,
      password: PLACEHOLDER_TEXT.PASSWORD,
      confirmPassword: PLACEHOLDER_TEXT.CONFIRM_PASSWORD,
      verfiyCode: PLACEHOLDER_TEXT.VERIFY_CODE,
      newPassword: PLACEHOLDER_TEXT.NEW_PASSWORD
    };
  }

  //初始化 host
  if (opts.host) {
    opts.host.users = opts.host.users || 'https://users.authing.cn/graphql';
    opts.host.oauth = opts.host.oauth || 'https://oauth.authing.cn/graphql';    
  } else {
    opts.host = {
      users: 'https://users.authing.cn/graphql',
      oauth: 'https://oauth.authing.cn/graphql'
    }
  }

  $authing.opts.placeholder = opts.placeholder;
  $authing.opts.host = opts.host;

  window.$authing = $authing;
  window.appMountId = appMountId;
  window.emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

  var target = document.getElementById(appMountId) || document.getElementById(opts.mountId) || document.body;
  var newMount = document.createElement('div');
  newMount.setAttribute('id', '_authing_login_form');
  if(!(appMountId || opts.mountId)) {
    newMount.classList.add('authing-login-form-modal')
  }
  target.appendChild(newMount);
  var isMountedInModal = false;
  if (!appMountId) {
    isMountedInModal = true;
  }
  new Vue({
    el: '#_authing_login_form',
    render: h => h(App),
    data: {
      isMountedInModal: isMountedInModal
    }
  });
};

AuthingForm.prototype = {
  show: function (appMountId) {
    console.log(this);
    var target = document.getElementById(appMountId) || document.getElementById(this.opts.mountId) || document.body;
    var newMount = document.createElement('div');
    newMount.setAttribute('id', '_authing_login_form');
    if(!(appMountId || this.opts.mountId)) {
      newMount.classList.add('authing-login-form-modal')
    }
    target.appendChild(newMount);
    var isMountedInModal = false;
    if (!appMountId) {
      isMountedInModal = true;
    }
    new Vue({
      el: '#_authing_login_form',
      render: h => h(App),
      data: {
        isMountedInModal: isMountedInModal
      }
    });
  },

  hide: function () {
    document.getElementById('_authing_login_form').remove()
  },

  on: function (eventName, cb) {
    eventName = eventName.toLowerCase();
    if (cb && eventName && this.eventsList[eventName]) {
      this.eventsList[eventName].push(cb);
    }
  },

  pub: function (eventName, params) {
    eventName = eventName.toLowerCase();
    if (eventName && this.eventsList[eventName]) {
      for (var i = 0; i < this.eventsList[eventName].length; i++) {
        var cb = this.eventsList[eventName][i];
        cb(params);
      }
    }
  }
};

if(window) {
  window.AuthingForm = AuthingForm;
}

export default AuthingForm;
