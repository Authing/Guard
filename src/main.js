/* jshint esversion: 6 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Authing from 'authing-js-sdk';
import GraphQL from './graphql';
import './styles/styles.css';
import './styles/animations.css';

Vue.config.productionTip = false;

var AuthingGuard = function (appId, domain, opts) {

  this.checkDomain();

  let clientId = '';

  window.Authing = Authing;

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
    'authenticated': [],
    'authenticatedOnError': [],

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

  opts = opts || {};
  $authing.opts = opts || {};

  $authing.opts.clientId = clientId;
  $authing.opts.appId = appId;
  $authing.opts.domain = domain;

  $authing.opts.isSSO = opts.isSSO || false;
  $authing.opts.hideQRCode = opts.hideQRCode || false;
  $authing.opts.hideUP = opts.hideUP || false;
  $authing.opts.hideOAuth = opts.hideOAuth || true;
  $authing.opts.hideUsername = opts.hideUsername || false;
  $authing.opts.hideClose = opts.hideClose || false;

  $authing.opts.SSOHost = opts.SSOHost || 'https://sso.authing.cn';
  $authing.opts.forceLogin = opts.forceLogin || false;
  $authing.opts.title = opts.title || null;
  $authing.opts.logo = opts.logo || null;

  this.initLinks($authing.opts.SSOHost);

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
    opts.host.user = opts.host.user || 'https://users.authing.cn/graphql';
    opts.host.oauth = opts.host.oauth || 'https://oauth.authing.cn/graphql';    
  } else {
    opts.host = {
      users: 'https://user.authing.cn/graphql',
      oauth: 'https://oauth.authing.cn/graphql',
    };
  }

  $authing.opts.placeholder = opts.placeholder;
  $authing.opts.host = opts.host;
  $authing.opts.timestamp = Math.round(new Date() / 1000);
  $authing.opts.nonce = Math.ceil(Math.random() * Math.pow(10, 6));

  // window.$authing = $authing;
  // window.appMountId = appMountId;
  let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

  var target = document.getElementById(appMountId) || document.getElementById(opts.mountId) || document.body;
  var newMount = document.createElement('div');
  newMount.setAttribute('id', '_authing_login_form');
  if(!(appMountId || opts.mountId)) {
    newMount.classList.add('authing-login-form-modal');
  }
  target.appendChild(newMount);
  var isMountedInModal = false;
  if (!appMountId) {
    isMountedInModal = true;
  }
  new Vue({
    el: '#_authing_login_form',
    router,
    store,
    render: h => h(App),
    data: {
      isMountedInModal: isMountedInModal,
      $authing: $authing,
      emailExp: emailExp,
      appMountId: appMountId,
      SSOHost: opts.SSOHost || 'https://sso.authing.cn',
    }
  });
};

AuthingGuard.prototype = {
  initLinks: function(ssoHost) {
    const state = this.querySearch('state') || '';
    const appId = this.querySearch('app_id') || this.querySearch('client_id') || '';
    const redirectURI = this.querySearch('redirect_uri') || '';
    const responseType = this.querySearch('response_type') || 'code';
    const scope = this.querySearch('scope') || Math.ceil(Math.random() * Math.pow(10, 6));
    this.userAuthorizeURL = `${ssoHost}/login/authorize/confirm?app_id=${appId}&state=${state}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=${scope}`;
    this.sysAuthorizeURL = `${ssoHost}/authorize?app_id=${appId}&state=${state}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=${scope}&authorization_header=${localStorage.getItem(
      "_authing_token"
    )}&confirm_authorize=1`;
  },

  checkDomain: function() {
    const getSecondLvlDomain = function() {
      const host = location.host;
      const hostSplit = host.split('.');
      return {
        isSecond: hostSplit.length === 3,
        domain: hostSplit[0],
      };
    }
  
    const secondLvlDomain = getSecondLvlDomain();
  
    if (secondLvlDomain.isSecond) {
      if (secondLvlDomain.domain !== 'sso') {
        const oAuthGql = new GraphQL({
          baseURL: "https://oauth.authing.cn/graphql"
        });
        const query =
          `query {
              QueryAppInfoByDomain (domain: "` + secondLvlDomain.domain + `") {   
                _id,
                name,
              }
            }`;
        oAuthGql.request({ query })
          .then(e => {
            const appInfo = e.QueryAppInfoByDomain;
            if (!appInfo) {
              location.href = 'https://authing.cn';
            }else {
              if (this.querySearch('app_id') || this.querySearch('client_id')) {
                // no nothing
                const app_id = this.querySearch('app_id') || this.querySearch('client_id');
                if(app_id != appInfo._id) {
                  location.href = `${location.origin}/login?app_id=${appInfo._id}`;
                }
              }else {
                // redirect to uri with app_id
                location.href = `${location.origin}/login?app_id=${appInfo._id}`;
              }
            }
          });
      }
    }
  },

  querySearch: function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i=0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) { return pair[1]; }
    }
    return false;
  },

  show: function (appMountId) {
    var target = document.getElementById(appMountId) || document.getElementById(this.opts.mountId) || document.body;
    var newMount = document.createElement('div');
    newMount.setAttribute('id', '_authing_login_form');

    if(!(appMountId || this.opts.mountId)) {
      newMount.classList.add('authing-login-form-modal');
    }

    target.appendChild(newMount);

    let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

    var isMountedInModal = false;

    if (!appMountId) {
      isMountedInModal = true;
    }

    new Vue({
      router,
      store,
      render: h => h(App),
      data: {
        isMountedInModal,
        $authing: this,
        emailExp: emailExp,
        appMountId: appMountId,
        SSOHost: opts.SSOHost || 'https://sso.authing.cn',
      }
    }).$mount('#_authing_login_form');
  },

  hide: function () {
    document.getElementById('_authing_login_form').remove();
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
  },

  isLogged: function() {
    let appToken = localStorage.getItem('appToken');

    if (appToken) {
      try {
        appToken = JSON.parse(appToken);
      }catch(error) {
        appToken = {};
      }
    }else {
      appToken = {};
    }

    return (appToken[this.opts.appId] && appToken[this.opts.appId].accessToken);
  },

  async sysAuthorize () {
    this.initLinks(this.opts.SSOHost);
    location.href = this.sysAuthorizeURL;
  },

  userAuthorize: function() {
    location.href = this.userAuthorizeURL;
  },
};

if(window) {
  window.AuthingGuard = AuthingGuard;
}

export default AuthingGuard;
